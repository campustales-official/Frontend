import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  sendVerifyEmailOtp,
  confirmVerifyEmailOtp,
} from "../../api/verifyEmail.api";
import { useMe } from "../../hooks/useMe";

export default function VerifyEmailOtpPage() {
  const { data: me } = useMe();
  const queryClient = useQueryClient();

  const loginImage = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop";

  const email = me?.email;

  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  /* ---------- Send OTP ---------- */
  const sendOtpMutation = useMutation({
    mutationFn: () => sendVerifyEmailOtp(email),
    onSuccess: () => {
      toast.success("Verification code sent to your email");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to send verification code"
      );
    },
  });

  /* ---------- Confirm OTP ---------- */
  const confirmOtpMutation = useMutation({
    mutationFn: () =>
      confirmVerifyEmailOtp({
        email,
        otp: otp.join(""),
      }),
    onSuccess: () => {
      toast.success("Email verified successfully");
      queryClient.invalidateQueries(["me"]);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Invalid or expired code"
      );
    },
  });

  /* ---------- OTP input logic ---------- */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((d) => d !== "");

const hasSentRef = useRef(false);

useEffect(() => {
  if (!email) return;

  if (!hasSentRef.current) {
    sendOtpMutation.mutate();
    hasSentRef.current = true;
  }
}, [email]);


  return (
    <div className="min-h-screen w-full bg-white relative">
      <div className="flex min-h-screen">

        {/* LEFT — FORM */}
        <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-6 sm:px-12 py-10">
          <div className="w-full max-w-sm space-y-6">

            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xl">✉️</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-semibold">Verify Your Email</h1>
              <p className="text-sm text-gray-500 mt-1">
                We’ve sent a 6-digit verification code to{" "}
                <span className="font-medium text-gray-700">{email}</span>
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex gap-2 justify-between">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <p className="text-xs text-gray-400">Valid for 10 minutes</p>

            {/* Verify button */}
            <button
              disabled={!isOtpComplete || confirmOtpMutation.isPending}
              onClick={() => confirmOtpMutation.mutate()}
              className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {confirmOtpMutation.isPending ? "Verifying..." : "Verify Email"}
            </button>

            {/* Resend */}
            <p className="text-sm text-gray-500 text-center">
              Didn’t receive the code?{" "}
              <button
                onClick={() => sendOtpMutation.mutate()}
                disabled={sendOtpMutation.isPending}
                className="text-blue-600 hover:underline disabled:opacity-50"
              >
                Resend code
              </button>
            </p>

            {/* Footer */}
            <div className="text-xs text-gray-400 flex gap-4 justify-center pt-6">
              <span>Help Center</span>
              <span>Support</span>
              <span>Security Policy</span>
            </div>
          </div>
        </div>

        {/* RIGHT — IMAGE (desktop only) */}
        <div className="hidden lg:flex w-1/2 fixed top-0 right-0 h-full">
          <img
            src={loginImage}
            alt="Campus"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute bottom-10 left-10 right-10 z-10 text-white max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-semibold tracking-tight">CollegeConnect</span>
            </div>

            <h2 className="text-lg font-semibold mb-2">Secure Community</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Secure and direct communication is at the heart of our community.
              Verify your identity to start building your professional network.
            </p>

            <p className="text-xs text-gray-400 mt-4">
              Protected by Advanced Security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
