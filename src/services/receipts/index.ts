import type { PaginatedResponse, Receipt } from '@/types/api';
import axios from '../config/axios';
import { ENDPOINTS } from '../config/endpoints';

interface GetReceiptsParams {
  year?: number;
  month?: number;
  page?: number;
}

export const getReceipts = async (params?: GetReceiptsParams) => {
  const { data } = await axios.get<PaginatedResponse<Receipt>>(
    ENDPOINTS.RECEIPTS.LIST,
    { params }
  );
  return data;
};

export const getReceiptFile = async (id: number) => {
  const { data } = await axios.get<{ file: string }>(
    ENDPOINTS.RECEIPTS.FILE(id)
  );
  return data;
};