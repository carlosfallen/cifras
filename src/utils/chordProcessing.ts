import {
  parseChord,
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
  if (!trimmed) return false;

  // tenta encontrar *somente* tokens de acorde na linha inteira
  const tokens = trimmed.split(/(?<=\))|\s+|(?=\()/);
  return tokens.every(token => parseChord(token) !== null);
}

/**
 * Extrai acordes de uma linha e calcula suas posições
 */
function extractChordsFromLine(line: string, lineIndex: number): ChordPosition[] {
  const chords: ChordPosition[] = [];
  let match: RegExpExecArray | null;

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
 */
export function formatProcessedSongToHTML(processedSong: ProcessedSong): string {
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

    // Cria um mapa de posição → chordHtml
    const chordMap = new Map<number, string>();
    for (const { chord, position } of line.chords) {
      chordMap.set(position, `<b>${chord}</b>`);
    }

    // Monta a linha de acordes caractere a caractere
    let chordLine = '';
    for (let i = 0; i < maxLength; i++) {
      if (chordMap.has(i)) {
        // insere o acorde e “pula” à frente pelo comprimento da cifra
        const html = chordMap.get(i)!;
        chordLine += html;
        // avançar o índice lógico para não reescrever espaços
        i += ( (chordMap.get(i)![0] === '<') 
               ?  // se HTML, estimativa de avanço: use chord.length
                 // (não a string HTML completa)
                 line.chords.find(c => c.position === i)!.chord.length 
               : 0 );
      } else {
        chordLine += ' ';
      }
    }

    // **Importante**: não colapsar espaços, preserve exatamente
    return `
<div class="chord-line" style="white-space: pre;">${chordLine}</div>
<div class="lyrics-line">${text}</div>`;
  }).join('\n');
}
