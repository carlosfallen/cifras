import React, { useState, useEffect } from 'react';
import { Music, Search, Plus, Edit, Trash2, LogOut, User, Calendar, Heart, Menu, X, ArrowLeft } from 'lucide-react';
import { useAuthContext } from './auth/AuthContext';
import { SongForm } from './SongForm';
import { SongViewer } from './SongViewer';
import { useSongs } from '../hooks/useSongs';
import { Song } from '../types';
import { ScheduleCalendar } from './Calendar/ScheduleCalendar';

type ViewMode = 'home' | 'calendar' | 'song-viewer' | 'song-form';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuthContext();
  const { songs, loading, addSong, updateSong, deleteSong } = useSongs();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [viewingSong, setViewingSong] = useState<Song | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<ViewMode[]>([]);

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função para navegar entre views mantendo histórico
  const navigateTo = (mode: ViewMode, song?: Song) => {
    setNavigationHistory(prev => [...prev, viewMode]);
    
    if (mode === 'song-viewer' && song) {
      setViewingSong(song);
    } else if (mode === 'song-form') {
      // editingSong já deve estar setado antes de chamar esta função
    }
    
    setViewMode(mode);
  };

  // Função para voltar na navegação
  const navigateBack = () => {
    if (navigationHistory.length > 0) {
      const previousMode = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setViewMode(previousMode);
      
      // Limpar estados se necessário
      if (previousMode !== 'song-viewer') {
        setViewingSong(null);
      }
      if (previousMode !== 'song-form') {
        setEditingSong(null);
      }
    } else {
      // Se não há histórico, voltar para home
      setViewMode('home');
      setViewingSong(null);
      setEditingSong(null);
    }
  };

  // Função para ir direto para home
  const goToHome = () => {
    setViewMode('home');
    setNavigationHistory([]);
    setViewingSong(null);
    setEditingSong(null);
    setShowUserMenu(false);
  };

  const handleAddSong = () => {
    setEditingSong(null);
    navigateTo('song-form');
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    navigateTo('song-form');
  };

  const handleDeleteSong = async (songId: string) => {
    if (confirm('Tem certeza que deseja excluir esta música?')) {
      await deleteSong(songId);
      
      // Se estamos vendo a música que foi deletada, voltar
      if (viewingSong?.id === songId) {
        navigateBack();
      }
    }
  };

  const handleSaveSong = async (songData: Partial<Song>) => {
    if (editingSong) {
      await updateSong(editingSong.id, songData);
    } else {
      await addSong(songData);
    }
    
    // Voltar para a view anterior
    navigateBack();
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const handleSongSelectFromCalendar = (song: Song) => {
    setViewingSong(song);
    navigateTo('song-viewer', song);
  };

  const handleViewSong = (song: Song) => {
    setViewingSong(song);
    navigateTo('song-viewer', song);
  };

  // Função para obter o título da página atual
  const getCurrentPageTitle = () => {
    switch (viewMode) {
      case 'calendar':
        return 'Agenda de Músicas';
      case 'song-viewer':
        return viewingSong?.title || 'Visualizar Música';
      case 'song-form':
        return editingSong ? 'Editar Música' : 'Nova Música';
      default:
        return 'CifraTabs';
    }
  };

  // Componente do Header unificado
  const PageHeader = () => (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo e Navegação */}
          <div className="flex items-center gap-2">
            {viewMode !== 'home' && (
              <button
                onClick={navigateBack}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            
            <div className="flex items-center gap-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg cursor-pointer"
                onClick={goToHome}
              >
                <Music className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {getCurrentPageTitle()}
                </h1>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Calendar Button - só mostrar se não estiver na agenda */}
            {viewMode !== 'calendar' && (
              <button
                onClick={() => navigateTo('calendar')}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Calendar className="h-5 w-5" />
              </button>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{user?.displayName}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={goToHome}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Music className="h-4 w-4" />
                      Início
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigateTo('calendar');
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Calendar className="h-4 w-4" />
                      Agenda
                    </button>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  // Renderizar view baseada no modo atual
  const renderCurrentView = () => {
    switch (viewMode) {
      case 'calendar':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <PageHeader />
            <div className="p-4">
              <ScheduleCalendar 
                onClose={navigateBack}
                onSongSelect={handleSongSelectFromCalendar}
                isFullPage={true}
              />
            </div>
          </div>
        );

      case 'song-viewer':
        return viewingSong ? (
          <SongViewer
            song={viewingSong}
            onBack={navigateBack}
            onEdit={() => {
              setEditingSong(viewingSong);
              navigateTo('song-form');
            }}
            onDelete={async () => {
              await handleDeleteSong(viewingSong.id);
            }}
          />
        ) : null;

      case 'song-form':
        return (
          <SongForm
            song={editingSong || undefined}
            onSave={handleSaveSong}
            onCancel={navigateBack}
          />
        );

      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <PageHeader />
            
            {/* Main Content */}
            <main className="px-4 py-4">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar músicas..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm text-base"
                  />
                </div>
              </div>

              {/* Songs List */}
              {loading ? (
                <div className="space-y-3">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-4 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 bg-gray-200 rounded w-12"></div>
                          <div className="h-8 bg-gray-200 rounded w-8"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredSongs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-6 w-20 h-20 mx-auto mb-4">
                    <Music className="w-8 h-8 text-blue-600 mx-auto" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {searchQuery ? 'Nenhuma música encontrada' : 'Sua biblioteca está vazia'}
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm px-4">
                    {searchQuery ? 'Tente buscar por outro termo.' : 'Que tal começar adicionando sua primeira cifra?'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleAddSong}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 mx-auto font-medium shadow-lg"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar Primeira Cifra
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSongs.map((song) => (
                    <div key={song.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-4 hover:bg-white/90 transition-all duration-200 active:scale-95">
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => handleViewSong(song)}
                        >
                          <h3 className="font-semibold text-gray-900 truncate text-base">
                            {song.title}
                          </h3>
                          <p className="text-gray-600 truncate text-sm">
                            {song.artist}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-3">
                          <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-lg text-xs font-semibold border border-blue-200">
                            {song.originalKey}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSong(song);
                              }}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSong(song.id);
                              }}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>

            {/* Floating Action Button */}
            <button
              onClick={handleAddSong}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-30 active:scale-95"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        );
    }
  };

  return renderCurrentView();
};