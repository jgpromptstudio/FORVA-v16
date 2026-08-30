import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { DealsPage } from '@/pages/dashboard/DealsPage';
import { NotificationsPage } from '@/pages/dashboard/NotificationsPage';
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

function UserRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
  return <AdminRoute>{children}</AdminRoute>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MarketingPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/acceptable-use" element={<AcceptableUsePage />} />
          <Route path="/billing" element={<LegalBillingPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/responsible-outreach" element={<ResponsibleOutreachPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><SignupPage /></AuthRoute>} />
          <Route path="/forgot-password" element={<AuthRoute><ForgotPasswordPage /></AuthRoute>} />
          <Route path="/update-password" element={<AuthRoute><UpdatePasswordPage /></AuthRoute>} />

          <Route path="/dashboard" element={<UserRoute><OverviewPage /></UserRoute>} />
          <Route path="/dashboard/find-clients" element={<UserRoute><FindClientsPage /></UserRoute>} />
          <Route path="/dashboard/prospects" element={<UserRoute><ProspectsPage /></UserRoute>} />
          <Route path="/dashboard/reviews" element={<UserRoute><ReviewsPage /></UserRoute>} />
          <Route path="/dashboard/outreach" element={<UserRoute><OutreachPage /></UserRoute>} />
          <Route path="/dashboard/conversations" element={<UserRoute><ConversationsPage /></UserRoute>} />
          <Route path="/dashboard/followups" element={<UserRoute><FollowupsPage /></UserRoute>} />
          <Route path="/dashboard/deals" element={<UserRoute><DealsPage /></UserRoute>} />
          <Route path="/dashboard/notifications" element={<UserRoute><NotificationsPage /></UserRoute>} />
          <Route path="/dashboard/billing" element={<UserRoute><BillingPage /></UserRoute>} />
          <Route path="/dashboard/settings" element={<UserRoute><SettingsPage /></UserRoute>} />
          <Route path="/dashboard/support" element={<UserRoute><SupportPage /></UserRoute>} />

          <Route path="/admin" element={<AdminOnlyRoute><AdminOverviewPage /></AdminOnlyRoute>} />
          <Route path="/admin/analytics" element={<AdminOnlyRoute><AdminAnalyticsPage /></AdminOnlyRoute>} />
          <Route path="/admin/users" element={<AdminOnlyRoute><AdminUsersPage /></AdminOnlyRoute>} />
          <Route path="/admin/workspaces" element={<AdminOnlyRoute><AdminWorkspacesPage /></AdminOnlyRoute>} />
          <Route path="/admin/runs" element={<AdminOnlyRoute><AdminRunsPage /></AdminOnlyRoute>} />
          <Route path="/admin/prospects" element={<AdminOnlyRoute><AdminProspectsPage /></AdminOnlyRoute>} />
          <Route path="/admin/outreach" element={<AdminOnlyRoute><AdminOutreachPage /></AdminOnlyRoute>} />
          <Route path="/admin/conversations" element={<AdminOnlyRoute><AdminConversationsPage /></AdminOnlyRoute>} />
          <Route path="/admin/followups" element={<AdminOnlyRoute><AdminFollowupsPage /></AdminOnlyRoute>} />
          <Route path="/admin/reviews" element={<AdminOnlyRoute><AdminReviewsPage /></AdminOnlyRoute>} />
          <Route path="/admin/billing" element={<AdminOnlyRoute><AdminBillingPage /></AdminOnlyRoute>} />
          <Route path="/admin/system" element={<AdminOnlyRoute><AdminSystemPage /></AdminOnlyRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
