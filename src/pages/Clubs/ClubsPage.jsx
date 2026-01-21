import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchClubs } from "../../api/clubs.api";
import ClubSkeleton from "../../components/clubs/ClubSkeleton";
import ClubCard from "../../components/clubs/ClubCard";
import DataError from "../../components/common/DataError";

export default function ClubsPage({ collegeId }) {
    const { data: clubs, isLoading, isError, refetch } = useQuery({
        queryKey: ["clubs", collegeId],
        queryFn: () => fetchClubs({ collegeId }),
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-200 p-6">
                <div className="mx-auto w-full max-w-7xl">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 px-1">Explore Clubs</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <ClubSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-200 p-6">
                <DataError
                    title="Failed to load clubs"
                    message="We couldn't fetch the clubs list for your college. Please try again."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-200 p-6">
            <div className="mx-auto w-full max-w-7xl">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h1 className="text-2xl font-bold text-gray-900">Explore Clubs</h1>
                    <Link
                        to="/clubs/register"
                        className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl font-bold text-sm shadow-sm border border-blue-100 hover:bg-blue-50 transition"
                    >
                        <Plus className="w-4 h-4" />
                        Create Club
                    </Link>
                </div>

                {(!clubs || clubs.length === 0) ? (
                    <div className="text-center py-10 text-gray-500">
                        No clubs found for this college.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clubs.map((club) => (
                            <ClubCard key={club.id} club={club} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
