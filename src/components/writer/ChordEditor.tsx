import React, { useState, useRef, useEffect } from 'react';
import { Music, Eye, Save, X, Plus, Minus, Info } from 'lucide-react';
import { MusicKey, getAllKeys } from '../../utils/chordTransposition';
import { formatLyricsWithChords } from '../../utils/chordTransposition';

interface ChordEditorProps {
  initialLyrics?: string;
  onSave: (lyrics: string) => void;
  onCancel: () => void;
}

export const ChordEditor: React.FC<ChordEditorProps> = ({ 
  initialLyrics = '', 
  onSave, 
  onCancel 
}) => {
  const [lyrics, setLyrics] = useState(initialLyrics);
  const [showPreview, setShowPreview] = useState(false);
  const [showChordHelper, setShowChordHelper] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const commonChords = [
    'C', 'D', 'E', 'F', 'G', 'A', 'B',
    'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm',
    'C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7',
    'Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7',
    'C#', 'D#', 'F#', 'G#', 'A#',
    'C#m', 'D#m', 'F#m', 'G#m', 'A#m',
    'Csus4', 'Dsus4', 'Esus4', 'Fsus4', 'Gsus4', 'Asus4', 'Bsus4'
  ];

  const insertChord = (chord: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = lyrics;
    
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = before + `[${chord}]` + after;
    
    setLyrics(newText);
    
    // Reposicionar cursor após o acorde inserido
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + chord.length + 2, start + chord.length + 2);
    }, 0);
  };

  const insertSection = (section: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const text = lyrics;
    
    const before = text.substring(0, start);
    const after = text.substring(start);
    const newText = before + (before.endsWith('\n') || before === '' ? '' : '\n') + section + '\n' + after;
    
    setLyrics(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + section.length + 2, start + section.length + 2);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newText = lyrics.substring(0, start) + '  ' + lyrics.substring(end);
      setLyrics(newText);
      
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  const previewHtml = formatLyricsWithChords(lyrics);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Editor de Cifras</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChordHelper(!showChordHelper)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showChordHelper
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Info className="h-4 w-4 mr-1 inline" />
              Ajuda
            </button>
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showPreview
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="h-4 w-4 mr-1 inline" />
              {showPreview ? 'Editor' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Chord Helper Sidebar */}
        {showChordHelper && (
          <div className="w-64 border-r border-gray-200 p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-900 mb-3">Acordes Comuns</h4>
            <div className="grid grid-cols-3 gap-1 mb-4">
              {commonChords.map((chord) => (
                <button
                  key={chord}
                  onClick={() => insertChord(chord)}
                  className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {chord}
                </button>
              ))}
            </div>

            <h4 className="font-semibold text-gray-900 mb-3">Seções</h4>
            <div className="space-y-1">
              {['Intro', 'Verso', 'Pré-Refrão', 'Refrão', 'Ponte', 'Solo', 'Final'].map((section) => (
                <button
                  key={section}
                  onClick={() => insertSection(section)}
                  className="w-full text-left px-2 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {section}
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Como usar:</h5>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Clique nos acordes para inserir</li>
                <li>• Use [Acorde] para posicionar</li>
                <li>• Tab para indentar</li>
                <li>• Linha vazia = espaço</li>
              </ul>
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1">
          {showPreview ? (
            /* Preview Mode */
            <div className="p-6">
              <div className="chord-display-container bg-gray-50 p-4 rounded-lg border min-h-96">
                <div 
                  className="chord-display"
                  dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-gray-500">Digite sua cifra no editor para ver o preview...</p>' }}
                />
              </div>
            </div>
          ) : (
            /* Editor Mode */
            <div className="p-6">
              <textarea
                ref={textareaRef}
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua cifra aqui...

Exemplo:
Intro
[C]  [F]  [G]  [C]

Verso
[C]Era uma vez um [F]garoto
Que [G]sonhava em tocar vio[C]lão
[Am]Praticava todo [F]dia
Com [G]muito amor e dedi[C]cação

Refrão
[F]Música é [G]vida
[Em]Música é [Am]paixão
[F]Toca meu [G]coração
E [C]liberta minha alma"
                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {lyrics.length} caracteres
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </button>
                  
                  <button
                    onClick={() => onSave(lyrics)}
                    disabled={!lyrics.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Salvar Cifra
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};