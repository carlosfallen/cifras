import { MusicKey } from '../types';

// Mapeamento completo com sustenidos e bemóis
const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Equivalências enarmônicas (bemóis para sustenidos)
const ENHARMONIC_MAP: Record<string, string> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#'
};

// Progressão de acordes para cada tonalidade (maiores e menores)
const CHORD_PROGRESSION: Record<string, string[]> = {
  // Tonalidades maiores
  'C': ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  'C#': ['C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'],
  'D': ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
  'D#': ['D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'],
  'E': ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
  'F': ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
  'F#': ['F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F'],
  'G': ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
  'G#': ['G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'],
  'A': ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
  'A#': ['A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
  'B': ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#'],
  
  // Tonalidades menores (baseadas no tom relativo maior)
  'Am': ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
  'A#m': ['A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
  'Bm': ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#'],
  'Cm': ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  'C#m': ['C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'],
  'Dm': ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
  'D#m': ['D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'],
  'Em': ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
  'Fm': ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
  'F#m': ['F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F'],
  'Gm': ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
  'G#m': ['G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G']
};

// Interface para partes do acorde
interface ChordParts {
  root: string;
  accidental: string;
  quality: string;
  extension: string;
  bass?: string;
}

// Regex mais preciso para capturar acordes complexos
export const CHORD_REGEX = /\b([A-G])([#b]?)(maj|min|m|M|sus[24]?|dim|aug|\+|°|ø|add)?(1[0-3]|[2-9]|add[2-9]|add1[0-3])?(?:\/([A-G][#b]?))?\b/g;

// Função para normalizar nota (converte bemóis para sustenidos)
const normalizeNote = (note: string): string => {
  return ENHARMONIC_MAP[note] || note;
};

// Função para parsear acorde complexo
export const parseChord = (chord: string): ChordParts | null => {
  const cleanChord = chord.trim();
  const match = cleanChord.match(/^([A-G])([#b]?)(maj|min|m|M|sus[24]?|dim|aug|\+|°|ø|add)?(1[0-3]|[2-9]|add[2-9]|add1[0-3])?(?:\/([A-G][#b]?))?$/);
  
  if (!match) return null;
  
  const [, root, accidental = '', quality = '', extension = '', bass] = match;
  
  return {
    root: root + accidental,
    accidental,
    quality,
    extension,
    bass
  };
};

// Função para transpor nota individual
const transposeNote = (note: string, fromKey: string, toKey: string): string => {
  const normalizedNote = normalizeNote(note);
  const fromProgression = CHORD_PROGRESSION[fromKey];
  const toProgression = CHORD_PROGRESSION[toKey];
  
  if (!fromProgression || !toProgression) return note;
  
  const position = fromProgression.indexOf(normalizedNote);
  if (position === -1) return note;
  
  return toProgression[position];
};

// Função principal para transpor acordes
export const transposeChord = (chord: string, fromKey: string, toKey: string): string => {
  const parts = parseChord(chord);
  if (!parts) return chord;
  
  const { root, quality, extension, bass } = parts;
  
  // Transpor a nota fundamental
  const newRoot = transposeNote(root, fromKey, toKey);
  
  // Transpor o baixo se existir
  const newBass = bass ? transposeNote(bass, fromKey, toKey) : undefined;
  
  // Reconstruir o acorde
  let result = newRoot + quality + extension;
  if (newBass) {
    result += '/' + newBass;
  }
  
  return result;
};

// Função para validar se um acorde é válido
export const isValidChord = (chord: string): boolean => {
  return parseChord(chord) !== null;
};

// Função para obter informações detalhadas do acorde
export const getChordInfo = (chord: string): ChordParts | null => {
  return parseChord(chord);
};

// Função para obter tipo de acorde (maior, menor, etc.)
export const getChordType = (chord: string): string => {
  const parts = parseChord(chord);
  if (!parts) return 'Desconhecido';
  
  const { quality, extension } = parts;
  
  // Determinar tipo baseado na qualidade
  if (quality === 'maj' || quality === 'M' || (!quality && !extension)) {
    return extension ? `Maior com ${extension}` : 'Maior';
  } else if (quality === 'min' || quality === 'm') {
    return extension ? `Menor com ${extension}` : 'Menor';
  } else if (quality.startsWith('sus')) {
    return `Suspenso ${quality.slice(3)}`;
  } else if (quality === 'dim' || quality === '°') {
    return 'Diminuto';
  } else if (quality === 'aug' || quality === '+') {
    return 'Aumentado';
  } else if (quality === 'ø') {
    return 'Meio-diminuto';
  } else if (quality === 'add') {
    return `Adicionado ${extension}`;
  }
  
  return quality + (extension ? ' ' + extension : '');
};

// Função melhorada para formatar letras com acordes
export const formatLyricsWithChords = (lyrics: string): string => {
  const lines = lyrics.split('\n');
  const formattedLines: string[] = [];
  
  for (const line of lines) {
    if (line.trim() === '') {
      formattedLines.push('<div class="song-line empty"></div>');
      continue;
    }
    
    // Verificar se é um título de seção
    if (!line.includes('[') && line.match(/^[A-ZÁÉÍÓÚÂÊÎÔÛÀÈÌÒÙÃÕÇ]/)) {
      formattedLines.push(`<div class="section-title">${line}</div>`);
      continue;
    }
    
    // Processar linha com acordes
    const chords: { chord: string; position: number; info: ChordParts | null }[] = [];
    let lyricsText = line;
    
    // Extrair acordes e suas posições
    const chordMatches = [...line.matchAll(/[\[\(]([^\]\)]+)[\]\)]/g)];
    let offset = 0;
    
    for (const match of chordMatches) {
      const chord = match[1];
      const originalPosition = match.index! - offset;
      const chordInfo = parseChord(chord);
      
      chords.push({ 
        chord, 
        position: originalPosition, 
        info: chordInfo 
      });
      
      // Remover o acorde do texto das letras
      lyricsText = lyricsText.replace(match[0], '');
      offset += match[0].length;
    }
    
    // Criar linha de acordes com informações detalhadas
    let chordsHtml = '';
    if (chords.length > 0) {
      for (const { chord, position, info } of chords) {
        const chordType = getChordType(chord);
        const leftPosition = Math.max(0, position * 0.6); // Ajuste mais preciso
        
        chordsHtml += `<span class="chord" 
          style="left: ${leftPosition}ch;" 
          title="${chordType}" 
          data-chord="${chord}"
          data-valid="${isValidChord(chord)}"
        >${chord}</span>`;
      }
    }
    
    // Montar a linha completa
    const songLineHtml = `
      <div class="song-line">
        <div class="chords-line">${chordsHtml}</div>
        <div class="lyrics-line">${lyricsText || '&nbsp;'}</div>
      </div>
    `;
    
    formattedLines.push(songLineHtml);
  }
  
  return formattedLines.join('');
};

// Função para transpor letras completas
export const transposeLyrics = (lyrics: string, fromKey: string, toKey: string): string => {
  // Primeiro transpor os acordes
  const transposedLyrics = lyrics.replace(/\[([^\]]+)\]/g, (match, chord) => {
    const transposedChord = transposeChord(chord, fromKey, toKey);
    return `[${transposedChord}]`;
  });
  
  // Depois formatar para visualização
  return formatLyricsWithChords(transposedLyrics);
};

// Função para obter todas as tonalidades maiores
export const getAllKeys = (): MusicKey[] => {
  return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
};

// Função para obter todas as tonalidades (maiores e menores)
export const getAllKeysWithMinor = (): string[] => {
  const majorKeys = getAllKeys();
  const minorKeys = majorKeys.map(key => `${key}m`);
  return [...majorKeys, ...minorKeys];
};

// Função para obter tonalidades com nomes em português
export const getKeysWithNames = (): Array<{ key: MusicKey; name: string }> => {
  return [
    { key: 'C', name: 'Dó' },
    { key: 'C#', name: 'Dó#' },
    { key: 'D', name: 'Ré' },
    { key: 'D#', name: 'Ré#' },
    { key: 'E', name: 'Mi' },
    { key: 'F', name: 'Fá' },
    { key: 'F#', name: 'Fá#' },
    { key: 'G', name: 'Sol' },
    { key: 'G#', name: 'Sol#' },
    { key: 'A', name: 'Lá' },
    { key: 'A#', name: 'Lá#' },
    { key: 'B', name: 'Si' }
  ];
};

// Função para sugerir acordes relacionados
export const getSuggestedChords = (key: string): string[] => {
  const progression = CHORD_PROGRESSION[key];
  if (!progression) return [];
  
  const [I, ii, iii, IV, V, vi] = [0, 1, 2, 3, 4, 5].map(i => progression[i]);
  
  return [
    I,           // I
    ii + 'm',    // ii
    iii + 'm',   // iii
    IV,          // IV
    V,           // V
    vi + 'm',    // vi
    I + '7',     // I7
    V + '7',     // V7
    IV + 'maj7', // IVmaj7
    vi + 'm7'    // vim7
  ];
};

// Função para detectar progressões harmônicas comuns
export const detectChordProgression = (chords: string[], key: string): string => {
  const progression = CHORD_PROGRESSION[key];
  if (!progression) return 'Tonalidade não reconhecida';
  
  const chordNumbers = chords.map(chord => {
    const root = parseChord(chord)?.root;
    if (!root) return null;
    const index = progression.indexOf(normalizeNote(root));
    return index !== -1 ? index + 1 : null;
  }).filter(n => n !== null);
  
  const progressionString = chordNumbers.join('-');
  
  // Progressões comuns
  const commonProgressions: Record<string, string> = {
    '1-5-6-4': 'I-V-vi-IV (Progressão Pop)',
    '6-4-1-5': 'vi-IV-I-V (Progressão Alternativa)',
    '1-4-5-1': 'I-IV-V-I (Progressão Clássica)',
    '1-6-4-5': 'I-vi-IV-V (Progressão dos Anos 50)',
    '2-5-1': 'ii-V-I (Progressão Jazz)',
    '1-3-4-5': 'I-iii-IV-V (Progressão Romântica)'
  };
  
  return commonProgressions[progressionString] || 'Progressão Personalizada';
};

export default {
  transposeChord,
  transposeLyrics,
  formatLyricsWithChords,
  parseChord,
  getChordInfo,
  getChordType,
  isValidChord,
  getAllKeys,
  getAllKeysWithMinor,
  getKeysWithNames,
  getSuggestedChords,
  detectChordProgression
};