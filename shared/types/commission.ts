import { User } from './user';

export interface Commission {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: CommissionStatus;
  client: User;
  artist: User;
  startDate: string;
  deadline: string;
  milestones: Milestone[];
  messages: Message[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export type CommissionStatus = 
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  dueDate: string;
  completedDate?: string;
  amount: number;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  attachments?: string[];
  timestamp: string;
  isRead: boolean;
}

export interface CommissionCreateRequest {
  title: string;
  description: string;
  budget: number;
  artistId: string;
  deadline: string;
  milestones?: Omit<Milestone, 'id'>[];
}

export interface CommissionUpdateRequest {
  title?: string;
  description?: string;
  budget?: number;
  deadline?: string;
  status?: CommissionStatus;
}

export interface CommissionFilters {
  status?: CommissionStatus;
  clientId?: string;
  artistId?: string;
  minBudget?: number;
  maxBudget?: number;
  search?: string;
}
