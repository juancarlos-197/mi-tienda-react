import { http } from '../interceptors/httpInterceptor';
import { User } from '../models/user.model';

export const userService = {
  async getUsers(): Promise<User[]> {
    return http.get<User[]>('/users');
  },

  async getUserById(id: string): Promise<User> {
    return http.get<User>(`/users/${id}`);
  },
};
