import api from './authApi';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categoriesApi = {
  getAll: async (includeInactive?: boolean): Promise<Category[]> => {
    const params = new URLSearchParams();
    if (includeInactive !== undefined) {
      params.append('includeInactive', String(includeInactive));
    }
    const queryString = params.toString();
    const url = queryString ? `/categories?${queryString}` : '/categories';
    const response = await api.get(url);
    return response.data;
  },

  getOne: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};
