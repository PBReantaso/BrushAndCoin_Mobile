export interface Event {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  startDate: string;
  endDate: string;
  category: string;
  tags: string[];
  organizerId: string;
  organizer: {
    id: string;
    name: string;
    profileImage?: string;
  };
  attendees: string[];
  maxAttendees?: number;
  isPublic: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventCreateRequest {
  title: string;
  description: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  startDate: string;
  endDate: string;
  category: string;
  tags: string[];
  maxAttendees?: number;
  isPublic: boolean;
  imageFile?: File;
}

export interface EventFilters {
  category?: string;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  startDate?: string;
  endDate?: string;
  isPublic?: boolean;
  search?: string;
}
