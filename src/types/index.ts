export interface User {
  uid: string;  // ← Certifique-se de que esta propriedade existe
  email: string;
  displayName: string;
  createdAt: Date;
  notificationToken?: string;  // Opcional
  lastTokenUpdate?: any;       // Opcional
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  originalKey: MusicKey;
  lyrics: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  tempo?: number;
  timeSignature?: string;
  capo?: number;
  notes?: string;
}

export interface SongFilter {
  search?: string;
  key?: MusicKey;
  artist?: string;
  tags?: string[];
}

export type MusicKey = 
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'
  | 'Am' | 'A#m' | 'Bm' | 'Cm' | 'C#m' | 'Dm' | 'D#m' | 'Em' | 'Fm' | 'F#m' | 'Gm' | 'G#m';

export interface ScheduledSong {
  id: string;
  songId: string;
  date: Date;
  singer: string;
  notes?: string;
  createdAt: Date;
  createdBy: string | null;
  createdByName: string;
}

// Interface para configurações de transposição
export interface TransposeConfig {
  fromKey: MusicKey;
  toKey: MusicKey;
  showChordNames?: boolean;
  showChordDiagrams?: boolean;
}

// Interface para informações de acorde
export interface ChordInfo {
  root: string;
  quality: string;
  extension?: string;
  bass?: string;
  type: string;
  valid: boolean;
}

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
  format: 'brackets' | 'above' | 'mixed';
}

export interface ChordParts {
  root: string;
  accidental: string;
  quality: string;
  extension: string;
  bass?: string;
}