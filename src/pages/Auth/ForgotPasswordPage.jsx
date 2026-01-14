import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    requestForgotPasswordOtp,
    verifyForgotPasswordOtp,
    resetPassword,
} from "../../api/auth.api";
import { ArrowLeft, Mail, Lock, Key, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

const STEPS = {
    REQUEST: "REQUEST",
    VERIFY: "VERIFY",
    RESET: "RESET",
};

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(STEPS.REQUEST);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const inputsRef = useRef([]);
    const loginImage = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop";

    /* ---------- Step 1: Request OTP ---------- */
    const requestOtpMutation = useMutation({
        mutationFn: () => requestForgotPasswordOtp(email),
        onSuccess: () => {
            toast.success("Password reset code sent to your email");
            setStep(STEPS.VERIFY);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to send reset code");
        },
    });

    /* ---------- Step 2: Verify OTP ---------- */
    const verifyOtpMutation = useMutation({
        mutationFn: () => verifyForgotPasswordOtp(email, otp.join("")),
        onSuccess: (res) => {
            toast.success("Code verified successfully");
            setResetToken(res.data.resetToken);
            setStep(STEPS.RESET);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Invalid or expired code");
        },
    });

    /* ---------- Step 3: Reset Password ---------- */
    const resetPasswordMutation = useMutation({
        mutationFn: () => {
            resetPassword(email, resetToken, newPassword)},
        onSuccess: () => {
            toast.success("Password reset successful. Please login with your new password.");
            navigate("/login");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to reset password");
        },
    });

    /* ---------- OTP Input Logic ---------- */
    const handleOtpChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const next = [...otp];
        next[index] = value;
        setOtp(next);
        if (value && index < 5) inputsRef.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const isOtpComplete = otp.every((d) => d !== "");

    /* ---------- Render Helpers ---------- */
    const renderLeftContent = () => {
        switch (step) {
            case STEPS.REQUEST:
                return (
                    <div className="w-full max-w-sm space-y-6">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                Enter the email address associated with your account and we'll send you a 6-digit code to reset your password.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="alex@university.edu"
                                    />
                                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                            </div>
                            <button
                                disabled={!email || requestOtpMutation.isPending}
                                onClick={() => requestOtpMutation.mutate()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {requestOtpMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Send OTP
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full text-gray-500 text-sm font-medium flex items-center justify-center gap-2 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Login
                            </button>
                        </div>
                    </div>
                );

            case STEPS.VERIFY:
                return (
                    <div className="w-full max-w-sm space-y-6">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Key className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Verification Code</h1>
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                We’ve sent a 6-digit verification code to <span className="font-semibold text-gray-900">{email}</span>
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-2 justify-between">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => (inputsRef.current[i] = el)}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value, i)}
                                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                                        maxLength={1}
                                        className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                ))}
                            </div>
                            <button
                                disabled={!isOtpComplete || verifyOtpMutation.isPending}
                                onClick={() => verifyOtpMutation.mutate()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {verifyOtpMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Verify Code
                            </button>
                            <div className="text-center">
                                <button
                                    onClick={() => requestOtpMutation.mutate()}
                                    disabled={requestOtpMutation.isPending}
                                    className="text-sm text-blue-600 font-semibold hover:underline disabled:opacity-50"
                                >
                                    Resend Code
                                </button>
                            </div>
                            <button
                                onClick={() => setStep(STEPS.REQUEST)}
                                className="w-full text-gray-500 text-sm font-medium flex items-center justify-center gap-2 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Change Email
                            </button>
                        </div>
                    </div>
                );

            case STEPS.RESET:
                return (
                    <div className="w-full max-w-sm space-y-6">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create New Password</h1>
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                Your new password must be unique. Choose a strong password to keep your account safe.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                            </div>

                            {newPassword && confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
                            )}

                            <button
                                disabled={!newPassword || newPassword !== confirmPassword || resetPasswordMutation.isPending}
                                onClick={() => resetPasswordMutation.mutate()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {resetPasswordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Update Password
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full text-gray-500 text-sm font-medium flex items-center justify-center gap-2 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Login
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen w-full bg-white relative">
            <div className="flex min-h-screen">
                {/* LEFT — CONTENT */}
                <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-6 sm:px-12 py-10 overflow-y-auto">
                    {renderLeftContent()}
                </div>

                {/* RIGHT — IMAGE (desktop only) */}
                <div className="hidden lg:flex w-1/2 fixed top-0 right-0 h-full">
                    <img src={loginImage} alt="Campus" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute bottom-10 left-10 right-10 z-10 text-white max-w-md">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">CollegeConnect</span>
                        </div>

                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/20 text-blue-200 text-xs font-semibold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Account Recovery</span>
                            </div>
                            <blockquote className="space-y-2">
                                <p className="text-xl font-medium leading-relaxed italic text-gray-100">
                                    {step === STEPS.RESET
                                        ? "\"Protecting your digital identity is the first step towards a secure academic career. Keep your account safe.\""
                                        : "\"Don't worry, account recovery is simple and secure. Get back to collaborating with your peers in just a few steps.\""}
                                </p>
                            </blockquote>
                            <div className="flex items-center gap-2 text-gray-400 pt-4 border-t border-white/10">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-medium uppercase tracking-wider">Protected by Advanced Security</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
