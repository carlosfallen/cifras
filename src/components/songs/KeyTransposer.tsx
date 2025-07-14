import React from 'react';
import { Music } from 'lucide-react';
import { MusicKey, getAllKeys } from '../../utils/chordTransposition';

interface KeyTransposerProps {
  currentKey: MusicKey;
  originalKey: MusicKey;
  onKeyChange: (key: MusicKey) => void;
}

export const KeyTransposer: React.FC<KeyTransposerProps> = ({ 
  currentKey, 
  originalKey, 
  onKeyChange 
}) => {
  const keys = getAllKeys();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 print:hidden">
      <div className="flex items-center gap-2 mb-3">
        <Music className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Transposição de Tom</h3>
      </div>
      
      <div className="flex items-center gap-4 mb-3">
        <span className="text-sm text-gray-600">Tom original:</span>
        <span className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
          {originalKey}
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tocar em:
        </label>
        <div className="grid grid-cols-6 gap-2">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => onKeyChange(key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                key === currentKey
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {currentKey !== originalKey && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Transposição:</strong> {originalKey} → {currentKey}
          </p>
        </div>
      )}
    </div>
  );
};