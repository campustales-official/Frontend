import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Share2, Bookmark } from "lucide-react";
import { toast } from "react-toastify";

export default function EventItem({ item }) {
    const { data, college, club, id } = item;
    const navigate = useNavigate();

    return (
        <article className="overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition duration-200 border-0 flex flex-col sm:flex-row">
            {/* Left Image Section */}
            <div className="relative w-full sm:w-2/5 h-48 sm:h-auto bg-gray-100">
                <img
                    src={data.bannerImageUrl}
                    alt={data.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-green-700 text-xs font-bold px-2 py-1 rounded-md border border-green-200 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Upcoming
                </div>
            </div>

            {/* Right Content Section */}
            <div className="flex-1 p-5 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        Event
                    </span>
                    <div className="text-xs text-gray-500 font-medium">
                        {college?.name} {club && `• ${club.name}`}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{data.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{data.description}</p>

                {/* Details */}
                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{new Date(data.eventStartAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>{data.venue}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex justify-center">
                    {(() => {
                        const now = new Date();
                        const startAt = new Date(data.registrationStartAt);
                        const endAt = new Date(data.registrationEndAt);
                        const isNotStarted = startAt > now;
                        const isEnded = endAt < now;

                        return (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isNotStarted) {
                                        toast.info("Registration has not started yet");
                                        return;
                                    }
                                    if (isEnded) {
                                        toast.error("Registration has ended");
                                        return;
                                    }
                                    navigate("/register");
                                }}
                                className={`w-full max-w-[200px] font-semibold py-2 rounded-lg transition active:scale-[0.98] text-sm ${isNotStarted
                                        ? "bg-gray-100 text-gray-400 cursor-default"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                {isNotStarted
                                    ? `Starts ${startAt.toLocaleTimeString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                                    : "Register Now"}
                            </button>
                        );
                    })()}
                </div>
            </div>
        </article>
    );
}
