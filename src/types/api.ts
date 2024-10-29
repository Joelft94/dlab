// src/types/api.ts
export interface User {
  id: number;
  initials: string;
  hasPendingReceipts: boolean;
  lastLogin: string;
  isSuperuser: boolean;
  username: string;
  firstName: string;
  lastName: string;
  nationality: string;
  email: string;
  fullName: string;
  role: string;
  dateJoined: string;
  createdAt: string;
  modifiedAt: string;
  address: string;
  phoneNumber: string;
  employeeNumber: number;
  requiredPasswordChange: boolean;
}

export interface Receipt {
  id: number;
  createdAt: string;
  modifiedAt: string;
  isActive: boolean;
  fullDate: string;
  year: number;
  month: number;
  type: string;
  isSended: boolean;
  isReaded: boolean;
  isSigned: boolean;
  sendedDate: string | null;
  readedDate: string | null;
  signedDate: string | null;
  employee: number;
  employeeFullName: string;
  employeeNumber: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  numPages: number;
  totalCount: number;
  perPage: number;
  next: string | null;
  previous: string | null;
  count: number;
  fullFilterIds: number[];
  results: T[];
}

export interface ApiError {
  message: string;
  status: number;
}

// src/types/requests.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface GetReceiptsParams {
  ordering?: '-createdAt' | 'createdAt';
  search?: string;
  page?: number;
  year?: number;
  month?: number;
  type?: string;
  isSended?: boolean;
  isReaded?: boolean;
  isSigned?: boolean;
}

export interface GetUsersParams {
  search?: string;
  ordering?: string;
  nationality?: string;
  role?: string;
  page?: number;
}

// src/types/components.ts
export interface FilterOption {
  label: string;
  value: string | number | boolean | null;
}

export interface ActiveFilterProps {
  type: string;
  value: string | number | boolean | null;
  onChange: (value: string | number | boolean | null) => void;
  onRemove: () => void;
  options: FilterOption[];
}

export interface FilterDropdownProps {
  activeFilters: Array<{
    field: string;
    value: string | number | boolean | null;
    label: string;
  }>;
  onAddFilter: (filter: { field: string; value: any; label: string }) => void;
  onRemoveFilter: (filter: { field: string; value: any; label: string }) => void;
  data?: User[];
}

// src/types/constants.ts
export const FILTER_TYPES = {
  PAYMENT_TYPE: 'paymentType',
  SECTOR: 'sector',
  YEAR: 'year',
  MONTH: 'month',
  SENT: 'sent',
  READ: 'read'
} as const;

export type FilterType = typeof FILTER_TYPES[keyof typeof FILTER_TYPES];

export const MONTHS = {
  1: 'Enero',
  2: 'Febrero',
  3: 'Marzo',
  4: 'Abril',
  5: 'Mayo',
  6: 'Junio',
  7: 'Julio',
  8: 'Agosto',
  9: 'Septiembre',
  10: 'Octubre',
  11: 'Noviembre',
  12: 'Diciembre'
} as const;