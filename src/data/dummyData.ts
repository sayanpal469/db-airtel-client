import { Connection, Retailer, PackageType, Engineer, CommissionSettings } from '../types';
import { subDays, format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export const DEFAULT_COMMISSION_SETTINGS: CommissionSettings = {
  customerPrice: 1500,
  companyCost: 1150,
  engineerInstallCharge: 400,
  retailerCommissionNormal: 350,
  retailerCommissionWiFiOnly: 250,
};

const PACKAGES: PackageType[] = [
  '40 Mbps + TV + OTT – ₹589 – 76 Days',
  '30 Mbps + TV + OTT – ₹707 – 65 Days',
  '100 Mbps + TV + OTT – ₹943 – 48 Days (Popular)',
  '100 Mbps + TV + OTT – ₹1061 – 43 Days',
  '499 Only WiFi'
];

export const DUMMY_ENGINEERS: Engineer[] = [
  { id: 'eng-1', name: 'Amit Sharma', phone: '9876543210', area: 'Sector 62', status: 'Active', totalInstallations: 45 },
  { id: 'eng-2', name: 'Rahul Verma', phone: '9876543211', area: 'Indirapuram', status: 'Active', totalInstallations: 38 },
  { id: 'eng-3', name: 'Sanjay Gupta', phone: '9876543212', area: 'Vaishali', status: 'Active', totalInstallations: 32 },
  { id: 'eng-4', name: 'Vikram Singh', phone: '9876543213', area: 'Kaushambi', status: 'Inactive', totalInstallations: 28 },
  { id: 'eng-5', name: 'Deepak Kumar', phone: '9876543214', area: 'Vasundhara', status: 'Active', totalInstallations: 25 },
];

export const DUMMY_RETAILERS: Retailer[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `ret-${i}`,
  name: `Owner ${i + 1}`,
  shopName: `Retailer Shop ${i + 1}`,
  phone: `88776${Math.floor(10000 + Math.random() * 90000)}`,
  area: ['Sector 62', 'Indirapuram', 'Vaishali', 'Kaushambi'][Math.floor(Math.random() * 4)],
  status: Math.random() > 0.2 ? 'Active' : 'Inactive',
  totalConnections: Math.floor(Math.random() * 50) + 5,
}));

export const DUMMY_CONNECTIONS: Connection[] = Array.from({ length: 50 }).map((_, i) => {
  const date = subDays(new Date(), Math.floor(Math.random() * 60));
  const isRetailer = Math.random() > 0.6;
  const pkg = PACKAGES[Math.floor(Math.random() * PACKAGES.length)];
  const isWiFiOnly = pkg === '499 Only WiFi';
  
  const engComm = DEFAULT_COMMISSION_SETTINGS.engineerInstallCharge;
  const retComm = isRetailer 
    ? (isWiFiOnly ? DEFAULT_COMMISSION_SETTINGS.retailerCommissionWiFiOnly : DEFAULT_COMMISSION_SETTINGS.retailerCommissionNormal)
    : 0;
  const profit = DEFAULT_COMMISSION_SETTINGS.companyCost - engComm - retComm;

  const retailer = isRetailer ? DUMMY_RETAILERS[Math.floor(Math.random() * DUMMY_RETAILERS.length)] : null;

  return {
    id: `conn-${i}`,
    orderId: `ORD-${1000 + i}`,
    customerName: `Customer ${i + 1}`,
    customerPhone: `98765${Math.floor(10000 + Math.random() * 90000)}`,
    installationDate: format(date, 'yyyy-MM-dd'),
    installerName: DUMMY_ENGINEERS[Math.floor(Math.random() * DUMMY_ENGINEERS.length)].name,
    package: pkg,
    connectionType: isRetailer ? 'Retailer' : 'Direct Customer',
    retailerShopName: retailer?.shopName,
    retailerPhone: retailer?.phone,
    engineerCommission: engComm,
    retailerCommission: retComm,
    profit: profit,
    createdAt: format(date, 'yyyy-MM-dd HH:mm:ss'),
  };
});

export const MONTHLY_GROWTH_DATA = [
  { month: 'Jan', connections: 45, profit: 18000 },
  { month: 'Feb', connections: 52, profit: 20800 },
  { month: 'Mar', connections: 48, profit: 19200 },
  { month: 'Apr', connections: 70, profit: 28000 },
  { month: 'May', connections: 65, profit: 26000 },
  { month: 'Jun', connections: 85, profit: 34000 },
];

export const PACKAGE_POPULARITY_DATA = [
  { name: '40 Mbps', value: 30 },
  { name: '30 Mbps', value: 15 },
  { name: '100 Mbps (943)', value: 40 },
  { name: '100 Mbps (1061)', value: 10 },
  { name: '499 WiFi', value: 5 },
];
