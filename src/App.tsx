/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddConnection } from './pages/AddConnection';
import { AllConnections } from './pages/AllConnections';
import { Engineers } from './pages/Engineers';
import { Retailers } from './pages/Retailers';
import { Reports } from './pages/Reports';
import { CommissionSettingsPage } from './pages/CommissionSettings';
import { MonthlySettlements } from './pages/MonthlySettlements';
import { EngineerPayouts } from './pages/EngineerPayouts';
import { RetailerPayouts } from './pages/RetailerPayouts';
import { ProfitReport } from './pages/ProfitReport';
import { PaymentHistory } from './pages/PaymentHistory';
import { CableStock } from './pages/inventory/CableStock';
import { EngineerAllocation } from './pages/inventory/EngineerAllocation';
import { CableUsageReport } from './pages/inventory/CableUsageReport';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/add-connection" element={<AddConnection />} />
                    <Route path="/all-connections" element={<AllConnections />} />
                    <Route path="/engineers" element={<Engineers />} />
                    <Route path="/retailers" element={<Retailers />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<CommissionSettingsPage />} />
                    <Route path="/finance/settlements" element={<MonthlySettlements />} />
                    <Route path="/finance/engineer-payouts" element={<EngineerPayouts />} />
                    <Route path="/finance/retailer-payouts" element={<RetailerPayouts />} />
                    <Route path="/finance/payment-history" element={<PaymentHistory />} />
                    <Route path="/finance/profit-report" element={<ProfitReport />} />
                    <Route path="/inventory/cable-stock" element={<CableStock />} />
                    <Route path="/inventory/cable-allocation" element={<EngineerAllocation />} />
                    <Route path="/inventory/usage-report" element={<CableUsageReport />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
