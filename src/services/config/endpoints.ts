export const API_BASE_URL = 'https://api.schneck.dlab.software/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/demo_login/',
  },
  USERS: {
    LIST: '/users/',
  },
  RECEIPTS: {
    LIST: '/receipts/',
    FILE: (id: string) => `/receipts/${id}/file`,
  },
} as const;