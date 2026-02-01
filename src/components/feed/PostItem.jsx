import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../../api/posts.api";
import { Heart, User, ChevronLeft, ChevronRight } from "lucide-react";
import ActionMenu from "../common/ActionMenu";

const PostImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const index = Math.round(scrollLeft / clientWidth);
            setCurrentIndex(index);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (!images || images.length === 0) return null;

    if (images.length === 1) {
        return (
            <img
                src={images[0]}
                alt=""
                className="w-full rounded-lg max-h-96 object-fill border border-gray-100"
            />
        );
    }

    return (
        <div className="relative group">
            {/* Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-lg border border-gray-100"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {images.map((src, index) => (
                    <div key={index} className="w-full flex-shrink-0 snap-center relative pt-[56%]">
                        <img
                            src={src}
                            alt={`Post ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-fill"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Buttons (Desktop) */}
            {currentIndex > 0 && (
                <button
                    onClick={(e) => { e.stopPropagation(); scroll("left"); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}

            {currentIndex < images.length - 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); scroll("right"); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}

            {/* Pagination Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentIndex ? "bg-white w-2" : "bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default function PostItem({ item, actions }) {
    const { data, college, club, id, createdAt } = item;
    const queryClient = useQueryClient();

    const timeAgo = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - d) / 60000);
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return `${Math.floor(diff / 1440)}d ago`;
    };

    const { mutate, isLoading } = useMutation({
        mutationFn: () => likePost(id),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["feed"] });
            const previous = queryClient.getQueriesData({ queryKey: ["feed"] });

            queryClient.setQueriesData({ queryKey: ["feed"] }, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((p) => ({
                        ...p,
                        items: p.items.map((i) => {
                            if (i.id !== id) return i;

                            const wasLiked = i.data.isLikedByMe;
                            const newLikes = wasLiked
                                ? Math.max(0, i.data.likesCount - 1)
                                : i.data.likesCount + 1;

                            return {
                                ...i,
                                data: {
                                    ...i.data,
                                    likesCount: newLikes,
                                    isLikedByMe: !wasLiked
                                }
                            };
                        }),
                    })),
                };
            });
            return { previous };
        },
        onError: (_err, _v, ctx) => {
            ctx?.previous?.forEach(([key, data]) =>
                queryClient.setQueryData(key, data)
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["feed"] });
        }
    });

    return (
        <article className="rounded-xl bg-white shadow-sm hover:shadow-md transition duration-200 border-0 border-r-4 border-r-blue-500 p-2 sm:p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center border border-yellow-200">
                        <User className="w-5 h-5 text-yellow-600" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900">{data.createdBy}</span>
                            <span className="text-gray-400 text-xs">•</span>
                            <span className="text-gray-500 text-xs">
                                {timeAgo(createdAt)}
                            </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                            {college?.name}
                            {club && ` • ${club.name}`}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {actions && (
                        <ActionMenu onEdit={actions.onEdit} onDelete={actions.onDelete} />
                    )}
                </div>
            </div>

            {/* Content */}
            <p className="text-sm mb-3 whitespace-pre-wrap">
                {data.content}
            </p>

            <div className="mb-4">
                <PostImageCarousel images={data.images} />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t">
                <button
                    onClick={() => mutate()}
                    disabled={isLoading}
                    className={`flex items-center gap-2 transition ${data.isLikedByMe
                        ? "text-red-500"
                        : "text-slate-500 hover:text-red-500"
                        }`}
                >
                    <Heart
                        className={`w-5 h-5 transition ${data.isLikedByMe
                            ? "fill-red-500 stroke-red-500"
                            : ""
                            }`}
                    />
                    <span className="text-sm font-medium">
                        {data.likesCount} Likes
                    </span>
                </button>
            </div>
        </article>
    );
}
