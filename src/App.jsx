import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useMe } from "./hooks/useMe";

import AuthPage from "./pages/Auth/AuthPage";
import VerifyEmailOtpPage from "./pages/Auth/VerifyEmailOtpPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import FeedPage from "./pages/Feed/FeedPage";
import AnnouncementsPage from "./pages/Feed/AnnouncementsPage";
import ClubsPage from "./pages/Clubs/ClubsPage";
import CollegeDashboard from "./pages/College/CollegeDashboard";
import ClubDetailsPage from "./pages/Clubs/ClubDetailsPage";
import ClubMembersPage from "./pages/Clubs/ClubMembersPage";
import EditClubPage from "./pages/Clubs/EditClubPage";
import RegisterClubPage from "./pages/Clubs/RegisterClubPage";
import ProfilePage from "./pages/Auth/ProfilePage";
import DashboardLayout from "./layouts/DashboardLayout";

// Events
import EventsPage from "./pages/Events/EventsPage";
import CreateEventPage from "./pages/Events/CreateEventPage";
import UpdateEventPage from "./pages/Events/UpdateEventPage";
import EventManagementPage from "./pages/Events/EventManagementPage";
import EventDetailsPage from "./pages/Events/EventDetailsPage";
import EventRegistrationPage from "./pages/Events/EventRegistrationPage";
import RegistrationDetailPage from "./pages/Events/RegistrationDetailPage";
import MyRegistrationPage from "./pages/Events/MyRegistrationPage";
import EventRegistrationsLivePage from "./pages/Events/EventRegistrationsLivePage";
import CertificateTemplatePage from "./pages/Events/CertificateTemplatePage";

function GuardedRoutes() {
  const location = useLocation();
  const { data: me, isLoading, isError } = useMe();

  if (isLoading) return null;

  const isLoggedIn = !isError && !!me;
  const path = location.pathname;

  // 🔐 Not logged in
  if (!isLoggedIn) {
    // Allow access to login/signup/forgot-password only
    const publicPaths = ["/login", "/signup", "/forgot-password"];
    if (publicPaths.includes(path)) {
      return (
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      );
    }
    // Redirect everything else to login
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in - redirect away from public auth pages
  const publicAuthPaths = ["/login", "/signup", "/forgot-password"];
  if (publicAuthPaths.includes(path)) {
    return <Navigate to="/" replace />;
  }

  // 📧 Logged in but not verified
  if (!me.isEmailVerified) {
    if (path !== "/verify-email") {
      return <Navigate to="/verify-email" replace />;
    }
  }

  // ✅ Logged in AND verified — leave verify page
  if (me.isEmailVerified && path === "/verify-email") {
    return <Navigate to="/" replace />;
  }


  return (
    <Routes>
      {/* 
          Note: These routes are technically already handled by the logic above,
          but we include them here for completeness and to handle nested routing structures if needed.
      */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailOtpPage />} />

      {/* Dashboard Routes */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<FeedPage scope="global" collegeId={me.college.id} />} />
        <Route path="announcements" element={<AnnouncementsPage scope="college" collegeId={me.college.id} />} />
        <Route path="college" element={<CollegeDashboard />} />
        <Route path="clubs" element={<ClubsPage collegeId={me.college.id} />} />
        <Route path="clubs/register" element={<RegisterClubPage />} />
        <Route path="club/:clubId" element={<ClubDetailsPage />} />
        <Route path="club/:clubId/members" element={<ClubMembersPage />} />
        <Route path="club/:clubId/edit" element={<EditClubPage />} />
        <Route path="profile" element={<ProfilePage />} />

        <Route path="events" element={<EventsPage />} />
        <Route path="events/:eventId" element={<EventDetailsPage />} />
        <Route path="events/:eventId/register" element={<EventRegistrationPage />} />

        {/* Event Management */}
        <Route path="events/create" element={<CreateEventPage />} />
        <Route path="club/:clubId/events/create" element={<CreateEventPage />} />
        <Route path="events/:eventId/edit" element={<UpdateEventPage />} />
        <Route path="events/:eventId/manage" element={<EventManagementPage />} />
        <Route path="events/:eventId/registrations/:registrationId" element={<RegistrationDetailPage />} />
        <Route path="my-registrations/:registrationId" element={<MyRegistrationPage />} />
        <Route path="events/:eventId/registrations/live" element={<EventRegistrationsLivePage />} />
        <Route path="events/:eventId/certificate-template" element={<CertificateTemplatePage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GuardedRoutes />
    </BrowserRouter>
  );
}
