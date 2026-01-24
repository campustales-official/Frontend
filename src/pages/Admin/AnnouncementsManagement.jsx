import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGlobalAnnouncements, createGlobalAnnouncement, deleteGlobalAnnouncement } from "../../api/admin.api";
import AdminNavbar from "../../components/layout/AdminNavbar";
import {
    Megaphone,
    Plus,
    Trash2,
    Calendar,
    Type,
    AlignLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Clock
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function AnnouncementsManagement() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        expiresAt: ""
    });

    // 1. Fetch existing announcements
    const { data: announcements, isLoading, isError } = useQuery({
        queryKey: ["global-announcements"],
        queryFn: fetchGlobalAnnouncements
    });

    // 2. Create mutation
    const createMutation = useMutation({
        mutationFn: createGlobalAnnouncement,
        onSuccess: () => {
            toast.success("Announcement published!");
            setFormData({ title: "", message: "", expiresAt: "" });
            queryClient.invalidateQueries({ queryKey: ["global-announcements"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to publish announcement");
        }
    });

    // 3. Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteGlobalAnnouncement,
        onSuccess: () => {
            toast.success("Announcement deleted");
            queryClient.invalidateQueries({ queryKey: ["global-announcements"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete announcement");
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-8">
            <AdminNavbar />

            <div className="max-w-5xl mx-auto">
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center justify-center md:justify-start gap-3">
                        <Megaphone className="w-8 h-8 text-amber-500" />
                        Global Announcements
                    </h1>
                    <p className="text-gray-500">Manage platform-wide notices visible to all users across all institutions.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Creation Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-indigo-500" />
                                New Announcement
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Title</label>
                                    <div className="relative group">
                                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Catchy headline..."
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Message</label>
                                    <div className="relative group">
                                        <AlignLeft className="absolute left-4 top-6 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="4"
                                            placeholder="Detailed information for users..."
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-gray-900 resize-none"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Expires At</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            type="datetime-local"
                                            name="expiresAt"
                                            value={formData.expiresAt}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-gray-900 flex-row-reverse"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 mt-4"
                                >
                                    {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                    Publish Notice
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Announcements List */}
                    <div className="lg:col-span-2 space-y-4">
                        {isLoading ? (
                            <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center">
                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                                <p className="text-gray-400 font-medium">Fetching history...</p>
                            </div>
                        ) : isError ? (
                            <div className="bg-red-50 p-12 rounded-[2rem] border border-red-100 text-center">
                                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                                <h3 className="font-bold text-red-900">Failed to load announcements</h3>
                                <p className="text-red-600 mb-4 text-sm">System was unable to synchronize with the announcement service.</p>
                                <button onClick={() => queryClient.invalidateQueries({ queryKey: ["global-announcements"] })} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold">Retry</button>
                            </div>
                        ) : announcements?.data?.length === 0 ? (
                            <div className="bg-white p-16 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
                                <Megaphone className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold">No active global announcements.</p>
                                <p className="text-xs text-gray-300 mt-1">New platform updates will appear here once published.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {announcements.data.map((ann, idx) => {
                                        const annId = ann.id || ann._id;
                                        return (
                                            <motion.div
                                                key={annId}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start justify-between group hover:shadow-md transition-all"
                                            >
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                                                        <h3 className="font-black text-gray-900 truncate uppercase tracking-tight">{ann.title}</h3>
                                                    </div>
                                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{ann.message}</p>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
                                                            <Clock className="w-3 h-3" />
                                                            ID: {annId?.substring(0, 8)}...
                                                        </div>
                                                        {ann.expiresAt && (
                                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-lg">
                                                                <Calendar className="w-3 h-3" />
                                                                Exp: {new Date(ann.expiresAt).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleDelete(annId)}
                                                    disabled={deleteMutation.isPending}
                                                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                                >
                                                    {deleteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
