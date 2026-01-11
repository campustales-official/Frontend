import { useEffect, useRef } from "react";
import { useFeed } from "../../hooks/useFeed";
import FeedItem from "../../components/feed/FeedItem";
import FeedSkeleton from "../../components/feed/FeedSkeleton";
import FeedError from "../../components/feed/FeedError";

export default function FeedPage({ scope = "college", clubId = null, collegeId }) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch,
    } = useFeed({ scope, clubId, collegeId });

    const observerRef = useRef(null);

    useEffect(() => {
        if (status !== "success") return;
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) fetchNextPage();
            },
            { threshold: 1 }
        );

        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [status, hasNextPage, isFetchingNextPage, fetchNextPage]);

    /* -------- HARD GUARDS -------- */
    if (status === "pending") {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="mx-auto w-full max-w-3xl">
                    <FeedSkeleton />
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <FeedError onRetry={() => refetch()} />
            </div>
        );
    }

    // ✅ ONLY now data is guaranteed
    const items = data.pages.flatMap((page) => page.items);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto w-full max-w-3xl px-4 py-6 flex flex-col gap-6">
                {items.map((item) => (
                    <FeedItem key={`${item.type}-${item.id}`} item={item} />
                ))}

                {hasNextPage && (
                    <div ref={observerRef} className="h-8" />
                )}
            </div>
        </div>
    );
}
