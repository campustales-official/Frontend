import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { GoogleLogin } from "@react-oauth/google";
import { login, googleLogin } from "../../api/auth.api";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { queryClient } from "../../lib/queryClient.js";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const navigate = useNavigate();

  // Email/Password login mutation
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      const role = res.data?.data?.roleInCollege;
      if (role) localStorage.setItem("roleInCollege", role);

      toast.success("Login successful! Redirecting...");
      queryClient.invalidateQueries(["me"]);
    },
    onError: (error) => {
      const message = error?.response?.data?.message;
      if (message === "user not found") {
        toast.error("User not found. Please sign up.");
        navigate("/signup");
        return;
      }
      toast.error(message || "Invalid email or password.");
    },
  });

  // Google login mutation
  const { mutate: mutateGoogle } = useMutation({
    mutationFn: googleLogin,
    onSuccess: (res) => {
      const role = res.data?.data?.roleInCollege;
      if (role) localStorage.setItem("roleInCollege", role);

      setIsGooglePending(false);
      toast.success("Google login successful! Redirecting...");
      queryClient.invalidateQueries(["me"]);
    },
    onError: (error) => {
      setIsGooglePending(false);
      if (error?.response?.status === 404) {
        toast.error("User not found. Please sign up.");
        navigate("/signup");
        return;
      }
      toast.error(error?.response?.data?.message || "Google login failed. Please try again.");
    },
  });

  const submit = (e) => {
    e.preventDefault();
    mutate(Object.fromEntries(new FormData(e.target)));
  };

  return (
    <form onSubmit={submit} className="space-y-6" autoComplete="off">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="mt-2 text-sm text-gray-500">Please enter your details to sign in.</p>
      </div>

      {/* Google Sign In - Full width wrapper */}
      <div className="w-full [&>div]:w-full [&>div>div]:w-full [&_iframe]:w-full">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            setIsGooglePending(true);
            mutateGoogle(credentialResponse.credential);
          }}
          onError={() => {
            toast.error("Google login failed. Please try again.");
          }}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="400"
        />
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-white text-gray-400">Or continue with email</span>
        </div>
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            name="email"
            type="email"
            required
            placeholder="alex@university.edu"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Enter your password"
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between text-sm">
        <Link to="/forgot-password" title="Forgot password?" className="text-blue-600 font-medium hover:underline">
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
