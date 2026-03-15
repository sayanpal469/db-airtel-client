/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PackageType = 
  | '40 Mbps + TV + OTT – ₹589 – 76 Days'
  | '30 Mbps + TV + OTT – ₹707 – 65 Days'
  | '100 Mbps + TV + OTT – ₹943 – 48 Days (Popular)'
  | '100 Mbps + TV + OTT – ₹1061 – 43 Days'
  | '499 Only WiFi';

export type ConnectionType = 'Direct Customer' | 'Retailer';

export interface Connection {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  installationDate: string;
  installerName: string;
  package: PackageType;
  connectionType: ConnectionType;
  retailerShopName?: string;
  retailerPhone?: string;
  engineerCommission: number;
  retailerCommission: number;
  profit: number;
  createdAt: string;
}

export interface Retailer {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  area: string;
  status: 'Active' | 'Inactive';
  totalConnections: number;
}

export interface Engineer {
  id: string;
  name: string;
  phone: string;
  area: string;
  status: 'Active' | 'Inactive';
  totalInstallations: number;
}

export interface CommissionSettings {
  companyCost: number;
  customerPrice: number;
  engineerInstallCharge: number;
  retailerCommissionNormal: number;
  retailerCommissionWiFiOnly: number;
}

export type PayoutStatus = 'Paid' | 'Unpaid';

export interface Payout {
  id: string;
  name: string; // Engineer name or Retailer shop name
  type: 'Engineer' | 'Retailer';
  count: number; // Total installations or connections
  commission: number;
  status: PayoutStatus;
  paymentDate?: string;
  month: number;
  year: number;
  connections: Connection[];
}
