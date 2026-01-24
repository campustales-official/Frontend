import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerSuperadmin } from "../../api/admin.api";
import AdminNavbar from "../../components/layout/AdminNavbar";
import {
    UserPlus,
    Mail,
    Lock,
    User,
    ShieldCheck,
    Loader2,
    ArrowRight,
    AtSign,
    CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegisterSuperadmin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const mutation = useMutation({
        mutationFn: registerSuperadmin,
        onSuccess: () => {
            toast.success("SuperAdmin registered successfully!");
            navigate("/admin");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to register SuperAdmin");
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        mutation.mutate({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-8">
            <AdminNavbar />

            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-purple-600 p-8 md:p-10 text-white relative overflow-hidden text-center">
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                <UserPlus className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-black mb-1">Add SuperAdmin</h1>
                            <p className="text-purple-100 text-sm font-medium">Grant full platform control to a trusted user.</p>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <ShieldCheck className="w-64 h-64 -ml-16 -mt-16 absolute" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Alexander Pierce"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative group">
                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="admin@hub.com"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Confirm Password</label>
                            <div className="relative group">
                                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full mt-4 px-8 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-purple-100 flex items-center justify-center gap-3 active:scale-95"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Assign Permission
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
