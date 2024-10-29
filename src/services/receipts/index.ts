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

interface PDFResponse {
  file: string;
}

export const getReceipts = async (filters?: ReceiptFilters): Promise<PaginatedResponse<Receipt>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Receipt>>(
    ENDPOINTS.RECEIPTS.LIST,
    { params: filters }
  )
  return data
}



export const getReceiptFile = async (id: string) => {
  try {
    console.log('Fetching PDF URL for receipt ID:', id);
    
    const response = await axiosInstance.get<PDFResponse>(ENDPOINTS.RECEIPTS.FILE(id));
    
    console.log('Response:', response.data);
    
    if (response.data && response.data.file) {
      return response.data; // Return the response directly which contains { file: "url" }
    } else {
      throw new Error('No PDF URL in response');
    }
  } catch (error: any) {
    console.error('Error in getReceiptFile:', {
      error,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
    });
    throw error;
  }
};

// If you need to clean up the blob URL later
export const revokePdfUrl = (url: string) => {
  window.URL.revokeObjectURL(url);
};