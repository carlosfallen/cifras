import React from 'react';
import { Song } from '../../types';
import { SongCard } from './SongCard';

interface SongListProps {
  songs: Song[];
  onSongClick: (song: Song) => void;
  loading?: boolean;
}

export const SongList: React.FC<SongListProps> = ({ songs, onSongClick, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="bg-gray-200 p-3 rounded-lg w-12 h-12"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-2/3"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.071-2.33" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma música encontrada</h3>
        <p className="text-gray-600">Tente ajustar os filtros de busca ou adicionar novas músicas.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          onClick={() => onSongClick(song)}
        />
      ))}
    </div>
  );
};