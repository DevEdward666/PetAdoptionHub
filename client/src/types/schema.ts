export interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  size: string | null;
  description: string;
  imageUrl: string;
  ownerId: number;
  ownerName: string;
  ownerAvatarUrl: string;
  likes: number;
  isAdoptable: boolean;
  isRecent: boolean;
  isFeatured: boolean;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  gallery?: string[];
}

export interface Owner {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  createdAt: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Report {
  id: number;
  type: string;
  description: string;
  location: string;
  reporterId: number;
  createdAt: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
} 