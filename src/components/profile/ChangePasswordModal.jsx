import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { X, Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { changePassword } from "../../api/auth.api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function ChangePasswordModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const mutation = useMutation({
        mutationFn: changePassword,
        onSuccess: (res) => {
            toast.success(res?.data?.message || "Password changed successfully");
            onClose();
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to change password");
        }
    });

    const validatePassword = (password) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        return checks;
    };

    const passwordChecks = validatePassword(formData.newPassword);
    const isPasswordStrong = Object.values(passwordChecks).every(Boolean);
    const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword !== "";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isPasswordStrong) {
            toast.error("Please create a stronger password");
            return;
        }
        if (!passwordsMatch) {
            toast.error("Passwords do not match");
            return;
        }
        mutation.mutate(formData);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 rounded-xl">
                                <Lock className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? "text" : "password"}
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all pr-12"
                                    placeholder="Enter current password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all pr-12"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicators */}
                            {formData.newPassword && (
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                    <PasswordCheck label="8+ characters" passed={passwordChecks.length} />
                                    <PasswordCheck label="Uppercase" passed={passwordChecks.uppercase} />
                                    <PasswordCheck label="Lowercase" passed={passwordChecks.lowercase} />
                                    <PasswordCheck label="Number" passed={passwordChecks.number} />
                                    <PasswordCheck label="Special char" passed={passwordChecks.special} />
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all pr-12 ${formData.confirmPassword
                                            ? passwordsMatch
                                                ? "border-green-500 focus:ring-green-500/20 focus:border-green-500"
                                                : "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                                            : "border-gray-200 focus:ring-purple-500/20 focus:border-purple-500"
                                        }`}
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.confirmPassword && !passwordsMatch && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Passwords do not match
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isPasswordStrong || !passwordsMatch || mutation.isPending}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {mutation.isPending ? "Changing Password..." : "Change Password"}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function PasswordCheck({ label, passed }) {
    return (
        <div className={`flex items-center gap-1.5 text-xs font-medium ${passed ? "text-green-600" : "text-gray-400"}`}>
            {passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
            {label}
        </div>
    );
}
