import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { useAuth } from './context/AuthContext';

// Marketing Pages
import { HomePage } from './pages/marketing/HomePage';
import { ProductsPage } from './pages/marketing/ProductsPage';
import { ProductDetailPage } from './pages/marketing/ProductDetailPage';
import { SolutionsPage } from './pages/marketing/SolutionsPage';
import { IndustriesPage } from './pages/marketing/IndustriesPage';
import { ResourcesPage } from './pages/marketing/ResourcesPage';
import { DocsStubPage } from './pages/marketing/DocsStubPage';
import { PartnersPage } from './pages/marketing/PartnersPage';
import { CompanyPage } from './pages/marketing/CompanyPage';
import { GetStartedPage } from './pages/marketing/GetStartedPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Portal Components & Pages
import { PortalLayout } from './components/portal/PortalLayout';
import { PortalDashboardPage } from './pages/portal/PortalDashboardPage';
import { MyProductsPage } from './pages/portal/MyProductsPage';
import { LicensesPage } from './pages/portal/LicensesPage';
import { DownloadsPage } from './pages/portal/DownloadsPage';
import { TrialsPage } from './pages/portal/TrialsPage';
import { InstallationsPage } from './pages/portal/InstallationsPage';
import { RenewalsPage } from './pages/portal/RenewalsPage';
import { SupportPage } from './pages/portal/SupportPage';
import { UsersRolesPage } from './pages/portal/UsersRolesPage';
import { AuditHistoryPage } from './pages/portal/AuditHistoryPage';

// Admin Components & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrganizationsPage } from './pages/admin/AdminOrganizationsPage';
import { AdminCatalogPage } from './pages/admin/AdminCatalogPage';
import { AdminSubscriptionsPage } from './pages/admin/AdminSubscriptionsPage';
import { AdminLicensesPage } from './pages/admin/AdminLicensesPage';
import { AdminTrialsPage } from './pages/admin/AdminTrialsPage';
import { AdminReleasesPage } from './pages/admin/AdminReleasesPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';

// Protected Route Guards
const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-gts-navy text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gts-orange animate-ping" />
          Loading GTS KavachIQ Workspace...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const RequireAdmin = ({ children }) => {
  const { user, isInternalAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-gts-navy text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gts-purple animate-ping" />
          Verifying Administrative Privileges...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isInternalAdmin) {
    return <Navigate to="/portal" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Public Marketing Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/documentation" element={<DocsStubPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Customer Portal Routes */}
          <Route
            path="/portal"
            element={
              <RequireAuth>
                <PortalLayout />
              </RequireAuth>
            }
          >
            <Route index element={<PortalDashboardPage />} />
            <Route path="products" element={<MyProductsPage />} />
            <Route path="licenses" element={<LicensesPage />} />
            <Route path="downloads" element={<DownloadsPage />} />
            <Route path="trials" element={<TrialsPage />} />
            <Route path="installations" element={<InstallationsPage />} />
            <Route path="renewals" element={<RenewalsPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="users" element={<UsersRolesPage />} />
            <Route path="audit" element={<AuditHistoryPage />} />
          </Route>

          {/* Authenticated Internal Admin Routes */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="organizations" element={<AdminOrganizationsPage />} />
            <Route path="catalog" element={<AdminCatalogPage />} />
            <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
            <Route path="licenses" element={<AdminLicensesPage />} />
            <Route path="trials" element={<AdminTrialsPage />} />
            <Route path="releases" element={<AdminReleasesPage />} />
            <Route path="audit" element={<AdminAuditLogsPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};
export default App;
