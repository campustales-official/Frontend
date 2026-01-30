import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "../../api/admin.api";
import AdminNavbar from "../../components/layout/AdminNavbar";
import {
    Users,
    School,
    Calendar,
    MessageSquare,
    Trophy,
    Megaphone,
    ArrowRight,
    PlusCircle,
    UserPlus,
    Loader2,
    ShieldAlert,
    Search
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminPanel() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: fetchStats,
        refetchInterval: 30000,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading Admin Insights...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center max-w-md">
                    <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-red-900 mb-2">Failed to load statistics</h2>
                    <p className="text-red-700 mb-4">{error?.response?.data?.message || "An unexpected error occurred while fetching system data."}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { overview, documents } = data.data;

    const statsConfig = [
        { label: "Colleges", value: overview.colleges, icon: School, color: "bg-blue-500 shadow-blue-200" },
        { label: "Users", value: overview.users, icon: Users, color: "bg-indigo-500 shadow-indigo-200" },
        { label: "Clubs", value: overview.clubs, icon: Trophy, color: "bg-purple-500 shadow-purple-200" },
        { label: "Events", value: overview.events, icon: Calendar, color: "bg-pink-500 shadow-pink-200" },
        { label: "Posts", value: overview.posts, icon: MessageSquare, color: "bg-teal-500 shadow-teal-200" },
    ];

    const detailedStats = [
        {
            label: "Documents", items: [
                { name: "Certificates", count: documents.certificates },
                { name: "Templates", count: documents.certificateTemplates },
                { name: "Audit Logs", count: documents.auditLogs },
                { name: "Registrations", count: documents.registrations },
                { name: "Announcements", count: documents.announcements },
            ]
        },
        {
            label: "Memberships", items: [
                { name: "College", count: documents.collegeMemberships },
                { name: "Club", count: documents.clubMemberships },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-8">
            <AdminNavbar />

            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Platform Overview</h1>
                    <p className="text-gray-500">Real-time statistics and administrative actions for the CampusTales.</p>
                </header>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <Link to="/admin/register-college" className="group p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                <PlusCircle className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Register College</h3>
                                <p className="text-xs text-gray-500">Add a new institution to platform</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                    </Link>

                    <Link to="/admin/register-superadmin" className="group p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-50 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                                <UserPlus className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Add SuperAdmin</h3>
                                <p className="text-xs text-gray-500">Grant administrator permissions</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-all" />
                    </Link>

                    <Link to="/admin/announcements" className="group p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-50 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                                <Megaphone className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Announcements</h3>
                                <p className="text-xs text-gray-500">Manage platform-wide notices</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all" />
                    </Link>

                    <Link to="/admin/user-search" className="group p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                <Search className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Search User</h3>
                                <p className="text-xs text-gray-500">View detailed user intelligence</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>

                {/* Primary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
                    {statsConfig.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                        >
                            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h2>
                        </motion.div>
                    ))}
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {detailedStats.map((section) => (
                        <div key={section.label} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                                {section.label}
                            </h3>
                            <div className="space-y-4">
                                {section.items.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 group transition-colors">
                                        <span className="text-gray-600 font-bold group-hover:text-indigo-700 transition-colors">{item.name}</span>
                                        <span className="bg-white px-4 py-1.5 rounded-xl text-indigo-600 font-black shadow-sm group-hover:scale-105 transition-transform">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
