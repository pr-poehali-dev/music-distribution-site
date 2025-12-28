export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Track {
  id: string;
  name: string;
  file: File | null;
  fileUrl?: string;
  duration?: string;
  tiktokMoment?: string;
  musicAuthor?: string;
  lyricsAuthor?: string;
  hasProfanity?: boolean;
  performers?: string;
  producers?: string;
  isrc?: string;
  language?: string;
}

export interface Release {
  id: string;
  userId: string;
  albumName: string;
  artistName: string;
  releaseDate: string;
  oldReleaseDate?: string;
  genre: string;
  upc?: string;
  coverImage: string | null;
  tracks: Track[];
  status: 'draft' | 'moderation' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  response?: string;
  status: 'open' | 'answered' | 'closed';
  createdAt: string;
  answeredAt?: string;
}

export type AppContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  releases: Release[];
  tickets: Ticket[];
  addUser: (user: User) => void;
  addRelease: (release: Release) => void;
  updateRelease: (id: string, updates: Partial<Release>) => void;
  deleteRelease: (id: string) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};