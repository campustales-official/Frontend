import { useNavigate } from "react-router-dom";
import { Users, CheckCircle, ShieldAlert, ShieldCheck, XCircle } from "lucide-react";

export default function ClubCard({ club, isAdmin = false, showPendingActions = false, onAction }) {
    const navigate = useNavigate();
    const isInactive = club.status === "inactive" || club.status === "deactivated";

    return (
        <div
            onClick={() => navigate(`/club/${club.id}`)}
            className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 flex flex-col h-full relative ${isInactive ? "grayscale-[0.8] opacity-90" : ""}`}
        >
            {/* Watermark for Inactive Clubs */}
            {isInactive && (
                <div className="absolute inset-x-0 top-12 z-10 flex items-center justify-center pointer-events-none select-none opacity-20">
                    <p className="border-2 border-gray-500 text-gray-500 font-black text-xl uppercase px-4 py-1 rounded-lg transform -rotate-12">Inactive</p>
                </div>
            )}

            {/* Admin Actions Overlay */}
            {isAdmin && (
                <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
                    {showPendingActions ? (
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAction('approve', club.id);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-green-600 rounded-lg shadow-sm hover:bg-green-50 transition-colors border border-green-100 text-[10px] font-black uppercase tracking-wider"
                            >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Approve
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAction('reject', club.id);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition-colors border border-red-100 text-[10px] font-black uppercase tracking-wider"
                            >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction(isInactive ? 'activate' : 'deactivate', club.id);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm transition-colors border text-[10px] font-black uppercase tracking-wider ${isInactive
                                ? "text-green-600 hover:bg-green-50 border-green-100"
                                : "text-red-600 hover:bg-red-50 border-red-100"
                                }`}
                        >
                            {isInactive ? (
                                <>
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Activate
                                </>
                            ) : (
                                <>
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    Deactivate
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Cover Image */}
            <div className="h-32 bg-gray-200 relative">
                <img
                    src={club.coverImageUrl}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content Container */}
            <div className="px-5 pb-5 flex-1 flex flex-col relative">

                {/* Logo (Overlapping) */}
                <div className="-mt-8 mb-3 flex justify-between items-end">
                    <div className="w-16 h-16 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex-shrink-0">
                        <img
                            src={club.logoUrl}
                            alt={club.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Estd Badge */}
                    {club.establishedYear && (
                        <div className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide mb-1">
                            Estd. {club.establishedYear}
                        </div>
                    )}
                </div>

                {/* Title & Category */}
                <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                        {club.name}
                    </h3>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                        {club.category || "General"}
                    </p>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                    {club.description}
                </p>

                {/* Footer: Members & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    {/* Member Pill */}
                    <div className="flex items-center -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[8px] text-gray-500">
                            <Users className="w-3 h-3" />
                        </div>
                        <div className="pl-3 text-xs font-bold text-gray-500">
                            +{club.stats?.members || 0} Members
                        </div>
                    </div>

                    <span className="text-sm font-bold text-blue-600 group-hover:underline">
                        View Club
                    </span>
                </div>
            </div>
        </div>
    );
}
