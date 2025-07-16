import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Song } from '../types';
import { useAuthContext } from '../components/auth/AuthContext';

export const useSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  // Debug: Log do estado do usuário
  useEffect(() => {
    console.log('useSongs - Estado do usuário mudou:', {
      user: user ? {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        hasUid: !!user.uid,
        uidType: typeof user.uid
      } : null,
      hasUser: !!user
    });
  }, [user]);

  useEffect(() => {
    if (!user || !user.uid) {
      console.log('useSongs - Usuário não autenticado ou sem uid, limpando songs');
      setSongs([]);
      setLoading(false);
      return;
    }

    console.log('useSongs - Configurando listener para usuário:', user.uid);

    try {
      // Buscar apenas as músicas do usuário atual
      const q = query(
        collection(db, 'songs'), 
        where('authorId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const songsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as Song[];
        
        console.log('useSongs - Songs carregadas:', songsData.length);
        setSongs(songsData);
        setLoading(false);
      }, (error) => {
        console.error('useSongs - Erro ao buscar músicas:', error);
        setLoading(false);
      });

      return () => {
        console.log('useSongs - Limpando listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('useSongs - Erro ao configurar listener:', error);
      setLoading(false);
    }
  }, [user]);

  const addSong = async (songData: Partial<Song>) => {
    // Debug detalhado
    console.log('=== addSong - Início ===');
    console.log('songData recebido:', songData);
    console.log('Estado atual do user:', {
      user: user ? {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        hasUid: !!user.uid,
        uidType: typeof user.uid
      } : null,
      hasUser: !!user
    });

    // Verificação mais robusta
    if (!user) {
      console.error('addSong - Usuário é null/undefined');
      throw new Error('Usuário não autenticado - user é null');
    }

    if (!user.uid) {
      console.error('addSong - user.uid é null/undefined, user completo:', user);
      throw new Error('Usuário não autenticado - user.uid é null');
    }

    try {
      console.log('addSong - Tentando adicionar música para usuário:', user.uid);
      
      const docData = {
        ...songData,
        authorId: user.uid,
        authorName: user.displayName || 'Usuário',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('addSong - Dados que serão salvos:', docData);
      
      const docRef = await addDoc(collection(db, 'songs'), docData);
      
      console.log('addSong - Música adicionada com sucesso, ID:', docRef.id);
      console.log('=== addSong - Fim ===');
      
      return docRef.id;
    } catch (error) {
      console.error('addSong - Erro ao adicionar música:', error);
      console.log('=== addSong - Erro ===');
      throw error;
    }
  };

  const updateSong = async (songId: string, songData: Partial<Song>) => {
    if (!user || !user.uid) {
      console.error('updateSong - Usuário não autenticado');
      throw new Error('Usuário não autenticado!');
    }

    try {
      console.log('updateSong - Atualizando música:', songId);
      await updateDoc(doc(db, 'songs', songId), {
        ...songData,
        updatedAt: serverTimestamp()
      });
      console.log('updateSong - Música atualizada com sucesso');
    } catch (error) {
      console.error('updateSong - Erro ao atualizar música:', error);
      throw error;
    }
  };

  const deleteSong = async (songId: string) => {
    if (!user || !user.uid) {
      console.error('deleteSong - Usuário não autenticado');
      throw new Error('Usuário não autenticado!');
    }

    try {
      console.log('deleteSong - Deletando música:', songId);
      await deleteDoc(doc(db, 'songs', songId));
      console.log('deleteSong - Música deletada com sucesso');
    } catch (error) {
      console.error('deleteSong - Erro ao deletar música:', error);
      throw error;
    }
  };

  return { songs, loading, addSong, updateSong, deleteSong };
};