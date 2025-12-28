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
}

export interface Release {
  id: string;
  userId: string;
  albumName: string;
  artistName: string;
  releaseDate: string;
  genre: string;
  coverImage: string | null;
  tracks: Track[];
  status: 'draft' | 'moderation' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  releases: Release[];
  addUser: (user: User) => void;
  addRelease: (release: Release) => void;
  updateRelease: (id: string, updates: Partial<Release>) => void;
  deleteRelease: (id: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};
