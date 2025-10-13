// Shared Commission API Endpoints for Mobile and Web

export const COMMISSION_ENDPOINTS = {
  // Commission Requests
  CREATE_REQUEST: '/commissions/requests',
  GET_REQUESTS: '/commissions/requests',
  GET_REQUEST_BY_ID: (id: string) => `/commissions/requests/${id}`,
  
  // Commission Management
  GET_COMMISSIONS: '/commissions',
  GET_COMMISSION_BY_ID: (id: string) => `/commissions/${id}`,
  GET_USER_COMMISSIONS: '/commissions/user',
  GET_PENDING_COMMISSIONS: '/commissions/pending',
  
  // Commission Actions
  ACCEPT_COMMISSION: (id: string) => `/commissions/${id}/accept`,
  DECLINE_COMMISSION: (id: string) => `/commissions/${id}/decline`,
  CANCEL_COMMISSION: (id: string) => `/commissions/${id}/cancel`,
  
  // Work Management
  SUBMIT_WORK: (id: string) => `/commissions/${id}/submit`,
  APPROVE_WORK: (id: string) => `/commissions/${id}/approve`,
  REQUEST_REVISION: (id: string) => `/commissions/${id}/revision`,
  
  // Escrow Management
  GET_ESCROW_STATUS: (id: string) => `/commissions/${id}/escrow`,
  RELEASE_ESCROW: (id: string) => `/commissions/${id}/escrow/release`,
  REFUND_ESCROW: (id: string) => `/commissions/${id}/escrow/refund`,
  
  // Progress Updates
  UPDATE_PROGRESS: (id: string) => `/commissions/${id}/progress`,
  GET_PROGRESS_HISTORY: (id: string) => `/commissions/${id}/progress`,
  
  // File Upload
  UPLOAD_REFERENCE_IMAGE: '/commissions/upload/reference',
  UPLOAD_WORK_FILE: '/commissions/upload/work',
} as const;

export const COMMISSION_QUERY_PARAMS = {
  STATUS: 'status',
  CATEGORY: 'category',
  MIN_BUDGET: 'min_budget',
  MAX_BUDGET: 'max_budget',
  IS_URGENT: 'is_urgent',
  DATE_FROM: 'date_from',
  DATE_TO: 'date_to',
  PAGE: 'page',
  LIMIT: 'limit',
  SORT_BY: 'sort_by',
  SORT_ORDER: 'sort_order',
} as const;

export const COMMISSION_SORT_OPTIONS = {
  CREATED_AT: 'created_at',
  DEADLINE: 'deadline',
  BUDGET: 'budget',
  STATUS: 'status',
} as const;

export const COMMISSION_SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;
