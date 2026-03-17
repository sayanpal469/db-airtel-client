import axiosInstance from './axiosInstance';
import { Connection } from '../types';

export interface PayoutResponse {
  id: string;
  recipientId: string;
  name: string;
  type: 'Engineer' | 'Retailer';
  count: number;
  commission: number;
  status: 'Paid' | 'Unpaid';
  paymentDate?: string;
  month: number;
  year: number;
  connections: Partial<Connection>[];
}

export interface MonthlySummary {
  totalConnections: number;
  totalRevenue: number;
  totalCompanyCost: number;
  totalEngineerCommission: number;
  totalRetailerCommission: number;
  totalProfit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const payoutApi = {
  getPayouts: async (type: 'Engineer' | 'Retailer', month: number, year: number) => {
    const response = await axiosInstance.get<ApiResponse<PayoutResponse[]>>(`/payouts/list`, {
      params: { type, month, year }
    });
    return response.data;
  },

  updateStatus: async (data: {
    recipientId: string;
    recipientType: 'Engineer' | 'Retailer';
    month: number;
    year: number;
    amount: number;
    connectionCount: number;
    status?: 'Paid' | 'Unpaid';
    transactionId?: string;
    remarks?: string;
  }) => {
    const response = await axiosInstance.patch<ApiResponse<any>>(`/payouts/status`, data);
    return response.data;
  },

  getMonthlySummary: async (month: number, year: number) => {
    const response = await axiosInstance.get<ApiResponse<MonthlySummary>>(`/payouts/summary`, {
      params: { month, year }
    });
    return response.data;
  },

  getHistory: async (params: { 
    type?: string; 
    status?: string; 
    month?: number | 'all'; 
    year?: number | 'all' 
  }) => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(`/payouts/history`, {
      params
    });
    return response.data;
  },

  getAnalytics: async (year: number) => {
    const response = await axiosInstance.get<ApiResponse<any>>(`/payouts/analytics`, {
      params: { year }
    });
    return response.data;
  }
};
