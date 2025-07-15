export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  originalKey: MusicKey;
  harmonicMinorKey: string;
  lyrics: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MusicKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

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