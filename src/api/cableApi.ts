import axiosInstance from './axiosInstance';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CableAllocation {
  _id: string;
  engineer: {
    _id: string;
    name: string;
  };
  allocatedLength: number;
  usedLength: number;
  remainingLength: number;
}

export interface InventoryStatus {
  totalStock: number;
  allocations: CableAllocation[];
}

export interface CableUsageRecord {
  _id: string;
  connection: {
    _id: string;
    orderId: string;
    customerName: string;
  };
  engineer: {
    _id: string;
    name: string;
  };
  lengthUsed: number;
  orderId: string;
  customerName: string;
  createdAt: string;
}

export const cableApi = {
  addStock: async (length: number, remarks?: string) => {
    const response = await axiosInstance.post<ApiResponse<any>>('/inventory/cable/stock', { length, remarks });
    return response.data;
  },

  allocateToEngineer: async (engineerId: string, length: number) => {
    const response = await axiosInstance.post<ApiResponse<CableAllocation>>('/inventory/cable/allocate', { engineerId, length });
    return response.data;
  },

  getStatus: async () => {
    const response = await axiosInstance.get<ApiResponse<InventoryStatus>>('/inventory/cable/status');
    return response.data;
  },

  getUsageReport: async (engineerId?: string) => {
    const response = await axiosInstance.get<ApiResponse<CableUsageRecord[]>>('/inventory/cable/report', {
      params: { engineerId }
    });
    return response.data;
  }
};
