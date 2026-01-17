import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useMe } from "../../hooks/useMe";
import {
    getEventDetails, publishEvent, closeRegistration,
    completeEvent, deleteEvent
} from "../../api/events.api";
import {
    Calendar, MapPin, Users, BarChart3, Clock,
    CheckCircle2, XCircle, Trash2, Edit3, Loader2,
    ArrowLeft, ExternalLink, Zap, ShieldAlert, AlertTriangle, Send
} from "lucide-react";

export default function EventManagementPage() {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const collegeId = me?.college?.id;

    const { data: event, isLoading, isError } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventDetails(eventId),
        enabled: !!eventId
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["event", eventId] });

    const { mutate: handleAction, isPending: actionInProgress } = useMutation({
        mutationFn: async ({ action, params }) => {
            switch (action) {
                case "publish": return publishEvent(params);
                case "close": return closeRegistration(params);
                case "complete": return completeEvent(params);
                case "delete": return deleteEvent(params);
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

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
    if (isError) return <div className="p-10 text-center font-bold text-red-500">Event not found or access denied.</div>;

    // Extract clubId - handle different backend response structures
    const clubId = event?.club?._id || event?.club?.id || null;
    console.log("EVENT MANAGEMENT - clubId:", clubId, "collegeId:", collegeId); // Debug
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
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft className="w-5 h-5" /></button>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 leading-none">Organizer Console</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Event Lifecycle Management</p>
                        </div>
                    </div>
                    {event.status === "draft" && (
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
                                <span className="text-xs text-gray-400 font-bold">Created {new Date(event.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{event.title}</h2>
                            <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>

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
                                            <span className="font-semibold">{new Date(event.eventStartAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Ends</span>
                                            <span className="font-semibold">{new Date(event.eventEndAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
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
                                            <span className="font-semibold">{new Date(event.registrationStartAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Closes</span>
                                            <span className="font-semibold">{new Date(event.registrationEndAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Venue */}
                                <div className="sm:col-span-2 space-y-2">
                                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                                        <MapPin className="w-4 h-4 text-red-600" /> Location
                                    </div>
                                    <p className="pl-6 text-sm text-gray-600">{event.venue}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Status */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900">Registration Status</h3>
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-blue-600"></span> Live Updates
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-end justify-between">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black tracking-tighter text-gray-900">{event.registrationCount || 0}</span>
                                    <span className="text-gray-400 font-bold text-xl">/ {event.capacity || "∞"} Participants</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-green-600">{event.capacity ? Math.round((event.registrationCount / event.capacity) * 100) : 0}%</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Capacity</p>
                                </div>
                            </div>

                            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (event.registrationCount / (event.capacity || 100)) * 100)}%` }}></div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                {[
                                    { label: "Waitlist", value: event.waitlistCount || 0, icon: Clock, bg: "bg-amber-50", text: "text-amber-600" }
                                ].map(stat => (
                                    <div key={stat.label} className="p-4 rounded-2xl border border-gray-50 bg-gray-50/30">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-gray-900">{stat.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
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
