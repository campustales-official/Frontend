import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEventDetails } from "../../api/events.api";
import { Calendar, MapPin, Clock, Share2, User, Info, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { useMe } from "../../hooks/useMe";
import { toast } from "react-toastify";

export default function EventDetailsPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { data: me } = useMe();

    const { data: event, isLoading, isError } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventDetails(eventId),
        enabled: !!eventId,
        retry: 1
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError || !event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
                <Info className="w-12 h-12 mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900">Event Not Found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-blue-600 hover:underline font-medium"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Logic for Registration Button
    const now = new Date();
    const regStart = new Date(event.registrationStartAt);
    const regEnd = new Date(event.registrationEndAt);
    const eventStart = new Date(event.eventStartAt);

    let buttonText = "Register Now";
    let isDisabled = false;
    let buttonSubtext = "";

    if (now < regStart) {
        isDisabled = true;
        buttonText = "Registration Not Open";
        buttonSubtext = `Starts ${regStart.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${regStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (now > regEnd) {
        isDisabled = true;
        buttonText = "Registration Closed";
        buttonSubtext = "Ended";
    } else if (event.status !== "published") {
        isDisabled = true;
        buttonText = "Event isn't Open";
    }

    // Handle user action
    const handleRegisterClick = () => {
        if (!me) {
            toast.info("Please login to register.");
            navigate("/login", { state: { from: `/events/${eventId}` } });
            return;
        }
        navigate(`/events/${eventId}/register`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 1. Clean Banner Image */}
            <div className="w-full bg-gray-100 relative overflow-hidden group">
                {/* Floating Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 z-10 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all border border-white/20 shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                {event.bannerImageUrl ? (
                    <img
                        src={event.bannerImageUrl}
                        alt={event.title}
                        className="w-full h-auto max-h-[70vh] object-contain mx-auto bg-black/5"
                    />
                ) : (
                    <div className="h-[40vh] w-full bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center">
                        <span className="text-white/20 font-black text-6xl uppercase">Event</span>
                    </div>
                )}
            </div>

            {/* Content Container - Overlapping the banner slightly or just below */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">

                    {/* Left Column: Header & Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Header Section */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {event.club && (
                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                                        {event.club.name}
                                    </span>
                                )}
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${event.visibility === 'public' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-600 border-gray-200'
                                    }`}>
                                    {event.visibility} Event
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                {event.title}
                            </h1>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-gray-600 font-medium">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg">{eventStart.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg">{eventStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg">{event.venue}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                About Event
                            </h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-wrap max-w-none">
                                {event.description}
                            </div>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {event.club && (
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-4 shadow-sm">
                                    <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                                        {event.club.logoUrl ? (
                                            <img src={event.club.logoUrl} alt={event.club.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-7 h-7 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Organized By</div>
                                        <div className="font-bold text-gray-900 text-lg leading-tight">{event.club.name}</div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-4 shadow-sm">
                                <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                    <User className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registration By</div>
                                    <div className="font-bold text-gray-900 text-lg leading-tight">
                                        {regEnd.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        <span className="text-sm text-gray-500 font-medium ml-1">
                                            {regEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Action Card (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 overflow-hidden relative">
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Get Tickets</h3>
                                <p className="text-gray-500 font-medium mb-8 text-sm">
                                    Secure your spot for this event.
                                    {event.capacity ? ` Limited to ${event.capacity} seats.` : ''}
                                </p>

                                <button
                                    onClick={handleRegisterClick}
                                    disabled={isDisabled}
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex flex-col items-center justify-center gap-1 transition-all transform active:scale-[0.98] ${isDisabled
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                        : "bg-gray-900 text-white shadow-lg hover:shadow-xl hover:bg-gray-800"
                                        }`}
                                >
                                    <span>{buttonText}</span>
                                    {buttonSubtext && (
                                        <span className="text-xs font-medium opacity-70 uppercase tracking-wide">
                                            {buttonSubtext}
                                        </span>
                                    )}
                                </button>

                                {event.status !== 'published' && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg text-center border border-red-100">
                                        Event is currently {event.status.replace('_', ' ').toUpperCase()}
                                    </div>
                                )}

                            </div>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Link copied to clipboard!");
                                }}
                                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition border border-gray-200 flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Share2 className="w-4 h-4" />
                                Share Event
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
