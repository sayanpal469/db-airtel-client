import { Connection, Payout, PayoutStatus } from '../types';
import { parseISO, getMonth, getYear } from 'date-fns';

export const calculateMonthlySummary = (connections: Connection[], month: number, year: number) => {
  const filtered = connections.filter(conn => {
    const date = parseISO(conn.installationDate);
    return getMonth(date) === month && getYear(date) === year;
  });

  return filtered.reduce((acc, conn) => {
    acc.totalConnections += 1;
    acc.totalRevenue += 1500; // Fixed customer price as per rules
    acc.totalCompanyCost += 1150; // Fixed company cost
    acc.totalEngineerCommission += conn.engineerCommission;
    acc.totalRetailerCommission += conn.retailerCommission;
    acc.totalProfit += conn.profit;
    return acc;
  }, {
    totalConnections: 0,
    totalRevenue: 0,
    totalCompanyCost: 0,
    totalEngineerCommission: 0,
    totalRetailerCommission: 0,
    totalProfit: 0
  });
};

export const getEngineerPayouts = (connections: Connection[], month: number, year: number): Payout[] => {
  const filtered = connections.filter(conn => {
    const date = parseISO(conn.installationDate);
    return getMonth(date) === month && getYear(date) === year;
  });

  const payoutsMap: Record<string, Payout> = {};

  filtered.forEach(conn => {
    if (!payoutsMap[conn.installerName]) {
      payoutsMap[conn.installerName] = {
        id: `eng-${conn.installerName}-${month}-${year}`,
        name: conn.installerName,
        type: 'Engineer',
        count: 0,
        commission: 0,
        status: Math.random() > 0.5 ? 'Paid' : 'Unpaid', // Mixed status for dummy data
        paymentDate: Math.random() > 0.5 ? new Date().toISOString() : undefined,
        month,
        year,
        connections: []
      };
    }
    payoutsMap[conn.installerName].count += 1;
    payoutsMap[conn.installerName].commission += conn.engineerCommission;
    payoutsMap[conn.installerName].connections.push(conn);
  });

  return Object.values(payoutsMap);
};

export const getRetailerPayouts = (connections: Connection[], month: number, year: number): Payout[] => {
  const filtered = connections.filter(conn => {
    const date = parseISO(conn.installationDate);
    return getMonth(date) === month && getYear(date) === year && conn.connectionType === 'Retailer';
  });

  const payoutsMap: Record<string, Payout> = {};

  filtered.forEach(conn => {
    const shopName = conn.retailerShopName || 'Unknown';
    if (!payoutsMap[shopName]) {
      payoutsMap[shopName] = {
        id: `ret-${shopName}-${month}-${year}`,
        name: shopName,
        type: 'Retailer',
        count: 0,
        commission: 0,
        status: Math.random() > 0.5 ? 'Paid' : 'Unpaid', // Mixed status for dummy data
        paymentDate: Math.random() > 0.5 ? new Date().toISOString() : undefined,
        month,
        year,
        connections: []
      };
    }
    payoutsMap[shopName].count += 1;
    payoutsMap[shopName].commission += conn.retailerCommission;
    payoutsMap[shopName].connections.push(conn);
  });

  return Object.values(payoutsMap);
};

export const getProfitTrendData = (connections: Connection[], year: number) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return months.map((month, index) => {
    const summary = calculateMonthlySummary(connections, index, year);
    return {
      name: month,
      profit: summary.totalProfit,
      revenue: summary.totalRevenue,
      cost: summary.totalCompanyCost + summary.totalEngineerCommission + summary.totalRetailerCommission
    };
  });
};

export const getPackageProfitData = (connections: Connection[]) => {
  const packageData: Record<string, number> = {};
  
  connections.forEach(conn => {
    packageData[conn.package] = (packageData[conn.package] || 0) + conn.profit;
  });

  return Object.entries(packageData).map(([name, value]) => ({ name, value }));
};

export const getRetailerRevenueData = (connections: Connection[]) => {
  const retailerData: Record<string, number> = {};
  
  connections.forEach(conn => {
    if (conn.retailerShopName) {
      retailerData[conn.retailerShopName] = (retailerData[conn.retailerShopName] || 0) + 1500; // Customer Price
    }
  });

  return Object.entries(retailerData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5
};

export const getEngineerInstallTrend = (connections: Connection[]) => {
  const engineerData: Record<string, number> = {};
  
  connections.forEach(conn => {
    engineerData[conn.installerName] = (engineerData[conn.installerName] || 0) + 1;
  });

  return Object.entries(engineerData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};
