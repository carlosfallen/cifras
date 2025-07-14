export interface User {
  uid: string;
  email: string;
  displayName: string;
  userType: 'reader' | 'writer';
  bio?: string;
  photoURL?: string;
  createdAt: Date;
  favorites: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  originalKey: MusicKey;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lyrics: string;
  tablature?: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
}

export type MusicKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export interface ChordProgression {
  [key: string]: string[];
}