import api from './axiosInstance';
import { Engineer } from '../types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  engineers?: T[];
  retailers?: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const engineerApi = {
  getAll: (params?: { active?: boolean; page?: number; limit?: number; search?: string }) =>
    api.get<any, ApiResponse<PaginatedResponse<Engineer>>>('/engineers', { params }),

  getActive: () =>
    api.get<any, ApiResponse<PaginatedResponse<Engineer>>>('/engineers/active'),

  getById: (id: string) =>
    api.get<any, ApiResponse<Engineer>>(`/engineers/${id}`),

  create: (data: Partial<Engineer>) =>
    api.post<any, ApiResponse<Engineer>>('/engineers', data),

  update: (id: string, data: Partial<Engineer>) =>
    api.put<any, ApiResponse<Engineer>>(`/engineers/${id}`, data),

  delete: (id: string) =>
    api.delete<any, ApiResponse<null>>(`/engineers/${id}`),

  toggleStatus: (id: string) =>
    api.patch<any, ApiResponse<Engineer>>(`/engineers/${id}/toggle`),

  bulkUpdateStatus: (ids: string[], isActive: boolean) =>
    api.patch<any, ApiResponse<any>>('/engineers/bulk/status', { ids, isActive }),
};
