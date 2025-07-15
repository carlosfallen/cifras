import React, { useState } from 'react';
import { Music, Save, X } from 'lucide-react';
import { Song, MusicKey } from '../types';
import { getAllKeys } from '../utils/chordTransposition';

interface SongFormProps {
  song?: Song;
  onSave: (songData: Partial<Song>) => void;
  onCancel: () => void;
}

export const SongForm: React.FC<SongFormProps> = ({ song, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: song?.title || '',
    artist: song?.artist || '',
    originalKey: song?.originalKey || 'C' as MusicKey,
    lyrics: song?.lyrics || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Todos os tons (maiores e menores)
  const allKeys = [
    // Tons maiores
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
    // Tons menores
    'Am', 'A#m', 'Bbm', 'Bm', 'Cm', 'C#m', 'Dbm', 'Dm', 'D#m', 'Ebm', 'Em', 'Fm', 'F#m', 'Gbm', 'Gm', 'G#m', 'Abm'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Artista é obrigatório';
    }

    if (!formData.lyrics.trim()) {
      newErrors.lyrics = 'Letra/cifra é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {song ? 'Editar Cifra' : 'Nova Cifra'}
                </h2>
                <p className="text-gray-600">
                  {song ? 'Atualize as informações da cifra' : 'Adicione uma nova cifra'}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Música *
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Imagine"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-2">
                  Artista *
                </label>
                <input
                  id="artist"
                  type="text"
                  value={formData.artist}
                  onChange={(e) => handleInputChange('artist', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.artist ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: John Lennon"
                />
                {errors.artist && (
                  <p className="mt-1 text-sm text-red-600">{errors.artist}</p>
                )}
              </div>
            </div>

            {/* Musical Key */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="originalKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Tom da Música *
                </label>
                <select
                  id="originalKey"
                  value={formData.originalKey}
                  onChange={(e) => handleInputChange('originalKey', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <optgroup label="Tons Maiores">
                    {allKeys.filter(key => !key.includes('m')).map((key) => (
                      <option key={key} value={key}>
                        {key} (Maior)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Tons Menores">
                    {allKeys.filter(key => key.includes('m')).map((key) => (
                      <option key={key} value={key}>
                        {key} (Menor)
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Escolha o tom principal da música
                </p>
              </div>
            </div>

            {/* Lyrics/Chords */}
            <div>
              <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 mb-2">
                Letra e Acordes *
              </label>
              <textarea
                id="lyrics"
                value={formData.lyrics}
                onChange={(e) => handleInputChange('lyrics', e.target.value)}
                className={`w-full h-96 border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.lyrics ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite a letra com os acordes entre colchetes:

[C]Imagine there's no [F]heaven
[C]It's easy if you [F]try
[C]No hell be[F]low us
[C]Above us only [F]sky

[Am]Imagine all the [Dm]people [F]living for to[G]day..."
              />
              {errors.lyrics && (
                <p className="mt-1 text-sm text-red-600">{errors.lyrics}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Use colchetes para acordes: [C] [Am] [F] [G]
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
              
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {song ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};