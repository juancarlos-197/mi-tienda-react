import { User } from '../models/user.model';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Prof. Carlos Mendoza',
    email: 'admin@mitienda.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    createdAt: '2026-01-01T00:00:00Z',
    address: {
      street: 'Av. Tecnológica 1024',
      city: 'Madrid',
      country: 'España',
      postalCode: '28001',
    },
  },
  {
    id: 'user-client',
    name: 'Ana Sofía Rodríguez',
    email: 'ana@mitienda.com',
    role: 'client',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    createdAt: '2026-01-15T10:00:00Z',
    address: {
      street: 'Calle Gran Vía 42',
      city: 'Barcelona',
      country: 'España',
      postalCode: '08007',
    },
  },
  {
    id: 'user-3',
    name: 'Mateo Torres',
    email: 'mateo@mitienda.com',
    role: 'client',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    createdAt: '2026-02-01T15:20:00Z',
    address: {
      street: 'Paseo de la Reforma 120',
      city: 'Ciudad de México',
      country: 'México',
      postalCode: '06500',
    },
  },
];
