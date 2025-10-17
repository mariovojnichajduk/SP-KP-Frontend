import api from './authApi';
import type { Listing, ListingCondition } from '../types/listing';

export interface ListingsFilters {
  status?: string;
  categoryId?: string;
  userId?: string;
  search?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateListingDto {
  title: string;
  description: string;
  price: number;
  condition?: ListingCondition;
  categoryId?: string;
  images?: string[];
  location?: string;
}

export const listingsApi = {
  getAll: async (filters?: ListingsFilters): Promise<Listing[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.condition) params.append('condition', filters.condition);
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());

    const response = await api.get(`/listings?${params.toString()}`);
    return response.data;
  },

  getOne: async (id: string): Promise<Listing> => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  getMyListings: async (token: string): Promise<Listing[]> => {
    const response = await api.get('/listings/my-listings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getMyListingIds: async (): Promise<string[]> => {
    const response = await api.get('/listings/my-listing-ids');
    return response.data;
  },

  create: async (data: CreateListingDto): Promise<Listing> => {
    const response = await api.post('/listings', data);
    return response.data;
  },

  update: async (id: string, data: CreateListingDto): Promise<Listing> => {
    const response = await api.patch(`/listings/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/listings/${id}`);
  },
};
