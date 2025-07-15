import React, { useState } from 'react';
import { Song } from '../../types';
import { useScheduledSongs } from '../../hooks/useScheduledSongs';

interface ScheduleSongFormProps {
  song: Song;
  onClose: () => void;
}

export const ScheduleSongForm: React.FC<ScheduleSongFormProps> = ({ song, onClose }) => {
  const [date, setDate] = useState('');
  const [singer, setSinger] = useState('');
  const [notes, setNotes] = useState('');
  const { addScheduledSong } = useScheduledSongs();

// ScheduleSongForm.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const [y, m, d] = date.split('-').map(Number);
  const localDate = new Date(y, m - 1, d);
  addScheduledSong({
    songId: song.id,
    date: localDate, 
    singer,
    notes,
  });
  onClose();
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Agendar Música</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Música
            </label>
            <div className="mt-1 p-2 bg-gray-100 rounded">
              {song.title} - {song.artist}
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="singer" className="block text-sm font-medium text-gray-700">
              Cantor(a)
            </label>
            <input
              type="text"
              id="singer"
              value={singer}
              onChange={(e) => setSinger(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
 