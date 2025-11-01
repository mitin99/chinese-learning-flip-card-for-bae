export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface Card {
  id: string;
  chinese: string;
  pinyin?: string;
  vietnamese: string;
  categories: string[];
  authorId?: string;
  isSystemCard: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

export interface CreateCardDto {
  chinese: string;
  pinyin?: string;
  vietnamese: string;
  categories?: string[];
}

export interface UpdateCardDto {
  chinese?: string;
  pinyin?: string;
  vietnamese?: string;
  categories?: string[];
}

