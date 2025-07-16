import {
  parseChord,
  transposeChord,
  CHORD_REGEX,
} from '../utils/chordTransposition';

export interface ChordPosition {
  chord: string;
  position: number;
  line: number;
}

export interface ProcessedLine {
  lyrics: string;
  chords: ChordPosition[];
}

export interface ProcessedSong {
  lines: ProcessedLine[];
  format: 'above';
}

/**
 * Processa cifras exclusivamente no formato acordes acima da letra
 */
export function processChords(lyrics: string): ProcessedSong {
  const lines = lyrics.split('\n');
  const processedLines: ProcessedLine[] = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i + 1] ?? '';

    if (isChordLine(currentLine) && nextLine && !isChordLine(nextLine)) {
      // Linha de acordes acima de letra
      const chords = extractChordsFromLine(currentLine, processedLines.length);
      processedLines.push({
        lyrics: nextLine,
        chords
      });
      i++; // pula a linha de letra já processada
    } else {
      // Linha sem acordes acima
      processedLines.push({
        lyrics: currentLine,
        chords: []
      });
    }
  }

  return {
    lines: processedLines,
    format: 'above'
  };
}

/**
 * Verifica se uma linha contém apenas acordes (acima da letra)
 */
function isChordLine(line: string): boolean {
  const trimmed = line.trim();
  
  // Ignore linhas que são títulos de seção (ex: [VERSO])
  if (/^\[[^\]]+\]$/.test(trimmed)) return false;
  
  // Lógica original de detecção de acordes
  const tokens = trimmed.split(/(?<=\))|\s+|(?=\()/);
  return tokens.length > 0 && tokens.every(token => parseChord(token) !== null);
}

/**
 * Extrai acordes de uma linha e calcula suas posições
 */
function extractChordsFromLine(line: string, lineIndex: number): ChordPosition[] {
  const chords: ChordPosition[] = [];
  let match: RegExpExecArray | null;
  
  // Reset regex para garantir que comece do início
  CHORD_REGEX.lastIndex = 0;

  // percorre cada ocorrência do CHORD_REGEX
  while ((match = CHORD_REGEX.exec(line)) !== null) {
    const chordText = match[0];
    const pos = match.index;
    chords.push({
      chord: chordText,
      position: pos,
      line: lineIndex
    });
  }

  return chords;
}

/**
 * Converte cifra processada para HTML com acordes posicionados acima das letras
 * Mantém layout consistente independente da transposição
 */
export function formatProcessedSongToHTML(
  processedSong: ProcessedSong, 
  fromKey?: string, 
  toKey?: string
): string {
  return processedSong.lines.map(line => {
    const text = line.lyrics;
    const topicMatch = text.trim().match(/^\[([^\]]+)\]$/);

    if (topicMatch) {
      // exibe só o conteúdo em negrito, sem colchetes
      return `<div class="song-topic"><b style="color:#000">${topicMatch[1]}</b></div>`;
    }

    if (line.chords.length === 0) {
      return `<div class="lyrics-line">${text}</div>`;
    }

    // Determina a largura em caracteres necessária
    const maxLength = Math.max(
      text.length,
      ...line.chords.map(c => c.position + c.chord.length)
    );

    // Cria um mapa de posição → chord (com transposição se necessário)
    const chordMap = new Map<number, { original: string; transposed: string }>();
    
    for (const { chord, position } of line.chords) {
      const transposedChord = (fromKey && toKey && fromKey !== toKey) 
        ? transposeChord(chord, fromKey, toKey)
        : chord;
      
      chordMap.set(position, { 
        original: chord, 
        transposed: transposedChord 
      });
    }

    // Monta a linha de acordes caractere a caractere
    let chordLine = '';
    let i = 0;
    
    while (i < maxLength) {
      if (chordMap.has(i)) {
        const { transposed } = chordMap.get(i)!;
        const chordHtml = `<b style="color: #1e40af;">${transposed}</b>`;
        chordLine += chordHtml;
        
        // Avança pelo comprimento do acorde ORIGINAL para manter posicionamento
        const originalChord = chordMap.get(i)!.original;
        i += originalChord.length;
      } else {
        chordLine += ' ';
        i++;
      }
    }

    // Preserva espaçamento exato
    return `<div class="chord-line" style="white-space: pre; font-family: monospace; line-height: 1.2; margin-bottom: 2px;">${chordLine}</div>
<div class="lyrics-line" style="font-family: monospace; line-height: 1.2;">${text}</div>`;
  }).join('\n');
}

/**
 * Versão melhorada que mantém o layout original
 */
export function formatProcessedSongToHTMLWithTransposition(
  processedSong: ProcessedSong, 
  originalKey: string, 
  targetKey: string
): string {
  return processedSong.lines.map(line => {
    const text = line.lyrics;
    const topicMatch = text.trim().match(/^\[([^\]]+)\]$/);

    if (topicMatch) {
      return `<div class="song-topic"><b style="color:#000">${topicMatch[1]}</b></div>`;
    }

    if (line.chords.length === 0) {
      return `<div class="lyrics-line" style="font-family: monospace; line-height: 1.4;">${text}</div>`;
    }

    // Calcula o comprimento necessário baseado no texto original
    const textLength = text.length;
    const maxChordEnd = Math.max(
      ...line.chords.map(c => c.position + c.chord.length),
      0
    );
    const totalWidth = Math.max(textLength, maxChordEnd);

    // Cria array de caracteres para a linha de acordes
    const chordLineArray = new Array(totalWidth).fill(' ');
    
    // Posiciona os acordes transpostos mantendo as posições originais
    for (const { chord, position } of line.chords) {
      const transposedChord = originalKey !== targetKey 
        ? transposeChord(chord, originalKey, targetKey)
        : chord;
      
      // Insere o acorde transposto na posição original
      for (let i = 0; i < transposedChord.length && (position + i) < totalWidth; i++) {
        chordLineArray[position + i] = transposedChord[i];
      }
    }

    const chordLineText = chordLineArray.join('');
    const chordLineHtml = chordLineText.replace(/(\S+)/g, '<b style="color: #1e40af;">$1</b>');

    return `<div class="chord-line" style="white-space: pre; font-family: monospace; line-height: 1.2; margin-bottom: 2px; color: #1e40af;">${chordLineHtml}</div>
<div class="lyrics-line" style="font-family: monospace; line-height: 1.4;">${text}</div>`;
  }).join('\n');
}