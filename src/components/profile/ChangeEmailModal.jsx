import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { X, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { changeEmail } from "../../api/auth.api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function ChangeEmailModal({ isOpen, onClose, currentEmail }) {
    const [formData, setFormData] = useState({
        newEmail: "",
        currentPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const mutation = useMutation({
        mutationFn: changeEmail,
        onSuccess: (res) => {
            toast.success(res?.data?.message || "Email change request submitted. Please verify your new email.");
            onClose();
            setFormData({ newEmail: "", currentPassword: "" });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to change email");
        }
    });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isEmailValid = validateEmail(formData.newEmail);
    const isEmailDifferent = formData.newEmail.toLowerCase() !== currentEmail?.toLowerCase();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isEmailValid) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (!isEmailDifferent) {
            toast.error("New email must be different from current email");
            return;
        }
        if (!formData.currentPassword) {
            toast.error("Please enter your current password");
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
                            <div className="p-2 bg-blue-50 rounded-xl">
                                <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Change Email</h2>
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
                        {/* Current Email (Read Only) */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Current Email</label>
                            <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-sm">
                                {currentEmail}
                            </div>
                        </div>

                        {/* New Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">New Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={formData.newEmail}
                                    onChange={(e) => setFormData(prev => ({ ...prev, newEmail: e.target.value }))}
                                    className={`w-full px-4 py-3 pl-11 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formData.newEmail
                                            ? isEmailValid && isEmailDifferent
                                                ? "border-green-500 focus:ring-green-500/20 focus:border-green-500"
                                                : "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                                            : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                                        }`}
                                    placeholder="Enter new email address"
                                    required
                                />
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            </div>
                            {formData.newEmail && !isEmailValid && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Please enter a valid email address
                                </p>
                            )}
                            {formData.newEmail && isEmailValid && !isEmailDifferent && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> New email must be different from current
                                </p>
                            )}
                        </div>

                        {/* Current Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Current Password</label>
                            <p className="text-xs text-gray-500">Required to confirm this change</p>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12"
                                    placeholder="Enter your password"
                                    required
                                />
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isEmailValid || !isEmailDifferent || !formData.currentPassword || mutation.isPending}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {mutation.isPending ? "Updating Email..." : "Change Email"}
                        </button>

                        <p className="text-xs text-gray-500 text-center">
                            A verification link will be sent to your new email address.
                        </p>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
