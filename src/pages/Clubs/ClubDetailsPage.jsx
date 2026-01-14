import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClubs } from "../../api/clubs.api"; // We can reuse or make a specific one
import { useMe } from "../../hooks/useMe";
import { Users, Settings, Globe, Instagram, Mail, Image as ImageIcon, Calendar as CalendarIcon, Send, Twitter, Linkedin, Plus, Clock, User } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

// Reuse Feed components
import { useFeed } from "../../hooks/useFeed";
import FeedItem from "../../components/feed/FeedItem";
import FeedSkeleton from "../../components/feed/FeedSkeleton";
import DataError from "../../components/common/DataError";

import CreatePostModal from "../../components/clubs/CreatePostModal";
import CreateAnnouncementModal from "../../components/clubs/CreateAnnouncementModal";

import { updateClubPost, deleteClubPost, deleteClubAnnouncement } from "../../api/clubs.api";
import EditPostModal from "../../components/clubs/EditPostModal";

export default function ClubDetailsPage() {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("posts");

    // Modal States
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    // 1. Get Me to check roles
    const { data: me } = useMe();
    const collegeId = me?.college?.id;

    // 2. Fetch Club Details (Handle reload by fetching list if needed)
    const { data: club, isLoading: isClubLoading } = useQuery({
        queryKey: ["clubs", collegeId],
        queryFn: () => fetchClubs({ collegeId }),
        enabled: !!collegeId,
        select: (clubs) => clubs.find((c) => c.id === clubId),
        staleTime: 5 * 60 * 1000,
        initialData: () => {
            // Optimistic cache lookup
            const allClubs = queryClient.getQueryData(["clubs", collegeId]);
            return allClubs?.find((c) => c.id === clubId);
        }
    });

    // Check permission
    const myRoleObj = me?.clubRoles?.find(r => r.clubId === clubId);
    const isAdmin = myRoleObj?.role === "admin" || myRoleObj?.role === "superadmin" || me?.platformRole === "admin";

    // 3. Fetch Tab Content
    const feedTypes = activeTab === "posts" ? "post" : activeTab === "events" ? "event" : "announcement";

    // Determine enabled state for feed
    const isFeedEnabled = !!clubId && !!collegeId;

    const {
        data: feedData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status: feedStatus,
        refetch: refetchFeed
    } = useFeed({
        scope: "club",
        clubId: clubId,
        collegeId: collegeId,
        types: feedTypes,
        enabled: isFeedEnabled
    });


    // Infinite Scroll Observer
    const observerRef = useRef(null);

    useEffect(() => {
        if (feedStatus !== "success") return;
        if (!hasNextPage || isFetchingNextPage) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) fetchNextPage();
        }, { threshold: 1 });
        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [feedStatus, hasNextPage, isFetchingNextPage, fetchNextPage]);


    // Delete Mutation
    const { mutate: deleteContent } = useMutation({
        mutationFn: async ({ id, type }) => {
            if (type === 'post') {
                return deleteClubPost({ collegeId, clubId, postId: id });
            } else if (type === 'announcement') {
                return deleteClubAnnouncement({ collegeId, clubId, announcementId: id });
            }
        },
        onSuccess: () => {
            toast.success("Item deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["feed"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete item");
        }
    });


    if (isClubLoading) {
        return <div className="p-10 text-center">Loading Club Info...</div>;
    }

    if (!club) {
        return <div className="p-10 text-center">Club not found.</div>;
    }

    // Handlers
    const handleAction = (action, item) => {
        if (action === 'delete') {
            if (confirm("Are you sure you want to delete this?")) {
                deleteContent({ id: item.id, type: item.type });
            }
        }
        if (action === 'edit') {
            if (item.type === 'post') {
                setEditingPost(item);
            } else {
                toast.info("Editing not implemented for this type yet.");
            }
        }
    };

    const handleCreate = () => {
        if (activeTab === 'posts') {
            setIsPostOpen(true);
        } else if (activeTab === 'announcements') {
            setIsAnnouncementOpen(true);
        } else if (activeTab === 'events') {
            // Redirect for events
            navigate(`/club/${clubId}/create-event`);
        }
    }


    return (
        <div className="min-h-screen bg-gray-200 pb-20">
            {/* Header Section */}
            <div className=" border-b shadow-sm mb-4 bg-gray-50">
                {/* Cover Banner */}
                <div className="h-48 md:h-64 bg-gray-200 relative">
                    <img
                        src={club.coverImageUrl}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Info Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative pb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 md:-mt-16 gap-4 md:gap-6 mb-6">
                        {/* Logo */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative z-10">
                            <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 pt-2 md:pt-0 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                                {club.name}
                                {club.isOfficial && (
                                    <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide">
                                        Official
                                    </span>
                                )}
                            </h1>
                            <div className="text-sm text-gray-500 font-medium mt-1">
                                {club.college?.name || me?.college?.name} • Estd. {club.establishedYear}
                            </div>
                        </div>

                        {/* Action Buttons (Swapped as requested: Admin Left/First, Member Right/Second) */}
                        <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                            {isAdmin && (
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
                                    <Settings className="w-4 h-4" />
                                    Admin Panel
                                </button>
                            )}
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-medium transition shadow-sm">
                                <Users className="w-4 h-4" />
                                Member List
                            </button>
                        </div>
                    </div>

                    {/* Description & Links */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                {club.description}
                            </p>

                            {/* Social Links */}
                            <div className="flex items-center gap-4">
                                {club.socialLinks?.website && (
                                    <a href={club.socialLinks.website} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition">
                                        <Globe className="w-5 h-5" />
                                    </a>
                                )}
                                {club.socialLinks?.instagram && (
                                    <a href={club.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-600 transition">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                )}
                                {club.socialLinks?.twitter && (
                                    <a href={club.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-sky-500 transition">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                )}
                                {club.socialLinks?.linkedin && (
                                    <a href={club.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-700 transition">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Faculty Advisor Card */}
                        {club.facultyAdvisor && (
                            <div className="md:w-80 bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Faculty Advisor</div>
                                    <div className="text-sm font-bold text-gray-900">{club.facultyAdvisor.name}</div>
                                </div>
                                <a href={`mailto:${club.facultyAdvisor.email}`} className="text-gray-400 hover:text-gray-600">
                                    <Mail className="w-5 h-5" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Tabs (Sticky) */}
                <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                        {/* Tabs Grid */}
                        <div className="grid grid-cols-3 flex-1">
                            {["posts", "events", "announcements"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`h-12 border-b-2 text-sm font-bold capitalize transition-colors flex items-center justify-center ${activeTab === tab
                                        ? "border-blue-600 text-blue-600 bg-blue-50/50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Context Context Action Button (Right Side of Tabs) */}
                        {isAdmin && (
                            <div className="pl-4 border-l border-gray-100 h-10 my-1 flex items-center">
                                <button
                                    onClick={handleCreate}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-900 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-all transform active:scale-90"
                                    title={`Create new ${activeTab.slice(0, -1)}`}
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-w-4xl mx-auto px-4 py-6">

                    {/* Modals */}
                    {club && (
                        <>
                            <CreatePostModal
                                isOpen={isPostOpen}
                                onClose={() => setIsPostOpen(false)}
                                clubId={club.id}
                                collegeId={collegeId}
                            />
                            <CreateAnnouncementModal
                                isOpen={isAnnouncementOpen}
                                onClose={() => setIsAnnouncementOpen(false)}
                                clubId={club.id}
                                collegeId={collegeId}
                            />
                            {editingPost && (
                                <EditPostModal
                                    isOpen={!!editingPost}
                                    onClose={() => setEditingPost(null)}
                                    clubId={club.id}
                                    collegeId={collegeId}
                                    post={editingPost}
                                />
                            )}
                        </>
                    )}

                    {/* Feed/List Content */}
                    <div className="flex flex-col gap-6">
                        {feedStatus === "pending" && <FeedSkeleton />}

                        {feedStatus === "error" && (
                            <DataError onRetry={refetchFeed} />
                        )}

                        {feedStatus === "success" && (
                            <>
                                {feedData.pages.flatMap(p => p.items).map(item => {
                                    // Attach admin actions (delete/edit)
                                    const itemActions = isAdmin ? {
                                        onEdit: activeTab !== 'announcements' ? () => handleAction('edit', item) : undefined,
                                        onDelete: () => handleAction('delete', item)
                                    } : undefined;

                                    const itemWithActions = { ...item, actions: itemActions };

                                    return <FeedItem key={item.id} item={itemWithActions} />;
                                })}

                                {/* Empty State */}
                                {feedData.pages[0].items.length === 0 && (
                                    <div className="text-center py-10 text-gray-500">
                                        No {activeTab} yet.
                                    </div>
                                )}

                                {/* Infinite Scroll Trigger */}
                                {hasNextPage && <div ref={observerRef} className="h-8" />}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
