import type { PaginatedResponse, User } from '@/types/api';
import axios from '../config/axios';
import { ENDPOINTS } from '../config/endpoints';

interface GetUsersParams {
  nationality?: string;
  search?: string;
  page?: number;
}

export const getUsers = async (params?: GetUsersParams) => {
  const { data } = await axios.get<PaginatedResponse<User>>(
    ENDPOINTS.USERS.LIST,
    { params }
  );
  return data;
};