import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Inbox, Globe, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClubs, approveClub, rejectClub, deactivateClub } from "../../api/clubs.api";
import { useMe } from "../../hooks/useMe";
import ClubSkeleton from "../../components/clubs/ClubSkeleton";
import ClubCard from "../../components/clubs/ClubCard";
import DataError from "../../components/common/DataError";
import { toast } from "react-toastify";

export default function ClubsPage({ collegeId }) {
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const isCollegeAdmin = me?.roleInCollege === "college_admin";
    const [view, setView] = useState("explore"); // "explore" or "requests"

    const { data: allClubs, isLoading, isError, refetch } = useQuery({
        queryKey: ["clubs", collegeId],
        queryFn: () => fetchClubs({
            collegeId,
            status: isCollegeAdmin ? "all" : "active"
        }),
        staleTime: 5 * 60 * 1000,
    });

    // Filter clubs based on view and approval status
    const clubs = allClubs?.filter(club => {
        if (!isCollegeAdmin) return true; // Regular users only see active/approved clubs from backend
        const isApproved = !!club.approvedByCollege;
        return view === "requests" ? !isApproved : isApproved;
    });

    const approveMutation = useMutation({
        mutationFn: ({ clubId }) => approveClub({ collegeId, clubId }),
        onSuccess: () => {
            queryClient.invalidateQueries(["clubs", collegeId]);
            toast.success("Club approved/activated successfully!");
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Failed to approve club")
    });

    const rejectMutation = useMutation({
        mutationFn: ({ clubId }) => rejectClub({ collegeId, clubId }),
        onSuccess: () => {
            queryClient.invalidateQueries(["clubs", collegeId]);
            toast.success("Club request rejected.");
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Failed to reject club")
    });

    const deactivateMutation = useMutation({
        mutationFn: ({ clubId }) => deactivateClub({ collegeId, clubId }),
        onSuccess: () => {
            queryClient.invalidateQueries(["clubs", collegeId]);
            toast.success("Club deactivated successfully.");
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Failed to deactivate club")
    });

    const handleAction = (action, clubId) => {
        if (action === 'approve' || action === 'activate') {
            approveMutation.mutate({ clubId });
        } else if (action === 'reject') {
            const confirmed = window.confirm("Are you sure you want to REJECT this club request? This will permanently DELETE the club and all its associated data. This action cannot be undone.");
            if (confirmed) {
                rejectMutation.mutate({ clubId });
            }
        } else if (action === 'deactivate') {
            deactivateMutation.mutate({ clubId });
        }
    };

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
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-1">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            {view === "requests" ? "Pending Club Requests" : "Explore Clubs"}
                        </h1>
                        <p className="text-sm font-bold text-gray-500 mt-1">
                            {view === "requests" ? "Review and approve new club applications" : "Discover and manage student organizations"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {isCollegeAdmin && (
                            <div className="bg-white p-1 rounded-xl border border-gray-100 flex items-center shadow-sm mr-2">
                                <button
                                    onClick={() => setView("explore")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${view === "explore"
                                        ? "bg-gray-900 text-white shadow-lg"
                                        : "text-gray-500 hover:bg-gray-50"
                                        }`}
                                >
                                    <Globe className="w-3.5 h-3.5" />
                                    Explore
                                </button>
                                <button
                                    onClick={() => setView("requests")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${view === "requests"
                                        ? "bg-gray-900 text-white shadow-lg"
                                        : "text-gray-500 hover:bg-gray-50"
                                        }`}
                                >
                                    <Inbox className="w-3.5 h-3.5" />
                                    Requests
                                </button>
                            </div>
                        )}
                        <Link
                            to="/clubs/register"
                            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition active:translate-y-0"
                        >
                            <Plus className="w-4 h-4" />
                            Create Club
                        </Link>
                    </div>
                </div>

                {(!clubs || clubs.length === 0) ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-gray-200" />
                        </div>
                        <p className="text-gray-500 font-black">No clubs found here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {clubs.map((club) => (
                            <ClubCard
                                key={club.id}
                                club={club}
                                isAdmin={isCollegeAdmin}
                                showPendingActions={view === "requests"}
                                onAction={handleAction}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
