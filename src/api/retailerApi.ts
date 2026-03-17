import api from './axiosInstance';
import { Retailer } from '../types';
import { ApiResponse, PaginatedResponse } from './engineerApi';

export const retailerApi = {
  getAll: (params?: { active?: boolean; page?: number; limit?: number; search?: string }) =>
    api.get<any, ApiResponse<PaginatedResponse<Retailer>>>('/retailers', { params }),

  getActive: () =>
    api.get<any, ApiResponse<PaginatedResponse<Retailer>>>('/retailers/active'),

  getById: (id: string) =>
    api.get<any, ApiResponse<Retailer>>(`/retailers/${id}`),

  create: (data: Partial<Retailer>) =>
    api.post<any, ApiResponse<Retailer>>('/retailers', data),

  update: (id: string, data: Partial<Retailer>) =>
    api.put<any, ApiResponse<Retailer>>(`/retailers/${id}`, data),

  delete: (id: string) =>
    api.delete<any, ApiResponse<null>>(`/retailers/${id}`),

  toggleStatus: (id: string) =>
    api.patch<any, ApiResponse<Retailer>>(`/retailers/${id}/toggle`),

  bulkUpdateStatus: (ids: string[], isActive: boolean) =>
    api.patch<any, ApiResponse<any>>('/retailers/bulk/status', { ids, isActive }),
};
