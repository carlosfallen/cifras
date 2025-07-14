import React, { useState } from 'react';
import { Printer, Heart, Eye, Share2, ChevronLeft } from 'lucide-react';
import { Song } from '../../types';
import { KeyTransposer } from './KeyTransposer';
import { MusicKey, transposeLyrics, formatLyricsWithChords } from '../../utils/chordTransposition';

interface SongViewerProps {
  song: Song;
  onBack: () => void;
}

export const SongViewer: React.FC<SongViewerProps> = ({ song, onBack }) => {
  const [currentKey, setCurrentKey] = useState<MusicKey>(song.originalKey as MusicKey);
  const [isFavorite, setIsFavorite] = useState(false);

  const transposedLyrics = currentKey === song.originalKey 
    ? formatLyricsWithChords(song.lyrics)
    : transposeLyrics(song.lyrics, song.originalKey as MusicKey, currentKey);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${song.title} - ${song.artist}`,
          text: `Confira esta música: ${song.title} por ${song.artist}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
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

  return (
    <>
    <div className="max-w-4xl mx-auto">
      {/* Header - Hidden in print */}
      <div className="print:hidden mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{song.title}</h1>
              <p className="text-xl text-gray-600 mb-3">por {song.artist}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {song.genre}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(song.difficulty)}`}>
                  {getDifficultyLabel(song.difficulty)}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  Tom: {song.originalKey}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Printer className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {song.views} visualizações
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {song.likes} curtidas
            </div>
          </div>
        </div>
      </div>

      {/* Key Transposer */}
      <div className="mb-6">
        <KeyTransposer
          currentKey={currentKey}
          originalKey={song.originalKey as MusicKey}
          onKeyChange={setCurrentKey}
        />
      </div>

      {/* Print Header - Only visible in print */}
      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">{song.title}</h1>
        <p className="text-xl text-gray-700 mb-4">por {song.artist}</p>
        <div className="flex gap-4 text-sm text-gray-600 mb-4">
          <span>Gênero: {song.genre}</span>
          <span>Dificuldade: {getDifficultyLabel(song.difficulty)}</span>
          <span>Tom: {currentKey}</span>
        </div>
        <hr className="border-gray-300 mb-6" />
      </div>

      {/* Song Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 print:shadow-none print:border-none overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 print:p-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 print:text-lg">
            Letra e Cifras
          </h2>
          
          <div className="chord-display-container bg-gray-50 p-4 rounded-lg border print:bg-white print:border-gray-300">
            <div 
            className="chord-display"
            dangerouslySetInnerHTML={{ __html: transposedLyrics }}
            />
          </div>

          <div className="mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 print:hidden">
            <h3 className="font-semibold text-blue-900 mb-2">Legenda de Acordes:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-blue-800">
              <div><strong>m</strong> = menor (ex: Am = Lá menor)</div>
              <div><strong>7</strong> = sétima (ex: C7 = Dó com sétima)</div>
              <div><strong>maj7</strong> = sétima maior (ex: Cmaj7)</div>
              <div><strong>9</strong> = nona (ex: C9 = Dó com nona)</div>
              <div><strong>sus4</strong> = quarta suspensa (ex: Csus4)</div>
              <div><strong>dim</strong> = diminuto (ex: Cdim)</div>
              <div><strong>aug</strong> = aumentado (ex: Caug)</div>
              <div><strong>#</strong> = sustenido, <strong>b</strong> = bemol</div>
            </div>
          </div>

          {song.tablature && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-6 print:text-lg print:mt-6">
                Tablatura
              </h2>
              <div className="font-mono text-xs sm:text-sm leading-tight whitespace-pre-wrap bg-gray-50 p-3 sm:p-4 rounded-lg border print:bg-white print:border-gray-300 print:text-xs overflow-x-auto">
                {song.tablature}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    
    <style jsx>{`
      .chord-display-container {
        overflow-x: auto;
        max-width: 100%;
      }
    `}</style>
    </>
  );
};