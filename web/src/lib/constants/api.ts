export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/update',
    SEARCH: '/api/users/search',
    GET_BY_ID: (id: string) => `/api/users/${id}`,
  },
  // ... other endpoints
} as const;