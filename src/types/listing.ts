import type { Image } from './image';

export type ListingStatus = 'active' | 'sold' | 'inactive';

export type ListingCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: ListingCondition;
  category: Category | null;
  categoryId: string | null;
  images: Image[];
  location: string | null;
  status: ListingStatus;
  views: number;
  user: User | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
