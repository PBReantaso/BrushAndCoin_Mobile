import { User } from './user';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  description: string;
  imageUrl: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
}

export interface CreatePostData {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  category: string;
}

export interface PostFilters {
  category?: string;
  tags?: string[];
  search?: string;
}

export interface PostResponse {
  success: boolean;
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

