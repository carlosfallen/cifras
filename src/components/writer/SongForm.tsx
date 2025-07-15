import React, { useState } from 'react';
import { Music, Save, X, Upload } from 'lucide-react';
import { Song, MusicKey } from '../../types';
import { ChordEditor } from './ChordEditor';
import { getAllKeys } from '../../utils/chordTransposition';

interface SongFormProps {
  song?: Song;
  onSave: (songData: Partial<Song>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const SongForm: React.FC<SongFormProps> = ({ 
  song, 
  onSave, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    title: song?.title || '',
    artist: song?.artist || '',
    genre: song?.genre || 'Rock',
    originalKey: song?.originalKey || 'C' as MusicKey,
    difficulty: song?.difficulty || 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    lyrics: song?.lyrics || '',
    tablature: song?.tablature || ''
  });

  const [showChordEditor, setShowChordEditor] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const genres = ['Rock', 'Pop', 'MPB', 'Sertanejo', 'Gospel', 'Blues', 'Jazz', 'Folk', 'Country', 'Reggae'];
  const keys = getAllKeys();

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
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLyricsSave = (lyrics: string) => {
    setFormData(prev => ({ ...prev, lyrics }));
    setShowChordEditor(false);
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return difficulty;
    }
  };

  if (showChordEditor) {
    return (
      <ChordEditor
        initialLyrics={formData.lyrics}
        onSave={handleLyricsSave}
        onCancel={() => setShowChordEditor(false)}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {song ? 'Editar Música' : 'Nova Música'}
            </h2>
            <p className="text-gray-600">
              {song ? 'Atualize as informações da sua música' : 'Adicione uma nova música à plataforma'}
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
              Título da Música *
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

        {/* Genre, Key, and Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
              Gênero
            </label>
            <select
              id="genre"
              value={formData.genre}
              onChange={(e) => handleInputChange('genre', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="originalKey" className="block text-sm font-medium text-gray-700 mb-2">
              Tom Original
            </label>
            <select
              id="originalKey"
              value={formData.originalKey}
              onChange={(e) => handleInputChange('originalKey', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {keys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Dificuldade
            </label>
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Iniciante</option>
              <option value="intermediate">Intermediário</option>
              <option value="advanced">Avançado</option>
            </select>
          </div>
        </div>

        {/* Lyrics/Chords Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Letra e Cifras *
            </label>
            <button
              type="button"
              onClick={() => setShowChordEditor(true)}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Music className="h-4 w-4" />
              Editor Avançado
            </button>
          </div>
          
          <textarea
            value={formData.lyrics}
            onChange={(e) => handleInputChange('lyrics', e.target.value)}
            className={`w-full h-48 border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.lyrics ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Digite a letra com os acordes entre colchetes [C] [F] [G]..."
          />
          {errors.lyrics && (
            <p className="mt-1 text-sm text-red-600">{errors.lyrics}</p>
          )}
          
          <p className="mt-2 text-sm text-gray-500">
            Use colchetes para acordes: [C] [Am] [F] [G]. Clique em "Editor Avançado" para mais recursos.
          </p>
        </div>

        {/* Tablature Section */}
        <div>
          <label htmlFor="tablature" className="block text-sm font-medium text-gray-700 mb-2">
            Tablatura (Opcional)
          </label>
          <textarea
            id="tablature"
            value={formData.tablature}
            onChange={(e) => handleInputChange('tablature', e.target.value)}
            className="w-full h-32 border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="e|--0--0--0--0--|
B|--1--1--1--1--|
G|--0--0--2--2--|
D|--2--2--3--3--|
A|--3--3--3--3--|
E|--x--x--x--x--|
   C     F"
          />
          <p className="mt-2 text-sm text-gray-500">
            Adicione a tablatura da música (opcional). Use fonte monoespaçada.
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
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Salvando...' : (song ? 'Atualizar' : 'Publicar')}
          </button>
        </div>
      </form>
    </div>
  );
};