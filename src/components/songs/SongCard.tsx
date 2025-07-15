import React from 'react';
import { Heart, Eye, Music } from 'lucide-react';
import { Song } from '../../types';

interface SongCardProps {
  song: Song;
  onClick: () => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-amber-100 text-amber-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return difficulty;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-emerald-500 p-3 rounded-lg flex-shrink-0">
          <Music className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {song.title}
          </h3>
          <p className="text-gray-600 mb-3 truncate">por {song.artist}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
              {song.genre}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(song.difficulty)}`}>
              {getDifficultyLabel(song.difficulty)}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
              {song.originalKey}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {song.views}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {song.likes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};