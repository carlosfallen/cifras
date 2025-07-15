import React, { useState } from 'react';
import { ChevronLeft, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Song, MusicKey } from '../types';
import { transposeLyrics, formatLyricsWithChords, getAllKeys } from '../utils/chordTransposition';

interface SongViewerProps {
  song: Song;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SongViewer: React.FC<SongViewerProps> = ({ song, onBack, onEdit, onDelete }) => {
  const [currentKey, setCurrentKey] = useState<MusicKey>(song.originalKey as MusicKey);
  
  const keys = getAllKeys();
  const currentKeyIndex = keys.indexOf(currentKey);

  const transposeUp = () => {
    const nextIndex = (currentKeyIndex + 1) % keys.length;
    setCurrentKey(keys[nextIndex]);
  };

  const transposeDown = () => {
    const prevIndex = currentKeyIndex === 0 ? keys.length - 1 : currentKeyIndex - 1;
    setCurrentKey(keys[prevIndex]);
  };

  const transposedLyrics = currentKey === song.originalKey 
    ? formatLyricsWithChords(song.lyrics)
    : transposeLyrics(song.lyrics, song.originalKey as MusicKey, currentKey);

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta música?')) {
      onDelete();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              Voltar
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Excluir"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Song Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{song.title}</h1>
          <p className="text-xl text-gray-600">por {song.artist}</p>
        </div>

        {/* Transpose Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Tom:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={transposeDown}
                  className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Baixar tom"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
                <span className="font-bold text-lg text-blue-600 min-w-[2rem] text-center">
                  {currentKey}
                </span>
                <button
                  onClick={transposeUp}
                  className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Subir tom"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
            </div>

            {currentKey !== song.originalKey && (
              <div className="text-sm text-gray-500">
                Tom original: {song.originalKey}
              </div>
            )}
          </div>
        </div>

        {/* Song Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="chord-display-container bg-gray-50 p-6 rounded-lg border">
            <div 
              className="chord-display"
              dangerouslySetInnerHTML={{ __html: transposedLyrics }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};