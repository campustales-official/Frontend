import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, ArrowRight, Settings, FileText, Download, Award } from "lucide-react";
import { getCertificateDownloadUrl } from "../../api/events.api";
import { formatSafeDate } from "../../utils/date.utils";

export default function EventItem({ item, actions, showManageButton = false }) {
    const { data, college, club, id, showExploreButton = true } = item;
    const navigate = useNavigate();

    const status = data.status?.toLowerCase() || 'published';
    // Normalize to "cancelled" (double L) for internal mapping primarily
    const normalizedStatus = status === 'canceled' ? 'cancelled' : status;

    // Status Styling
    const containerClasses = {
        draft: "bg-gray-50 opacity-80",
        cancelled: "bg-red-50",
        completed: "bg-green-50",
        published: "bg-white hover:shadow-md",
        'registration-closed': "bg-orange-50"
    }[normalizedStatus] || "bg-white hover:shadow-md";

    const now = new Date();
    const regStart = new Date(data.registrationStartAt);
    const regEnd = new Date(data.registrationEndAt);

    let calculatedStatus = normalizedStatus;
    if (normalizedStatus === 'published') {
        if (now < regStart) calculatedStatus = 'upcoming';
        else if (now >= regStart && now <= regEnd) calculatedStatus = 'open';
        else calculatedStatus = 'registration-closed';
    }

    // Badge Styling
    const badgeClasses = {
        draft: "bg-gray-200 text-gray-700",
        cancelled: "bg-red-100 text-red-700",
        completed: "bg-green-100 text-green-700",
        upcoming: "bg-blue-50 text-blue-700",
        open: "bg-green-500 text-white",
        'registration-closed': "bg-orange-100 text-orange-700"
    }[calculatedStatus] || "bg-green-50 text-green-700 pb-0.5";

    const badgeText = {
        upcoming: "Upcoming",
        open: "Open Now",
        'registration-closed': "Registration Closed",
        draft: "Draft",
        cancelled: "Cancelled",
        completed: "Completed"
    }[calculatedStatus] || calculatedStatus.replace('-', ' ');

    const isImageGrayscale = normalizedStatus === 'draft' ? "grayscale" : "";

    return (
        <article
            className={`overflow-hidden rounded-xl shadow-sm transition duration-200 flex flex-col sm:flex-row relative group ${containerClasses}`}
        >
            {/* Left Image Section */}
            <div className="relative w-full sm:w-2/5 aspect-video sm:aspect-auto sm:h-auto bg-gray-100 max-h-80">
                <img
                    src={data.bannerImageUrl}
                    alt={data.title}
                    className={`w-full h-full object-fill ${isImageGrayscale}`}
                />
                <div className={`absolute top-3 left-3 backdrop-blur text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1 shadow-sm uppercase tracking-wider ${badgeClasses}`}>
                    {calculatedStatus === 'open' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
                    {badgeText}
                </div>
            </div>

            {/* Right Content Section */}
            <div className="flex-1 p-5 flex flex-col">
                {/* Header */}
                <div className="flex flex-row-reverse sm:flex-row items-center justify-between mb-2">
                    <div className="text-xs text-gray-500 font-medium">
                        {college?.name} {club && `• ${club.name}`}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{data.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{data.description || "To be announced"}</p>

                {/* Details */}
                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{formatSafeDate(data.eventStartAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className=" font-medium">{data.venue || "To be announced"}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-wrap gap-2 justify-center">
                    {/* Registered Actions */}
                    {data.registrationId ? (
                        <>
                            <button
                                onClick={() => navigate(`/my-registrations/${data.registrationId}`)}
                                className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition hover:bg-blue-700 active:scale-[0.98] text-xs flex items-center justify-center gap-2 group/btn"
                            >
                                <FileText className="w-3.5 h-3.5" />
                                <span>View Registration</span>
                            </button>
                            {data.certificateId ? (
                                <a
                                    href={getCertificateDownloadUrl(data.certificateId)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition hover:bg-green-700 active:scale-[0.98] text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                                >
                                    <Award className="w-3.5 h-3.5" />
                                    <span>Download Cert</span>
                                </a>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        import("react-toastify").then(({ toast }) => toast.info("Certificate will be available after the event completes."));
                                    }}
                                    className="bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg transition hover:bg-gray-200 active:scale-[0.98] text-xs flex items-center justify-center gap-2"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Certificate</span>
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Explore Button - Conditional */}
                            {showExploreButton && (
                                <button
                                    onClick={() => navigate(`/events/${id}`)}
                                    className="flex-1 max-w-[160px] bg-blue-600 text-white font-semibold py-2 rounded-lg transition hover:bg-blue-700 active:scale-[0.98] text-sm flex items-center justify-center gap-2"
                                >
                                    Explore <ArrowRight className="w-4 h-4" />
                                </button>
                            )}

                            {/* Manage Button - Only for Admins in Club Context */}
                            {showManageButton && actions && (
                                <button
                                    onClick={() => navigate(`/events/${id}/manage`)}
                                    className="flex-1 max-w-[160px] bg-gray-900 text-white font-semibold py-2 rounded-lg transition hover:bg-gray-800 active:scale-[0.98] text-sm flex items-center justify-center gap-2"
                                >
                                    <Settings className="w-4 h-4" /> Manage
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </article >
    );
}
