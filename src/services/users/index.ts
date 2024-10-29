import type { PaginatedResponse, User } from "@/types/api"
import axiosInstance from "../config/axios"
import { ENDPOINTS } from "../config/endpoints"

export interface UserFilters {
  search?: string
  nationality?: string
  page?: number
  ordering?: string
}

interface UsersResponse extends PaginatedResponse<User> {
  fullFilterIds: number[]
  // Add any other filter-related fields from the API response
}

export const getUsers = async (filters?: UserFilters): Promise<UsersResponse> => {
  const { data } = await axiosInstance.get<UsersResponse>(
    ENDPOINTS.USERS.LIST,
    { params: filters }
  )
  return data
}

// Get available filter values
export const getUsersFilters = async () => {
  const { data } = await axiosInstance.get(`${ENDPOINTS.USERS.LIST}filters/`)
  return data
}