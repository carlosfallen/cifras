import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Music as MusicIcon, X, Trash2 } from 'lucide-react';
import { Song, ScheduledSong } from '../../types';
import { useSongs } from '../../hooks/useSongs';
import { useScheduledSongs } from '../../hooks/useScheduledSongs';

interface ScheduleCalendarProps {
  onClose: () => void;
  onSongSelect: (song: Song) => void;
  isFullPage?: boolean;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ 
  onClose, 
  onSongSelect, 
  isFullPage = false 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { songs } = useSongs();
  const { scheduledSongs = [], loading: loadingScheduled, fetchScheduledSongs, removeScheduledSong } = useScheduledSongs();
  
  // Memoizar a data de hoje para evitar recriações
  const today = useMemo(() => new Date(), []);
  
  useEffect(() => {
    fetchScheduledSongs();
  }, []);
  
  const isToday = useMemo(() => 
    selectedDate.toDateString() === today.toDateString(), 
    [selectedDate, today]
  );
  
  // Memoizar função para melhor performance
  const getDateSongs = useMemo(() => {
    const dateCache = new Map<string, ScheduledSong[]>();
    
    return (date: Date): ScheduledSong[] => {
      const dateString = date.toDateString();
      
      if (dateCache.has(dateString)) {
        return dateCache.get(dateString)!;
      }
      
      const songs = scheduledSongs.filter(song => {
        const songDate = new Date(song.date);
        return songDate.toDateString() === dateString;
      });
      
      dateCache.set(dateString, songs);
      return songs;
    };
  }, [scheduledSongs]);

