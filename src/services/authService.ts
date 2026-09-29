import { http } from '../interceptors/httpInterceptor';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../models/user.model';
import { storage } from '../utils/storage';

const TOKEN_KEY = 'mitienda_auth_token';
const USER_KEY = 'mitienda_current_user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/login', credentials);
    if (response && response.token) {
      storage.set(TOKEN_KEY, response.token);
      storage.set(USER_KEY, response.user);
    }
    return response;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/register', data);
    if (response && response.token) {
      storage.set(TOKEN_KEY, response.token);
      storage.set(USER_KEY, response.user);
    }
    return response;
  },

  async getCurrentUser(): Promise<User> {
    const user = await http.get<User>('/auth/me');
    storage.set(USER_KEY, user);
    return user;
  },

  getStoredToken(): string | null {
    return storage.get<string | null>(TOKEN_KEY, null);
  },

  getStoredUser(): User | null {
    return storage.get<User | null>(USER_KEY, null);
  },

  logout(): void {
    storage.remove(TOKEN_KEY);
    storage.remove(USER_KEY);
  },
};
