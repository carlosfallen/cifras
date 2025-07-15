import React, { useState, useMemo } from 'react';
import { Song } from '../types';
import { SongList } from '../components/songs/SongList';
import { SongViewer } from '../components/songs/SongViewer';
import { FilterBar } from '../components/ui/FilterBar';
import { mockSongs } from '../data/mockSongs';

interface HomePageProps {
  searchQuery: string;
}

export const HomePage: React.FC<HomePageProps> = ({ searchQuery }) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todos');

  const filteredSongs = useMemo(() => {
    return mockSongs.filter(song => {
      const matchesSearch = searchQuery === '' || 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre = selectedGenre === 'Todos' || song.genre === selectedGenre;
      
      const difficultyMap: { [key: string]: string } = {
        'Todos': '',
        'Iniciante': 'beginner',
        'Intermediário': 'intermediate',
        'Avançado': 'advanced'
      };
      const matchesDifficulty = selectedDifficulty === 'Todos' || 
        song.difficulty === difficultyMap[selectedDifficulty];

      return matchesSearch && matchesGenre && matchesDifficulty;
    });
  }, [searchQuery, selectedGenre, selectedDifficulty]);

  if (selectedSong) {
    return (
      <SongViewer
        song={selectedSong}
        onBack={() => setSelectedSong(null)}
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Descubra Músicas Incríveis
        </h1>
        <p className="text-gray-600">
          Encontre cifras, tablaturas e letras das suas músicas favoritas
        </p>
      </div>

      <FilterBar
        selectedGenre={selectedGenre}
        selectedDifficulty={selectedDifficulty}
        onGenreChange={setSelectedGenre}
        onDifficultyChange={setSelectedDifficulty}
      />

      <SongList
        songs={filteredSongs}
        onSongClick={setSelectedSong}
      />
    </div>
  );
};