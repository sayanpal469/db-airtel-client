import api from './axiosInstance';
import { Connection } from '../types';
import { ApiResponse } from './engineerApi';

export interface ConnectionFilterParams {
  search?: string;
  connectionType?: string;
  engineerId?: string;
  retailerId?: string;
  startDate?: string;
  endDate?: string;
  package?: string;
  page?: number;
  limit?: number;
}

export interface ConnectionsResponse {
  connections: Connection[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const connectionApi = {
  create: (data: any) =>
    api.post<any, ApiResponse<Connection>>('/connections', data),

  getAll: (params: ConnectionFilterParams) =>
    api.get<any, ApiResponse<ConnectionsResponse>>('/connections', { params }),

  getById: (id: string) =>
    api.get<any, ApiResponse<Connection>>(`/connections/${id}`),

  updateStatus: (id: string, status: string) =>
    api.patch<any, ApiResponse<Connection>>(`/connections/${id}/status`, { status }),
};
