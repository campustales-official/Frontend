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

function GuardedRoutes() {
  const location = useLocation();
  const { data: me, isLoading, isError } = useMe();

  if (isLoading) return null;

  const isLoggedIn = !isError && !!me;
  const path = location.pathname;

  // 🔐 Not logged in
  if (!isLoggedIn) {
    // Allow access to login/signup only
    if (path === "/login" || path === "/signup") {
      return (
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
        </Routes>
      );
    }
    // Redirect everything else to login
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in - redirect away from auth pages
  if (path === "/login" || path === "/signup") {
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
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/verify-email" element={<VerifyEmailOtpPage />} />
      <Route path="/" element={<div>APP HOME</div>} />
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
