import { useState, useRef, useEffect } from "react";
import { useMe } from "../../hooks/useMe";
import { useFeed } from "../../hooks/useFeed";
import FeedItem from "../../components/feed/FeedItem";
import FeedSkeleton from "../../components/feed/FeedSkeleton";
import DataError from "../../components/common/DataError";
import { Calendar, Filter, Sparkles, Loader2, Info } from "lucide-react";

export default function EventsPage() {
    const [activeTab, setActiveTab] = useState("open"); // open, upcoming, registered
    const { data: me } = useMe();
    const collegeId = me?.college?.id;

    // We use "published" for both Open and Upcoming, and "registered" for the Registered tab
    const eventStatusParam = activeTab === "registered" ? "registered" : "published";

    const {
        data: feedData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status: feedStatus,
        refetch
    } = useFeed({
        scope: "global",
        collegeId: collegeId,
        types: "event",
        eventStatus: eventStatusParam,
        enabled: !!collegeId
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

    const now = new Date();

    // Split Open and Upcoming client-side if the param is "published"
    const getFilteredItems = () => {
        if (!feedData) return [];
        const allItems = feedData.pages.flatMap(p => p.items);

        if (activeTab === "registered") return allItems;

        return allItems.filter(item => {
            const regStart = new Date(item.data.registrationStartAt);
            const regEnd = new Date(item.data.registrationEndAt);

            if (activeTab === "open") {
                return regStart <= now && regEnd >= now;
            }
            if (activeTab === "upcoming") {
                return regStart > now;
            }
            return true;
        });
    };

    const filteredItems = getFilteredItems().sort((a, b) => {
        return new Date(a.data.registrationStartAt) - new Date(b.data.registrationStartAt);
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Page Header */}
            <div className="bg-white border-b pt-8 pb-0 sticky top-16 z-30 shadow-sm">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 leading-none">Events Feed</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Discover, Register, and Participate</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-8 relative">
                        {[
                            { id: "open", label: "Open Now", icon: Sparkles },
                            { id: "upcoming", label: "Upcoming", icon: Calendar },
                            { id: "registered", label: "Registered", icon: Filter }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 px-1 text-sm font-bold flex items-center gap-2 transition-all relative ${activeTab === tab.id
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute -bottom-[2px] left-0 w-full h-[2px] bg-blue-600 blur-[2px]"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-4xl mx-auto w-full px-6 py-8">
                <div className="flex flex-col gap-6">
                    {feedStatus === "pending" && <FeedSkeleton />}

                    {feedStatus === "error" && (
                        <DataError onRetry={refetch} />
                    )}

                    {feedStatus === "success" && (
                        <>
                            {filteredItems.map(item => (
                                <FeedItem key={item.id} item={item} />
                            ))}

                            {/* Empty State */}
                            {filteredItems.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Info className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">No events found</h3>
                                    <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                                        There are no events in the {activeTab} category right now.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab(activeTab === "open" ? "upcoming" : "open")}
                                        className="mt-6 text-blue-600 font-bold text-sm hover:underline"
                                    >
                                        Check other categories
                                    </button>
                                </div>
                            )}

                            {/* Infinite Scroll Trigger */}
                            {hasNextPage && (
                                <div ref={observerRef} className="py-10 flex justify-center">
                                    {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-blue-600" />}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
