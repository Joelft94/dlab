import type { PaginatedResponse, Receipt } from "@/types/api"
import axiosInstance from "../config/axios"
import { API_BASE_URL, ENDPOINTS } from "../config/endpoints"

export interface ReceiptFilters {
  year?: number;
  month?: number;
  type?: string;
  employee?: number;
  ordering?: string;
  page?: number;
}

export const getReceipts = async (filters?: ReceiptFilters): Promise<PaginatedResponse<Receipt>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Receipt>>(
    ENDPOINTS.RECEIPTS.LIST,
    { params: filters }
  )
  return data
}

// services/receipts/index.ts
export const getReceiptFile = async (id: string): Promise<{ file: string }> => {
  try {
    console.log('Getting receipt file for ID:', id);
    const endpoint = `${API_BASE_URL}${ENDPOINTS.RECEIPTS.FILE(id)}`;
    console.log('Full endpoint URL:', endpoint);
    
    const { data } = await axiosInstance.get<{ file: string }>(endpoint);
    console.log('Receipt file API response:', data);
    
    if (!data || !data.file) {
      throw new Error('No file URL in response');
    }

    // Debug the file URL
    console.log('File URL from response:', data.file);
    
    return data;
  } catch (error: any) {
    console.error('Receipt file error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${API_BASE_URL}${ENDPOINTS.RECEIPTS.FILE(id)}`
    });
    throw error;
  }
};