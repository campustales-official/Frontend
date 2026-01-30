import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useMe } from "../../hooks/useMe";
import {
    Calendar, MapPin, Users, BarChart3, Clock,
    CheckCircle2, XCircle, Trash2, Edit3, Loader2,
    ArrowLeft, ExternalLink, Zap, ShieldAlert, AlertTriangle, Send,
    Search, Filter, ChevronLeft, ChevronRight, MoreVertical, CheckCircle,
    Eye, FileSpreadsheet, Award
} from "lucide-react";
import {
    getEventDetails, publishEvent, closeRegistration, completeEvent,
    deleteEvent, getEventRegistrations, downloadRegistrationsExcel, generateBulkCertificates, generateCertificate
} from "../../api/events.api";
import { formatSafeDate } from "../../utils/date.utils";
import EventQRCode from "../../components/events/EventQRCode";

export default function EventManagementPage() {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const collegeId = me?.college?.id;

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const limit = 10;

    const { data: event, isLoading, isError } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventDetails(eventId),
        enabled: !!eventId
    });

    const clubId = event?.club?._id || event?.club?.id || null;

    const { data: regData, isLoading: regsLoading } = useQuery({
        queryKey: ["event-registrations", eventId, clubId, page, search, statusFilter],
        queryFn: () => getEventRegistrations({
            collegeId,
            clubId,
            eventId,
            page,
            limit,
            search,
            status: statusFilter
        }),
        enabled: !!eventId && !!collegeId && !!event
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["event", eventId] });

    const { mutate: handleAction, isPending: actionInProgress } = useMutation({
        mutationFn: async ({ action, params }) => {
            switch (action) {
                case "publish": return publishEvent(params);
                case "close": return closeRegistration(params);
                case "complete": return completeEvent(params);
                case "delete": return deleteEvent(params);
                case "generate_certs": return generateBulkCertificates(params);
                case "generate_single_cert": return generateCertificate(params);
                default: throw new Error("Invalid action");
            }
        },
        onSuccess: (_, variables) => {
            toast.success(`Action '${variables.action}' performed successfully!`);
            if (variables.action === "delete") {
                navigate(-1);
            } else {
                invalidate();
            }
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Action failed");
        }
    });

    const [isExporting, setIsExporting] = useState(false);
    const handleExport = async () => {
        if (isExporting) return;
        setIsExporting(true);
        const loadingToast = toast.loading("Preparing Excel file...");
        try {
            const data = await downloadRegistrationsExcel({ collegeId, clubId, eventId });
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `registrations-${event?.title || 'event'}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.update(loadingToast, { render: "Excel downloaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (err) {
            toast.update(loadingToast, { render: "Export failed. Please try again.", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsExporting(false);
        }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
    if (isError) return <div className="p-10 text-center font-bold text-red-500">Event not found or access denied.</div>;

    const commonParams = { collegeId, clubId, eventId };

    const statusColors = {
        draft: "bg-gray-100 text-gray-700",
        published: "bg-green-100 text-green-700",
        registration_closed: "bg-amber-100 text-amber-700",
        completed: "bg-blue-100 text-blue-700",
        cancelled: "bg-red-100 text-red-700"
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Nav */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                if (clubId) navigate(`/club/${clubId}`);
                                else navigate("/");
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 leading-none">Organizer Console</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Event Lifecycle Management</p>
                        </div>
                    </div>
                    {event.status !== "completed" && (
                        <Link to={`/events/${eventId}/edit`} className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition">
                            <Edit3 className="w-4 h-4" /> Edit Event
                        </Link>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content: Overview & Stats */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Event Info Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="w-full bg-gray-100 relative group">
                            <img
                                src={event.bannerImageUrl}
                                className="w-full h-auto max-h-[60vh] object-contain mx-auto bg-black/5"
                                alt={event.title}
                            />
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[event.status]}`}>
                                    {event.status.replace("_", " ")}
                                </span>
                                <span className="text-xs text-gray-400 font-bold">Created {formatSafeDate(event.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{event.title}</h2>
                            <p className="text-sm text-gray-500 line-clamp-2">{event.description || "To be announced"}</p>

                            <div className="flex items-center gap-2 text-sm font-bold text-gray-600 mt-1">
                                <span className="text-gray-400 uppercase text-[10px] tracking-widest">Organized by</span>
                                <span className="text-blue-600">{event.club?.name ? `${event.club.name} (${event.college?.name || 'College'})` : (event.college?.name || 'College Admin')}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-gray-100 mt-6">
                                {/* Event Timing */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                                        <Calendar className="w-4 h-4 text-blue-600" /> Event Schedule
                                    </div>
                                    <div className="pl-6 space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Starts</span>
                                            <span className="font-semibold">{formatSafeDate(event.eventStartAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Ends</span>
                                            <span className="font-semibold">{formatSafeDate(event.eventEndAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Registration Timing */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                                        <Clock className="w-4 h-4 text-purple-600" /> Registration Window
                                    </div>
                                    <div className="pl-6 space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Opens</span>
                                            <span className="font-semibold">{formatSafeDate(event.registrationStartAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Closes</span>
                                            <span className="font-semibold">{formatSafeDate(event.registrationEndAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Venue */}
                                <div className="sm:col-span-2 space-y-2">
                                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                                        <MapPin className="w-4 h-4 text-red-600" /> Location
                                    </div>
                                    <p className="pl-6 text-sm text-gray-600 font-medium">{event.venue || "To be announced"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registrations List */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 pb-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                        Registrations
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider ring-4 ring-blue-50">
                                            {event.registrationCount || 0} Total
                                        </span>
                                    </h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage and track participant entries</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate(`/events/${eventId}/registrations/live`)}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 border border-gray-200 transition active:scale-95 shadow-sm"
                                    >
                                        <Eye className="w-4 h-4 text-gray-400" />
                                        Live Grid
                                    </button>
                                    <button
                                        onClick={handleExport}
                                        disabled={isExporting}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-95"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        {isExporting ? 'Exporting...' : 'Download Excel'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                {/* Search */}
                                <div className="relative group flex-1 w-full">
                                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search participant by name or email address..."
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-y border-gray-100">
                                        <th className="px-8 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Participant</th>
                                        <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                                        <th className="px-6 py-5 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-sm">
                                    {regsLoading ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-12 text-center">
                                                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                                                <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Fetching Registrations...</p>
                                            </td>
                                        </tr>
                                    ) : !regData?.registrations?.length ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-12 text-center">
                                                <div className="text-gray-300 mb-2 font-black text-3xl opacity-20 uppercase tracking-tighter italic">No Data</div>
                                                <p className="text-sm font-bold text-gray-400">No registrations found for this event.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        regData.registrations.map(reg => (
                                            <tr key={reg.registrationId} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs shrink-0 ring-2 ring-white">
                                                            {reg.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-gray-900 truncate">{reg.user.name}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase text-xs">Student</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-gray-600 break-all">{reg.user.email}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${reg.status === 'registered' ? 'bg-blue-50 text-blue-600' :
                                                        reg.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                                                            reg.status === 'waitlisted' ? 'bg-amber-50 text-amber-600' :
                                                                'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {reg.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <div className="flex justify-end items-center gap-3">
                                                        {reg.certificateId ? (
                                                            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100" title="Certificate Issued">
                                                                <Award className="w-3 h-3" />
                                                                <span className="text-[8px] uppercase font-black tracking-widest">Issued</span>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleAction({
                                                                    action: "generate_single_cert",
                                                                    params: { ...commonParams, registrationId: reg.registrationId }
                                                                })}
                                                                disabled={actionInProgress}
                                                                className="flex items-center gap-1.5 px-2 py-1 bg-gray-900 text-white rounded-md text-[8px] font-black uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
                                                                title="Issue Certificate"
                                                            >
                                                                <Zap className="w-3 h-3 text-yellow-400" />
                                                                Issue
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => navigate(`/events/${eventId}/registrations/${reg.registrationId}`, {
                                                                state: {
                                                                    registrationIds: regData?.registrations?.map(r => r.registrationId) || [],
                                                                    clubId
                                                                }
                                                            })}
                                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600"
                                                            title="View Full Details"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {regData?.total > limit && (
                            <div className="px-8 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Showing <span className="text-gray-900">{(page - 1) * limit + 1}</span> to <span className="text-gray-900">{Math.min(page * limit, regData.total)}</span> of <span className="text-gray-900">{regData.total}</span> entries
                                </p>
                                <div className="flex items-center gap-1">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    {[...Array(Math.ceil(regData.total / limit))].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${page === i + 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-400 hover:bg-gray-50 border border-transparent'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        disabled={page >= Math.ceil(regData.total / limit)}
                                        onClick={() => setPage(p => p + 1)}
                                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Lifecycle Actions */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-blue-600 fill-blue-600" /> Lifecycle Actions
                        </h3>

                        <div className="space-y-3">
                            {event.status === 'draft' && (
                                <ActionButton
                                    icon={Send} label="Publish Event" subtext="MAKE IT VISIBLE TO COMMUNITY"
                                    onClick={() => handleAction({ action: "publish", params: commonParams })}
                                    variant="blue" loading={actionInProgress}
                                />
                            )}

                            {event.status === 'published' && (
                                <ActionButton
                                    icon={XCircle} label="Close Registration" subtext="STOP RECEIVING ENTRIES"
                                    onClick={() => handleAction({ action: "close", params: commonParams })}
                                    variant="amber" loading={actionInProgress}
                                />
                            )}

                            {(event.status === 'published' || event.status === 'registration_closed') && (
                                <ActionButton
                                    icon={CheckCircle2} label="Mark as Completed" subtext="MOVE TO ARCHIVES"
                                    onClick={() => handleAction({ action: "complete", params: commonParams })}
                                    variant="green" loading={actionInProgress}
                                />
                            )}

                            {event.status === 'completed' && (
                                <ActionButton
                                    icon={Award} label="Generate All Certificates" subtext="BULK ISSUE TO PARTICIPANTS"
                                    onClick={() => handleAction({ action: "generate_certs", params: commonParams })}
                                    variant="blue" loading={actionInProgress}
                                />
                            )}

                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
                                            handleAction({ action: "delete", params: commonParams });
                                        }
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-100 transition"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Event
                                </button>
                                <p className="text-[10px] text-center text-gray-400 mt-3 font-bold uppercase tracking-widest">Danger Zone</p>
                            </div>
                        </div>
                    </div>

                    {/* Certificate Management Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Award className="w-20 h-20 -mr-6 -mt-6" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                            Recognition
                        </h3>
                        <p className="text-xs font-bold text-gray-400 leading-relaxed mb-6">
                            Create and manage digital certificates that participants can download after completion.
                        </p>
                        <button
                            onClick={() => navigate(`/events/${eventId}/certificate-template`)}
                            className="w-full py-3 bg-gray-50 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition border border-gray-200 shadow-sm flex items-center justify-center gap-2"
                        >
                            <Award className="w-4 h-4 text-blue-600" />
                            Certificate Designer
                        </button>
                    </div>

                    <EventQRCode
                        url={window.location.origin + `/events/${eventId}`}
                        eventTitle={event.title}
                    />

                    {/* Quick Summary Sidebar Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Quick Summary</h3>
                        <div className="space-y-4">
                            {[
                                { key: "Organizer", value: event.club?.name || "College Admin" },
                                { key: "Visibility", value: event.visibility.replace("_", " "), class: "capitalize" },
                                { key: "Created By", value: "You" },
                            ].map(row => (
                                <div key={row.key} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                                    <span className="text-gray-400 font-bold">{row.key}</span>
                                    <span className={`text-gray-900 font-black ${row.class || ''}`}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActionButton({ icon: Icon, label, subtext, onClick, variant, loading }) {
    const variants = {
        blue: "bg-blue-600 text-white hover:bg-blue-700",
        amber: "bg-amber-500 text-white hover:bg-amber-600",
        green: "bg-green-600 text-white hover:bg-green-700"
    };

    return (
        <button
            disabled={loading}
            onClick={onClick}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition group ${variants[variant]}`}
        >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-left">
                <p className="font-black text-sm leading-none">{loading ? 'Processing...' : label}</p>
                <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-wider">{subtext}</p>
            </div>
        </button>
    );
}
