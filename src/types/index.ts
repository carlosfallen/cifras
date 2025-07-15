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
  lyrics: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MusicKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';