import { useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import AuthLayout from "./AuthLayout";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthPage() {
  const { pathname } = useLocation();
  const isSignup = pathname === "/signup";

  return (
    <AuthLayout isSignup={isSignup}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: isSignup ? -40 : 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isSignup ? 40 : -40 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isSignup ? <SignupForm /> : <LoginForm />}

          {/* Toggle Link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-medium hover:underline">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                  Sign up
                </Link>
              </>
            )}
          </p>

          {/* Footer Links */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
            <Link to="/terms-conditions" className="hover:text-gray-600">Terms of Service</Link>
            <Link to="/privacy-policy" className="hover:text-gray-600">Privacy Policy</Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </AuthLayout>
  );
}
