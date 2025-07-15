import React from 'react';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  selectedGenre: string;
  selectedDifficulty: string;
  onGenreChange: (genre: string) => void;
  onDifficultyChange: (difficulty: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedGenre,
  selectedDifficulty,
  onGenreChange,
  onDifficultyChange
}) => {
  const genres = ['Todos', 'Rock', 'Pop', 'MPB', 'Sertanejo', 'Gospel', 'Blues', 'Jazz', 'Folk'];
  const difficulties = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 print:hidden">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gênero
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dificuldade
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};