import { MusicKey } from '../types';

const CHORD_PROGRESSION: Record<MusicKey, string[]> = {
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
  'B': ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#']
};

// Regex mais específico para capturar acordes complexos
const CHORD_REGEX = /\b[A-G][#b]?(?:maj|min|m|M|sus|dim|aug|add|°|ø)?[0-9]*(?:\/[A-G][#b]?)?\b/g;

export const transposeChord = (chord: string, fromKey: MusicKey, toKey: MusicKey): string => {
  const fromProgression = CHORD_PROGRESSION[fromKey];
  const toProgression = CHORD_PROGRESSION[toKey];
  
  // Extrair a nota fundamental do acorde (incluindo sustenido/bemol)
  const rootMatch = chord.match(/^[A-G][#b]?/);
  if (!rootMatch) return chord;
  
  const root = rootMatch[0];
  const suffix = chord.slice(root.length);
  
  // Encontrar a posição da nota fundamental na progressão de origem
  const position = fromProgression.indexOf(root);
  if (position === -1) return chord;
  
  // Obter a nota correspondente na tonalidade de destino
  const newRoot = toProgression[position];
  return newRoot + suffix;
};

export const formatLyricsWithChords = (lyrics: string): string => {
  const lines = lyrics.split('\n');
  const formattedLines: string[] = [];
  
  for (const line of lines) {
    if (line.trim() === '') {
      formattedLines.push('<div class="song-line"></div>');
      continue;
    }
    
    // Verificar se é um título de seção (linhas que começam com maiúscula e não têm acordes)
    if (!line.includes('[') && line.match(/^[A-ZÁÉÍÓÚÂÊÎÔÛÀÈÌÒÙÃÕÇ]/)) {
      formattedLines.push(`<div class="section-title">${line}</div>`);
      continue;
    }
    
    // Processar linha com acordes
    const chords: { chord: string; position: number }[] = [];
    let lyricsText = line;
    
    // Extrair acordes e suas posições
    const chordMatches = [...line.matchAll(/\[([^\]]+)\]/g)];
    let offset = 0;
    
    for (const match of chordMatches) {
      const chord = match[1];
      const originalPosition = match.index! - offset;
      chords.push({ chord, position: originalPosition });
      
      // Remover o acorde do texto das letras
      lyricsText = lyricsText.replace(match[0], '');
      offset += match[0].length;
    }
    
    // Criar linha de acordes
    let chordsHtml = '';
    if (chords.length > 0) {
      for (const { chord, position } of chords) {
        // Calcular posição mais precisa baseada no caractere
        const leftPosition = Math.max(0, position * 0.55); // Ajuste mais preciso
        chordsHtml += `<span class="chord" style="left: ${leftPosition}ch;">${chord}</span>`;
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

export const transposeLyrics = (lyrics: string, fromKey: MusicKey, toKey: MusicKey): string => {
  // Primeiro transpor os acordes
  const transposedLyrics = lyrics.replace(/\[([^\]]+)\]/g, (match, chord) => {
    const transposedChord = transposeChord(chord, fromKey, toKey);
    return `[${transposedChord}]`;
  });
  
  // Depois formatar para visualização
  return formatLyricsWithChords(transposedLyrics);
};

export const getAllKeys = (): MusicKey[] => {
  return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
};

// Função para validar se um acorde é válido
export const isValidChord = (chord: string): boolean => {
  return CHORD_REGEX.test(chord);
};

// Função para obter informações detalhadas do acorde
export const getChordInfo = (chord: string): { root: string; quality: string; extension: string } => {
  const rootMatch = chord.match(/^[A-G][#b]?/);
  const root = rootMatch ? rootMatch[0] : '';
  
  const qualityMatch = chord.match(/(?:maj|min|m|M|sus|dim|aug|°|ø)/);
  const quality = qualityMatch ? qualityMatch[0] : '';
  
  const extensionMatch = chord.match(/[0-9]+/);
  const extension = extensionMatch ? extensionMatch[0] : '';
  
  return { root, quality, extension };
};