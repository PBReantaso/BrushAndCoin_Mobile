export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  userType: 'artist' | 'client';
  specializations?: string[];
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  profileImage?: string;
  bio?: string;
  rating?: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  totalCommissions: number;
  completedCommissions: number;
  averageRating: number;
  totalEarnings: number;
  joinedDate: string;
  lastActive: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  fullName: string;
  userType: 'artist' | 'client';
  specializations?: string[];
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
}
