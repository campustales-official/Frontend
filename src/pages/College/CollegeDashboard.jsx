import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCollege, deleteCollegePost, deleteCollegeAnnouncement } from "../../api/colleges.api";
import { useMe } from "../../hooks/useMe";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { useFeed } from "../../hooks/useFeed";
import FeedItem from "../../components/feed/FeedItem";
import FeedSkeleton from "../../components/feed/FeedSkeleton";
import DataError from "../../components/common/DataError";

import CreatePostModal from "../../components/clubs/CreatePostModal";
import CreateAnnouncementModal from "../../components/clubs/CreateAnnouncementModal";
import EditPostModal from "../../components/clubs/EditPostModal";

import { Globe, Mail, Image as ImageIcon, Calendar as CalendarIcon, Plus, User, Loader2, MapPin, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";

export default function CollegeDashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("posts");

    const [isPostOpen, setIsPostOpen] = useState(false);
    const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const { data: me } = useMe();
    const collegeId = me?.college?.id;

    const { data: college, isLoading: isCollegeLoading } = useQuery({
        queryKey: ["college", collegeId],
        queryFn: () => fetchCollege(collegeId),
        enabled: !!collegeId,
        staleTime: 5 * 60 * 1000
    });

    const isCollegeAdmin = me?.roleInCollege === "college_admin";

    const feedTypes = activeTab === "posts" ? "post" : activeTab === "events" ? "event" : "announcement";

    const [eventFilter, setEventFilter] = useState("all");

    const {
        data: feedData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status: feedStatus,
        refetch: refetchFeed
    } = useFeed({
        scope: "college",
        collegeId: collegeId,
        types: feedTypes,
        enabled: !!collegeId,
        eventStatus: (isCollegeAdmin && activeTab === "events") ? eventFilter : "published"
    });

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

    const { mutate: deleteContent } = useMutation({
        mutationFn: async ({ id, type }) => {
            if (type === 'post') {
                return deleteCollegePost({ collegeId, postId: id });
            } else if (type === 'announcement') {
                return deleteCollegeAnnouncement({ collegeId, announcementId: id });
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

    if (isCollegeLoading) {
        return <div className="p-10 text-center text-gray-500 font-medium">Loading College Info...</div>;
    }

    if (!college) {
        return <div className="p-10 text-center text-gray-500 font-medium">College info not found.</div>;
    }

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
            navigate(`/events/create?visibility=college`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 pb-20">
            <div className="border-b shadow-sm mb-4 bg-gray-50">
                <div className="h-48 md:h-64 bg-gray-200 relative">
                    <img
                        src={college.coverImageUrl}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative pb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 md:-mt-16 gap-4 md:gap-6 mb-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden relative z-10">
                            <img src={college.logoUrl} alt={college.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 pt-2 md:pt-0 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
                                {college.name}
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase font-black px-2.5 py-1 rounded-lg tracking-widest">
                                    Institute
                                </span>
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 font-bold mt-2">
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {college.city}, {college.state}</span>
                                <span className="flex items-center gap-1.5"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AISHE Code:</span> {college.aisheCode}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                                {college.address}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {college.emailDomains?.map(domain => (
                                    <span key={domain} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold border border-gray-200">
                                        @{domain}
                                    </span>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-4 mt-6">
                                {(college.socialLinks?.website || college.website) && (
                                    <a href={college.socialLinks?.website || college.website} target="_blank" rel="noreferrer" className="text-gray-400 hover:scale-110 text-blue-600 transition" title="Website">
                                        <Globe className="w-5 h-5" />
                                    </a>
                                )}
                                {college.socialLinks?.instagram && (
                                    <a href={college.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:scale-110 text-pink-600 transition" title="Instagram">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                )}
                                {college.socialLinks?.twitter && (
                                    <a href={college.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:scale-110 text-sky-500 transition" title="X">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                )}
                                {college.socialLinks?.linkedin && (
                                    <a href={college.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:scale-110 text-blue-700 transition" title="LinkedIn">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                                {college.socialLinks?.facebook && (
                                    <a href={college.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:scale-110 text-blue-600 transition" title="Facebook">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                )}
                                {(college.socialLinks?.email || college.email) && (
                                    <a href={`mailto:${college.socialLinks?.email || college.email}`} className="text-gray-400 hover:scale-110 text-orange-500 transition" title="Email">
                                        <Mail className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {college.admins && college.admins.length > 0 && (
                            <div className="md:w-96 space-y-3">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">College Administrators</div>
                                {college.admins.map(admin => (
                                    <div key={admin._id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-black text-gray-900 truncate">{admin.name}</div>
                                            <div className="text-xs text-gray-500 truncate font-medium">{admin.email}</div>
                                        </div>
                                        <a href={`mailto:${admin.email}`} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
                                            <Mail className="w-4 h-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                        <div className="grid grid-cols-3 flex-1">
                            {["posts", "events", "announcements"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`h-12 border-b-2 text-sm font-black capitalize transition-all flex items-center justify-center ${activeTab === tab
                                        ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {isCollegeAdmin && (
                            <div className="pl-4 border-l border-gray-100 h-10 my-1 flex items-center">
                                <button
                                    onClick={handleCreate}
                                    className="w-10 h-10 flex items-center justify-center bg-gray-900 hover:bg-indigo-600 text-white rounded-xl shadow-lg shadow-gray-200 transition-all transform active:scale-90"
                                    title={`Create new ${activeTab.slice(0, -1)}`}
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-8">
                    {college && (
                        <>
                            <CreatePostModal
                                isOpen={isPostOpen}
                                onClose={() => setIsPostOpen(false)}
                                clubId={null}
                                collegeId={collegeId}
                                isCollegeScope={true}
                            />
                            <CreateAnnouncementModal
                                isOpen={isAnnouncementOpen}
                                onClose={() => setIsAnnouncementOpen(false)}
                                clubId={null}
                                collegeId={collegeId}
                                isCollegeScope={true}
                            />
                            {editingPost && (
                                <EditPostModal
                                    isOpen={!!editingPost}
                                    onClose={() => setEditingPost(null)}
                                    clubId={null}
                                    collegeId={collegeId}
                                    post={editingPost}
                                />
                            )}
                        </>
                    )}

                    {isCollegeAdmin && activeTab === 'events' && (
                        <div className="flex items-center justify-end mb-6">
                            <div className="bg-white border border-gray-200 p-1 rounded-xl flex items-center gap-1 shadow-sm overflow-x-auto max-w-full">
                                {["all", "published", "draft", "completed", "cancelled"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setEventFilter(status)}
                                        className={`px-4 py-2 rounded-lg text-xs font-black capitalize transition-all whitespace-nowrap ${eventFilter === status
                                            ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-8">
                        {feedStatus === "pending" && <FeedSkeleton />}

                        {feedStatus === "error" && (
                            <DataError onRetry={refetchFeed} />
                        )}

                        {feedStatus === "success" && (
                            <>
                                {feedData.pages.flatMap(p => p.items).map(item => {
                                    const itemActions = isCollegeAdmin ? {
                                        onEdit: activeTab !== 'announcements' ? () => handleAction('edit', item) : undefined,
                                        onDelete: () => handleAction('delete', item)
                                    } : undefined;

                                    const itemWithActions = {
                                        ...item,
                                        actions: itemActions,
                                        showManageButton: isCollegeAdmin && item.type === 'event',
                                        showExploreButton: !isCollegeAdmin || (item.data?.status === 'published')
                                    };

                                    return <FeedItem key={item.id} item={itemWithActions} />;
                                })}

                                {feedData.pages[0].items.length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CalendarIcon className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 font-bold">No {activeTab} yet in college feed.</p>
                                    </div>
                                )}

                                {hasNextPage && <div ref={observerRef} className="h-20 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
                                </div>}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
