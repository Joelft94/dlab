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