  const getSongDetails = useMemo(() => {
    const songMap = new Map(songs.map(song => [song.id, song]));
    return (songId: string): Song | undefined => songMap.get(songId);
  }, [songs]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const handleSongClick = (songId: string) => {
    const song = getSongDetails(songId);
    if (song) {
      onSongSelect(song);
    }
  };

  const handleRemoveFromSchedule = async (scheduledId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Evita que o clique no botão de remoção abra a música
    
    if (removingId === scheduledId) return; // Evita cliques duplos
    
    setRemovingId(scheduledId);
    
    try {
      await removeScheduledSong(scheduledId);
      // Atualiza a lista após remoção
      await fetchScheduledSongs();
    } catch (error) {
      console.error('Erro ao remover música da agenda:', error);
      // Aqui você pode adicionar uma notificação de erro se tiver um sistema de toast
    } finally {
      setRemovingId(null);
    }
  };

  const canNavigatePrev = selectedDate > today;
  const selectedDateSongs = getDateSongs(selectedDate);

  // Memoizar lista de próximas músicas
  const upcomingSongs = useMemo(() => {
    return scheduledSongs
      .filter(scheduled => new Date(scheduled.date) >= today)
      .slice(0, 5);
  }, [scheduledSongs, today]);

  const content = (
    <div className={`bg-white ${isFullPage ? 'min-h-screen' : 'rounded-t-3xl sm:rounded-2xl'} ${isFullPage ? 'w-full' : 'w-full sm:w-full sm:max-w-4xl'} ${isFullPage ? 'h-auto' : 'h-full sm:h-auto sm:max-h-[95vh]'} overflow-y-auto`}>
      {/* Header com design mobile-first */}
      {!isFullPage && (
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
          {/* Handle para arrastar no mobile */}
          <div className="flex justify-center py-2 sm:hidden">
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          <div className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-gray-900">
                <Calendar size={20} className="sm:w-6 sm:h-6 text-blue-600" />
                <span className="hidden sm:inline">Agenda de Músicas</span>
                <span className="sm:hidden">Agenda</span>
              </h2>
              <button 
                onClick={onClose}
                aria-label="Fechar agenda"
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${isFullPage ? 'p-4 sm:p-6' : 'px-4 sm:px-6 pb-6'}`}>
        {/* Navegação de data redesenhada para mobile */}
        <div className={`${isFullPage ? 'mb-6' : 'mb-6'}`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* Botão Voltar */}
            <button
              onClick={() => navigateDate('prev')}
              disabled={!canNavigatePrev}
              aria-label="Dia anterior"
              className={`p-3 rounded-full transition-all duration-200 ${
                canNavigatePrev 
                  ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md active:scale-95' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Data Central com melhor design */}
            <div className="text-center flex-1 px-2">
              <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1 leading-tight">
                {formatDate(selectedDate)}
              </div>
            </div>

            {/* Botão Avançar */}
            <button
              onClick={() => navigateDate('next')}
              aria-label="Próximo dia"
              className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow-md active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Indicador visual de dias com scroll horizontal no mobile */}
          <div className="flex justify-center items-center gap-2 mb-6 px-2 overflow-x-auto pb-2">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const date = new Date(selectedDate);
              date.setDate(date.getDate() + offset);
              const isCurrentSelected = offset === 0;
              const isCurrentToday = date.toDateString() === today.toDateString();
              const hasSongs = getDateSongs(date).length > 0;
              
              return (
                <button
                  key={offset}
                  onClick={() => setSelectedDate(new Date(date))}
                  aria-label={`Ir para ${formatDate(date)}`}
                  className={`flex-shrink-0 text-center cursor-pointer transition-all duration-200 ${
                    isCurrentSelected 
                      ? 'transform scale-110' 
                      : 'hover:scale-105 active:scale-95'
                  }`}
                >
                  <div className={`mt-3 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    isCurrentSelected
                      ? 'bg-blue-500 text-white shadow-lg'
                      : isCurrentToday
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : hasSongs
                      ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                    {formatShortDate(date)}
                  </div>
                  {hasSongs && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-2"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo das Músicas com design mobile-first */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="truncate">
                {isToday ? 'Hoje' : formatDate(selectedDate)}
              </span>
            </h3>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {selectedDateSongs.length}
            </span>
          </div>
          
          {loadingScheduled ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-4 text-sm">Carregando músicas...</p>
            </div>
          ) : selectedDateSongs.length > 0 ? (
            <div className="space-y-3">
              {selectedDateSongs.map((scheduled, index) => {
                const song = getSongDetails(scheduled.songId);
                const isRemoving = removingId === scheduled.id;
                
                return song ? (
                  <div 
                    key={scheduled.id} 
                    className={`group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 ${
                      isRemoving ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <button 
                      onClick={() => handleSongClick(scheduled.songId)}
                      className="w-full p-4 text-left cursor-pointer active:scale-[0.98] transition-transform"
                      disabled={isRemoving}
                    >
                      <div className="flex items-start gap-3">
                        {/* Número da música */}
                        <div className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-bold shrink-0 mt-1">
                          #{index + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0 pr-12">
                          {/* Título da música */}
                          <h4 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                            {song.title}
                          </h4>
                          
                          {/* Informações em cards */}
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-medium">
                                👤 {scheduled.singer}
                              </div>
                            </div>
                            
                            {song.artist && (
                              <div className="flex items-center gap-2 text-sm">
                                <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-medium">
                                  🎵 {song.artist}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Footer da música */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                {song.originalKey}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={12} />
                                {new Date(scheduled.date).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                            <div className="text-sm text-blue-600 font-medium">
                              Ver Cifra →
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                    
                    {/* Botão de remoção */}
                    <button
                      onClick={(e) => handleRemoveFromSchedule(scheduled.id, e)}
                      disabled={isRemoving}
                      aria-label="Remover da agenda"
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                        isRemoving 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 opacity-0 group-hover:opacity-100 active:scale-95'
                      }`}
                    >
                      {isRemoving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <MusicIcon className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-base font-medium mb-2">
                {isToday ? 'Nenhuma música para hoje' : 'Nenhuma música agendada'}
              </p>
              <p className="text-gray-400 text-sm">
                As músicas agendadas aparecerão aqui
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Modal para mobile com melhor UX
  if (!isFullPage) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        <div className="w-full sm:w-auto sm:min-w-[500px] sm:max-w-4xl h-[90vh] sm:h-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};