import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

export default function ClubCard({ club }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/club/${club.id}`)}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 flex flex-col h-full"
        >
            {/* Cover Image */}
            <div className="h-32 bg-gray-200 relative">
                <img
                    src={club.coverImageUrl}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                {/* Overlay Gradient for text readability if needed (optional) */}
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
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {club.name}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-1">
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
                        {/* Mock avatars since API doesn't provide member list, just count */}
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
