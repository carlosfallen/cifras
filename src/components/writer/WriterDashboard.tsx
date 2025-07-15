import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Heart, Music, Search, Filter } from 'lucide-react';
import { Song } from '../../types';
import { useAuthContext } from '../auth/AuthContext';
import { SongForm } from './SongForm';
import { mockSongs } from '../../data/mockSongs';

export const WriterDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');

  // Filtrar músicas do usuário atual (simulado)
  const userSongs = mockSongs.filter(song => song.authorId === 'demo-user');

  const filteredSongs = userSongs.filter(song => {
    const matchesSearch = searchQuery === '' || 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = selectedGenre === 'Todos' || song.genre === selectedGenre;
    
    return matchesSearch && matchesGenre;
  });

  const handleNewSong = () => {
    setEditingSong(null);
    setShowForm(true);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowForm(true);
  };

  const handleSaveSong = (songData: Partial<Song>) => {
    console.log('Saving song:', songData);
    // Aqui você implementaria a lógica para salvar no Firebase
    setShowForm(false);
    setEditingSong(null);
  };

  const handleDeleteSong = (songId: string) => {
    if (confirm('Tem certeza que deseja excluir esta música?')) {
      console.log('Deleting song:', songId);
      // Aqui você implementaria a lógica para deletar do Firebase
    }
  };

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

  if (showForm) {
    return (
      <SongForm
        song={editingSong || undefined}
        onSave={handleSaveSong}
        onCancel={() => {
          setShowForm(false);
          setEditingSong(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Músicas</h1>
            <p className="text-gray-600 mt-1">
              Gerencie suas cifras e tablaturas
            </p>
          </div>
          
          <button
            onClick={handleNewSong}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            Nova Música
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Music className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{userSongs.length}</p>
              <p className="text-sm text-gray-600">Músicas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {userSongs.reduce((total, song) => total + song.views, 0)}
              </p>
              <p className="text-sm text-gray-600">Visualizações</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {userSongs.reduce((total, song) => total + song.likes, 0)}
              </p>
              <p className="text-sm text-gray-600">Curtidas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Music className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(userSongs.reduce((total, song) => total + song.views, 0) / userSongs.length) || 0}
              </p>
              <p className="text-sm text-gray-600">Média de Views</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar suas músicas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Todos">Todos os gêneros</option>
              <option value="Rock">Rock</option>
              <option value="Pop">Pop</option>
              <option value="MPB">MPB</option>
              <option value="Sertanejo">Sertanejo</option>
              <option value="Gospel">Gospel</option>
              <option value="Blues">Blues</option>
              <option value="Jazz">Jazz</option>
              <option value="Folk">Folk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Songs List */}
      {filteredSongs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Music className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || selectedGenre !== 'Todos' ? 'Nenhuma música encontrada' : 'Nenhuma música ainda'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedGenre !== 'Todos' 
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando sua primeira música.'
            }
          </p>
          {!searchQuery && selectedGenre === 'Todos' && (
            <button
              onClick={handleNewSong}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Criar Primeira Música
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSongs.map((song) => (
            <div key={song.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {song.title}
                  </h3>
                  <p className="text-gray-600 truncate">por {song.artist}</p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEditSong(song)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSong(song.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

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

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {song.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {song.likes}
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  Atualizada em {song.updatedAt.toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};