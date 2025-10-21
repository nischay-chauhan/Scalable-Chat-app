export const API_BASE_URL = 'http://localhost:3001';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Something went wrong',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: 'Failed to connect to the server',
    };
  }
}

export const userApi = {
  create: async (username: string, room: string) => 
    apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify({ username, room }),
    }),
  
  search: async (username: string) =>
    apiFetch(`/users/by-username/${encodeURIComponent(username)}`),
  
  getRoomUsers: async (room: string) =>
    apiFetch(`/users?room=${encodeURIComponent(room)}`),
  
  remove: async (id: string) =>
    apiFetch(`/users/${id}`, { method: 'DELETE' }),
};
