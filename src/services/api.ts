const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'CHEF' | 'MANAGER' | 'CASHIER' | 'WAITER';
  accountStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface AuthResponseData {
  token: string;
  tokenType: string;
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'CHEF' | 'MANAGER' | 'CASHIER' | 'WAITER';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'CUSTOMER' | 'ADMIN';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('sizzle_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const authApi = {
  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      if (data.data && typeof data.data === 'object') {
        const fieldErrors = Object.values(data.data).join('; ');
        if (fieldErrors) {
          throw new Error(fieldErrors);
        }
      }
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },

  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      if (data.data && typeof data.data === 'object') {
        const fieldErrors = Object.values(data.data).join('; ');
        if (fieldErrors) {
          throw new Error(fieldErrors);
        }
      }
      throw new Error(data.message || 'Invalid email or password');
    }
    return data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user profile');
    }
    return data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password');
    }
    return data;
  },
};

export const adminApi = {
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch customer users');
    }
    return data;
  },

  updateUserStatus: async (userId: number, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user account status');
    }
    return data;
  },

  getAdminStats: async (): Promise<ApiResponse<Record<string, any>>> => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch admin stats');
    }
    return data;
  },
};

export interface CategoryResponseData {
  id: number;
  name: string;
  displayName: string;
  icon: string;
  description: string;
  itemCount: number;
}

export interface MenuItemResponseData {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  spicyLevel: number;
  prepTime: string;
  rating: number;
  isAvailable: boolean;
  categoryId: number;
  categoryName: string;
}

export interface CreateMenuItemPayload {
  name: string;
  description?: string;
  price: number;
  image?: string;
  isVeg?: boolean;
  spicyLevel?: number;
  prepTime?: string;
  rating?: number;
  isAvailable?: boolean;
  categoryId: number;
}

export const menuApi = {
  getCategories: async (): Promise<ApiResponse<CategoryResponseData[]>> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch categories');
    }
    return data;
  },

  getMenuItems: async (categoryId?: number, search?: string): Promise<ApiResponse<MenuItemResponseData[]>> => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId.toString());
    if (search) params.append('search', search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/menu${queryString}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch menu items');
    }
    return data;
  },

  getMenuItemById: async (id: number): Promise<ApiResponse<MenuItemResponseData>> => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch menu item');
    }
    return data;
  },

  createMenuItem: async (payload: CreateMenuItemPayload): Promise<ApiResponse<MenuItemResponseData>> => {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create menu item');
    }
    return data;
  },

  updateMenuItem: async (id: number, payload: Partial<CreateMenuItemPayload>): Promise<ApiResponse<MenuItemResponseData>> => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update menu item');
    }
    return data;
  },

  deleteMenuItem: async (id: number): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete menu item');
    }
    return data;
  },
};


