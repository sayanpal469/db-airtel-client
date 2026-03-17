import api from './axiosInstance';
import { CommissionSettings } from '../types';
import { ApiResponse } from './engineerApi';

export const commissionApi = {
  getSettings: () =>
    api.get<any, ApiResponse<CommissionSettings>>('/settings/commission'),

  updateSettings: (data: CommissionSettings) =>
    api.put<any, ApiResponse<CommissionSettings>>('/settings/commission', data),
};
