import api from './authApi';
import type { Image } from '../types/image';

export interface UploadImageDto {
  source: string; // base64 or URL
  listingId: string;
  displayOrder?: number;
}

export const imagesApi = {
  upload: async (data: UploadImageDto): Promise<Image> => {
    const response = await api.post('/images/upload', data);
    return response.data;
  },

  getByListing: async (listingId: string): Promise<Image[]> => {
    const response = await api.get(`/images/listing/${listingId}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/images/${id}`);
  },
};
