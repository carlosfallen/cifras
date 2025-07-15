import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ScheduledSong } from '../types';
import { useAuthContext } from '../components/auth/AuthContext';

type NewScheduledSong = Omit<ScheduledSong, 'id' | 'createdAt' | 'createdBy' | 'createdByName'>;

export const useScheduledSongs = () => {
  const { user } = useAuthContext();
  const [scheduledSongs, setScheduledSongs] = useState<ScheduledSong[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScheduledSongs = async () => {
    try {
      const scheduledSongsRef = collection(db, 'scheduledSongs');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const q = query(
        scheduledSongsRef,
        where('date', '>=', today)
      );
      
      const snapshot = await getDocs(q);
      const songs = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date.toDate(),
      })) as ScheduledSong[];
      
      setScheduledSongs(songs);
    } catch (error) {
      console.error('Error fetching scheduled songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const addScheduledSong = async (songData: NewScheduledSong) => {
    try {
      const scheduledSongsRef = collection(db, 'scheduledSongs');

      // songData já tem: songId, date, singer, notes?
      await addDoc(scheduledSongsRef, {
        ...songData,
        createdAt: new Date(),
        createdBy: user?.uid || null,
        createdByName: user?.displayName || 'Usuário Anônimo'
      });
      await fetchScheduledSongs();
    } catch (error) {
      console.error('Error adding scheduled song:', error);
    }
  };


  const removeScheduledSong = async (id: string) => {
    try {
      const songRef = doc(db, 'scheduledSongs', id);
      await deleteDoc(songRef);
      await fetchScheduledSongs();
    } catch (error) {
      console.error('Error removing scheduled song:', error);
    }
  };

  useEffect(() => {
    fetchScheduledSongs();
  }, []);

  return {
    scheduledSongs,
    loading,
    addScheduledSong,
    removeScheduledSong,
    fetchScheduledSongs,
  };
};
