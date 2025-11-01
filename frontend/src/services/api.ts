import axios from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Card,
  CreateCardDto,
  UpdateCardDto,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authApi = {
  register: (credentials: RegisterCredentials): Promise<AuthResponse> =>
    api.post('/auth/register', credentials).then((res) => res.data),
  
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    api.post('/auth/login', credentials).then((res) => res.data),
};

// Cards endpoints
export const cardsApi = {
  getAll: (category?: string): Promise<Card[]> =>
    api
      .get('/cards', { params: category ? { category } : {} })
      .then((res) => res.data),
  
  getOne: (id: string): Promise<Card> =>
    api.get(`/cards/${id}`).then((res) => res.data),
  
  create: (data: CreateCardDto): Promise<Card> =>
    api.post('/cards', data).then((res) => res.data),
  
  update: (id: string, data: UpdateCardDto): Promise<Card> =>
    api.put(`/cards/${id}`, data).then((res) => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/cards/${id}`).then(() => undefined),
};

export default api;

