import { env } from '../config/env';

interface ApiError extends Error {
  status?: number;
  data?: any;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetchJson<T>(
    endpoint: string, 
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error: ApiError = new Error('API Error');
      error.status = response.status;
      try {
        error.data = await response.json();
      } catch {
        error.data = await response.text();
      }
      throw error;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.fetchJson<T>(endpoint);
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.fetchJson<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Add other methods (PUT, DELETE, etc.) as needed
}

// Create and export a singleton instance using the environment variable
export const api = new ApiService(env.apiUrl); 