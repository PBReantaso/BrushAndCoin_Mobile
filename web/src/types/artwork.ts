import { User } from './user';

export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  tags: string[];
  artist: User;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArtworkCreateRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  imageFile: File;
}

export interface ArtworkUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  tags?: string[];
  isAvailable?: boolean;
}

export interface ArtworkFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  artistId?: string;
  isAvailable?: boolean;
  search?: string;
}

export interface ArtworkResponse {
  success: boolean;
  data: Artwork[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
