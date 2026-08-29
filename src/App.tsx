import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';
import { AuthRoute } from '@/components/AuthRoute';
import { MarketingPage } from '@/pages/MarketingPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { UpdatePasswordPage } from '@/pages/UpdatePasswordPage';
import { PrivacyPage } from '@/pages/legal/PrivacyPage';
import { TermsPage } from '@/pages/legal/TermsPage';
import { AcceptableUsePage } from '@/pages/legal/AcceptableUsePage';
import { BillingPage as LegalBillingPage } from '@/pages/legal/BillingPage';
import { CookiesPage } from '@/pages/legal/CookiesPage';
import { ResponsibleOutreachPage } from '@/pages/legal/ResponsibleOutreachPage';
import { SecurityPage } from '@/pages/legal/SecurityPage';
import { ContactPage } from '@/pages/legal/ContactPage';
import { OverviewPage } from '@/pages/dashboard/OverviewPage';
import { FindClientsPage } from '@/pages/dashboard/FindClientsPage';
import { ProspectsPage } from '@/pages/dashboard/ProspectsPage';
import { OutreachPage } from '@/pages/dashboard/OutreachPage';
import { ConversationsPage } from '@/pages/dashboard/ConversationsPage';
import { FollowupsPage } from '@/pages/dashboard/FollowupsPage';
import { ReviewsPage } from '@/pages/dashboard/ReviewsPage';
import { BillingPage } from '@/pages/dashboard/BillingPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import { SupportPage } from '@/pages/dashboard/SupportPage';
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminWorkspacesPage } from '@/pages/admin/AdminWorkspacesPage';
import { AdminRunsPage } from '@/pages/admin/AdminRunsPage';
import { AdminProspectsPage } from '@/pages/admin/AdminProspectsPage';
import { AdminOutreachPage } from '@/pages/admin/AdminOutreachPage';
import { AdminConversationsPage } from '@/pages/admin/AdminConversationsPage';
import { AdminFollowupsPage } from '@/pages/admin/AdminFollowupsPage';
import { AdminReviewsPage } from '@/pages/admin/AdminReviewsPage';
import { AdminBillingPage } from '@/pages/admin/AdminBillingPage';
import { AdminSystemPage } from '@/pages/admin/AdminSystemPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MarketingPage />} />

          {/* Public legal/trust pages */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/acceptable-use" element={<AcceptableUsePage />} />
          <Route path="/billing" element={<LegalBillingPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/responsible-outreach" element={<ResponsibleOutreachPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <SignupPage />
              </AuthRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthRoute>
                <ForgotPasswordPage />
              </AuthRoute>
            }
          />
          <Route
            path="/update-password"
            element={
              <AuthRoute>
                <UpdatePasswordPage />
              </AuthRoute>
            }
          />

          {/* User dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <OverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/find-clients"
            element={
              <ProtectedRoute>
                <FindClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/prospects"
            element={
              <ProtectedRoute>
                <ProspectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/outreach"
            element={
              <ProtectedRoute>
                <OutreachPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/conversations"
            element={
              <ProtectedRoute>
                <ConversationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/followups"
            element={
              <ProtectedRoute>
                <FollowupsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reviews"
            element={
              <ProtectedRoute>
                <ReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/billing"
            element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/support"
            element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin dashboard routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminOverviewPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AdminAnalyticsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/workspaces"
            element={
              <AdminRoute>
                <AdminWorkspacesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/runs"
            element={
              <AdminRoute>
                <AdminRunsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/prospects"
            element={
              <AdminRoute>
                <AdminProspectsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/outreach"
            element={
              <AdminRoute>
                <AdminOutreachPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/conversations"
            element={
              <AdminRoute>
                <AdminConversationsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/followups"
            element={
              <AdminRoute>
                <AdminFollowupsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <AdminRoute>
                <AdminReviewsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/billing"
            element={
              <AdminRoute>
                <AdminBillingPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/system"
            element={
              <AdminRoute>
                <AdminSystemPage />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
