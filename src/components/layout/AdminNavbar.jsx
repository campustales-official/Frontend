import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import { User, LogOut, ChevronDown, Loader2, ShieldCheck } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { logout } from "../../api/auth.api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNavbar() {
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
            queryClient.clear();
            navigate("/login");
        }
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    const avatarUrl = me?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${me?.name}&backgroundColor=6366f1&fontFamily=Arial&fontSize=40`;

    return (
        <nav className="h-16 bg-white shadow-sm flex items-center justify-between px-6 fixed top-0 w-full z-50 border-b border-gray-100">
            {/* Left: Logo */}
            <Link to="/admin" className="flex items-center gap-2">
                <img src="/logo.png" alt="CampusTales Admin" className="w-9 h-9 object-contain rounded-xl" />
                <span className="font-bold text-xl text-gray-900">Admin Panel</span>
            </Link>

            {/* Right: Profile */}
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
                            <p className="text-sm font-bold text-gray-900 leading-tight">{me?.name || "Admin"}</p>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">Super Admin</p>
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
