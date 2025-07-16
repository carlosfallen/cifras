import React, { useState, useMemo } from 'react';
import { ChevronLeft, Edit, Trash2, ChevronUp, ChevronDown, Calendar, Music, MoreVertical } from 'lucide-react';
import { ScheduleSongForm } from './Calendar/ScheduleSongForm';
import { Song, MusicKey } from '../types';
import { getAllKeys } from '../utils/chordTransposition';
import { processChords, formatProcessedSongToHTMLWithTransposition } from '../utils/chordProcessing';

interface SongViewerProps {
  song: Song;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SongViewer: React.FC<SongViewerProps> = ({ song, onBack, onEdit, onDelete }) => {
  const [currentKey, setCurrentKey] = useState<MusicKey>(song.originalKey as MusicKey);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  
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

  // Processa a cifra uma única vez
  const processedSong = useMemo(() => {
    return processChords(song.lyrics);
  }, [song.lyrics]);

  // Gera o HTML com transposição mantendo o layout original
  const displayedLyrics = useMemo(() => {
    return formatProcessedSongToHTMLWithTransposition(
      processedSong,
      song.originalKey as MusicKey,
      currentKey
    );
  }, [processedSong, song.originalKey, currentKey]);

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta música?')) {
      onDelete();
    }
    setShowActionsMenu(false);
  };

  const formatLabels = {
    brackets: 'Colchetes',
    above: 'Acordes acima',
    mixed: 'Formato misto'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-50"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Voltar</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Schedule Button */}
              <button
                onClick={() => setShowScheduleForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-300 active:scale-95"
                title="Agendar música"
              >
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Agendar</span>
              </button>

              {/* Edit Button */}
              <button
                onClick={onEdit}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-300 active:scale-95"
                title="Editar música"
              >
                <Edit className="h-4 w-4" />
                <span className="text-sm font-medium">Editar</span>
              </button>

              {/* More Actions Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowActionsMenu(!showActionsMenu)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                
                {showActionsMenu && (
                  <>
                    <div 
                      className="fixed inset-0 bg-black/20 z-30"
                      onClick={() => setShowActionsMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-40">
                      <button
                        onClick={handleDelete}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-screen">
        {/* Song Info Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-3 shadow-lg">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 mb-1 break-words">
                {song.title}
              </h1>
              <p className="text-gray-600 break-words mb-2">
                por {song.artist}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Formato: {formatLabels[processedSong.format]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transpose Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Tom:</span>
              <div className="flex items-center bg-gray-50 rounded-xl p-1">
                <button
                  onClick={transposeDown}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all active:scale-95"
                  title="Baixar tom"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
                <span className="font-bold text-lg text-blue-600 min-w-[2rem] text-center px-2">
                  {currentKey}
                </span>
                <button
                  onClick={transposeUp}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all active:scale-95"
                  title="Subir tom"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
            </div>

            {currentKey !== song.originalKey && (
              <div className="text-xs text-gray-500">
                Original: {song.originalKey}
              </div>
            )}
          </div>
        </div>

        {/* Schedule Form Modal */}
        {showScheduleForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <ScheduleSongForm
                song={song}
                onClose={() => setShowScheduleForm(false)}
              />
            </div>
          </div>
        )}

        {/* Song Content */}
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Music className="h-4 w-4" />
              Cifra
            </h2>
          </div>
          
          <div className="p-4">
            <div className="chord-display-container bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 overflow-x-auto">
              <div 
                className="chord-display min-w-0 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: displayedLyrics }}
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};