import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUserByEmail } from "../../api/admin.api";
import AdminNavbar from "../../components/layout/AdminNavbar";
import {
    Search,
    User,
    Mail,
    Shield,
    Calendar,
    Building2,
    GraduationCap,
    Trophy,
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowRight,
    MapPin,
    Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function DataSection({ title, data, icon, iconColor }) {
    if (!data) return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className={`w-10 h-10 ${iconColor} rounded-2xl flex items-center justify-center`}>
                    {icon}
                </div>
                {title}
            </h3>
            <div className="py-12 text-center">
                <p className="text-gray-400 font-bold">No data record found.</p>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className={`w-10 h-10 ${iconColor} rounded-2xl flex items-center justify-center`}>
                    {icon}
                </div>
                {title}
            </h3>

            <div className="space-y-3">
                {Object.entries(data).map(([key, value]) => {
                    // Skip nested objects for club/college previews, we'll show them as strings or handle them specifically if needed
                    // But user said "show all data", so let's handle primitives mainly
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        return (
                            <div key={key} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{key}</p>
                                <div className="space-y-2 pl-2 border-l-2 border-indigo-100">
                                    {Object.entries(value).map(([subKey, subVal]) => (
                                        <div key={subKey}>
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase">{subKey}</p>
                                            <p className="text-sm font-mono text-gray-900 break-all">{String(subVal)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    if (Array.isArray(value)) return null; // Handle arrays (like clubMemberships) separately

                    return (
                        <div key={key} className="flex flex-col p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{key}</span>
                            <span className="text-sm font-mono text-gray-900 break-all">{String(value)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function UserSearch() {
    const [email, setEmail] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["user-search", searchQuery],
        queryFn: () => searchUserByEmail(searchQuery),
        enabled: !!searchQuery,
        retry: false
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(email);
    };

    const userData = data?.data?.user;
    const collegeMembership = data?.data?.collegeMembership;
    const clubMemberships = data?.data?.clubMemberships || [];

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-8 font-sans">
            <AdminNavbar />

            <div className="max-w-7xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">User Explorer</h1>
                    <p className="text-gray-500 font-medium">Platform-wide data retrieval with exact field mappings.</p>
                </header>

                <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-16">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-14 pr-24 py-4 bg-white border-2 border-transparent rounded-2xl shadow-xl shadow-indigo-50 focus:outline-none focus:border-indigo-500 transition-all font-bold text-gray-900"
                            placeholder="user@example.com"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 disabled:opacity-50"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <div className="flex flex-col items-center py-20">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                            <p className="text-gray-400 font-bold">Querying identifiers...</p>
                        </div>
                    ) : isError ? (
                        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-red-100 text-center shadow-sm">
                            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-black text-red-900">Search Failed</h2>
                            <p className="text-gray-500 mt-2 font-medium">{error?.response?.data?.message || "User data could not be retrieved."}</p>
                        </div>
                    ) : userData ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <DataSection
                                    title="User Data"
                                    data={userData}
                                    icon={<User className="w-5 h-5 text-indigo-600" />}
                                    iconColor="bg-indigo-50"
                                />
                                <DataSection
                                    title="College Membership"
                                    data={collegeMembership}
                                    icon={<Building2 className="w-5 h-5 text-blue-600" />}
                                    iconColor="bg-blue-50"
                                />
                            </div>

                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-pink-50 rounded-2xl flex items-center justify-center">
                                        <Trophy className="w-5 h-5 text-pink-600" />
                                    </div>
                                    Club Memberships ({clubMemberships.length})
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {clubMemberships.map((membership, idx) => (
                                        <div key={membership._id || idx} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
                                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                                                <span className="font-black text-gray-900 uppercase tracking-tighter">{membership.club?.name || "Unknown Club"}</span>
                                                <span className="text-[10px] font-mono text-gray-400">{membership._id}</span>
                                            </div>
                                            {Object.entries(membership).map(([k, v]) => {
                                                if (k === 'club') return null;
                                                return (
                                                    <div key={k} className="flex justify-between gap-4">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase shrink-0">{k}</span>
                                                        <span className="text-xs font-mono text-gray-700 break-all text-right">{String(v)}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                    {clubMemberships.length === 0 && (
                                        <div className="md:col-span-2 text-center py-10 text-gray-400 font-bold">No club records found.</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
}
