import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Song } from '../types';
import { useAuthContext } from '../components/auth/AuthContext';

export const useSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      setSongs([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'songs'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const songsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Song[];
      
      setSongs(songsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addSong = async (songData: Partial<Song>) => {
    if (!user) return;

    await addDoc(collection(db, 'songs'), {
      ...songData,
      authorId: user.uid,
      authorName: user.displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  };

  const updateSong = async (songId: string, songData: Partial<Song>) => {
    await updateDoc(doc(db, 'songs', songId), {
      ...songData,
      updatedAt: serverTimestamp()
    });
  };

  const deleteSong = async (songId: string) => {
    await deleteDoc(doc(db, 'songs', songId));
  };

  return { songs, loading, addSong, updateSong, deleteSong };
};