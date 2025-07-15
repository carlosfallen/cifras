import React, { useState, useEffect } from 'react';
import { Music, Search, Plus, Edit, Trash2, LogOut, User } from 'lucide-react';
import { useAuthContext } from './auth/AuthContext';
import { SongForm } from './SongForm';
import { SongViewer } from './SongViewer';
import { useSongs } from '../hooks/useSongs';
import { Song } from '../types';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuthContext();
  const { songs, loading, addSong, updateSong, deleteSong } = useSongs();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [viewingSong, setViewingSong] = useState<Song | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSong = () => {
    setEditingSong(null);
    setShowForm(true);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowForm(true);
  };

  const handleDeleteSong = async (songId: string) => {
    if (confirm('Tem certeza que deseja excluir esta música?')) {
      await deleteSong(songId);
    }
  };

  const handleSaveSong = async (songData: Partial<Song>) => {
    if (editingSong) {
      await updateSong(editingSong.id, songData);
    } else {
      await addSong(songData);
    }
    setShowForm(false);
    setEditingSong(null);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  if (viewingSong) {
    return (
      <SongViewer
        song={viewingSong}
        onBack={() => setViewingSong(null)}
        onEdit={() => {
          setEditingSong(viewingSong);
          setViewingSong(null);
          setShowForm(true);
        }}
        onDelete={async () => {
          await handleDeleteSong(viewingSong.id);
          setViewingSong(null);
        }}
      />
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">CifraPlatform</h1>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">{user?.displayName}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar músicas..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleAddSong}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            Nova Cifra
          </button>
        </div>

        {/* Songs List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <Music className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Nenhuma música encontrada' : 'Nenhuma cifra ainda'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Tente buscar por outro termo.' : 'Comece adicionando sua primeira cifra.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddSong}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Adicionar Primeira Cifra
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song) => (
              <div key={song.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-lg font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => setViewingSong(song)}
                    >
                      {song.title}
                    </h3>
                    <p className="text-gray-600 truncate">por {song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {song.originalKey}
                  </span>
                  
                  <div className="flex items-center gap-2">
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};