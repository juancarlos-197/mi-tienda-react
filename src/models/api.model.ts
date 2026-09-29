export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  requiresAuth?: boolean;
  timeout?: number;
}

export interface NetworkLog {
  id: string;
  timestamp: string;
  method: HttpMethod;
  url: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  payload?: any;
  response?: any;
  durationMs: number;
  error?: boolean;
}
