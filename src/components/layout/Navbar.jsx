import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import { User, Bell, LogOut, ChevronDown, Loader2 } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { logout } from "../../api/auth.api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { data: me } = useMe();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.clear();
            toast.success("Logged out successfully");
            navigate("/login");
        },
        onError: () => {
            // Even if API fails, clear local state and redirect
            queryClient.clear();
            navigate("/login");
        }
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    // Gender neutral avatar using initials
    const avatarUrl = me?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${me?.name}&backgroundColor=6366f1&fontFamily=Arial&fontSize=40`;

    return (
        <nav className="h-16 bg-white shadow-sm flex items-center justify-between px-4 fixed top-0 w-full z-50 border-b border-gray-100">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10v6" /><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12Z" /><path d="M6 15v-6" /></svg>
                </div>
                <span className="font-bold text-xl text-gray-900 block">Inter-College Hub</span>
            </Link>

            {/* Right: Profile & Notifications */}
            <div className="flex items-center gap-4">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 md:gap-3 hover:bg-gray-50 p-1 rounded-xl transition-all"
                    >
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 text-indigo-600 font-bold overflow-hidden">
                            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-bold text-gray-900 leading-tight">{me?.name || "User"}</p>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight truncate max-w-[120px]">
                                {me?.college?.name}
                            </p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 p-1"
                            >
                                <div className="px-3 py-2 border-b border-gray-50 md:hidden">
                                    <p className="text-sm font-bold text-gray-900">{me?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{me?.college?.name}</p>
                                </div>
                                <Link
                                    to="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
                                >
                                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    My Profile
                                </Link>
                                <div className="h-px bg-gray-50 my-1 mx-2" />
                                <button
                                    onClick={handleLogout}
                                    disabled={logoutMutation.isPending}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors group disabled:opacity-50"
                                >
                                    <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                        {logoutMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 text-red-600" />}
                                    </div>
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
}
