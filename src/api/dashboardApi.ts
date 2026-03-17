import axiosInstance from './axiosInstance';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface DashboardOverview {
  stats: {
    totalConnections: number;
    todayInstalls: number;
    weekInstalls: number;
    monthInstalls: number;
    trends: {
      total: number;
      today: number;
      week: number;
      month: number;
    };
  };
  monthlyGrowth: { month: string; connections: number }[];
  packagePopularity: { name: string; value: number }[];
}

export interface ReportsData {
  totals: {
    engineerCommission: number;
    retailerCommission: number;
    profit: number;
    totalInstallations: number;
    activeRetailers: number;
  };
  monthlyProfit: { month: string; profit: number }[];
  topEngineers: { name: string; count: number; color?: string }[];
}

export const dashboardApi = {
  getOverview: async () => {
    const response = await axiosInstance.get<ApiResponse<DashboardOverview>>('/dashboard/overview');
    return response.data;
  },

  getReports: async () => {
    const response = await axiosInstance.get<ApiResponse<ReportsData>>('/dashboard/reports');
    return response.data;
  }
};
