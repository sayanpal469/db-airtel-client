import api from './axiosInstance';

export interface AdminData {
  _id: string;
  name: string;
  email: string;
  lastLogin?: string;
  token?: string;
}

export const authApi = {
  register: (data: any) => 
    api.post<any, any>('/auth/register', data),

  login: (data: any) => 
    api.post<any, any>('/auth/login', data),

  getProfile: () => 
    api.get<any, any>('/auth/profile'),

  updateProfile: (data: any) => 
    api.put<any, any>('/auth/profile', data),

  changePassword: (data: any) => 
    api.put<any, any>('/auth/change-password', data),

  forgotPassword: (email: string) => 
    api.post<any, any>('/auth/forgot-password', { email }),

  verifyOtp: (email: string, otp: string) => 
    api.post<any, any>('/auth/verify-otp', { email, otp }),

  resetPassword: (data: any) => 
    api.post<any, any>('/auth/reset-password', data),

  logout: () => 
    api.post<any, any>('/auth/logout'),
};
