import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../../api/posts.api";
import { Heart, User } from "lucide-react";

export default function PostItem({ item }) {
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
        mutationFn: () => likePost(id), // toggle endpoint

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["feed"] });

            const previous = queryClient.getQueriesData({ queryKey: ["feed"] });

            queryClient.setQueriesData({ queryKey: ["feed"] }, (old) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        items: page.items.map((i) => {
                            if (i.id !== id) return i;

                            const wasLiked = i.data.isLikedByMe;

                            return {
                                ...i,
                                data: {
                                    ...i.data,
                                    isLikedByMe: !wasLiked,
                                    likesCount: wasLiked
                                        ? Math.max(0, i.data.likesCount - 1)
                                        : i.data.likesCount + 1,
                                },
                            };
                        }),
                    })),
                };
            });

            return { previous };
        },

        onError: (_err, _vars, ctx) => {
            ctx?.previous?.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });
        },

        onSettled: () => {
            // backend is source of truth
            queryClient.invalidateQueries({ queryKey: ["feed"] });
        },
    });

    return (
        <article className="rounded-xl bg-white shadow-sm hover:shadow-md transition duration-200 border-0 border-r-4 border-r-blue-500 p-5">
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

                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                    Post
                </span>
            </div>

            {/* Content */}
            <p className="text-sm mb-3 whitespace-pre-wrap">
                {data.content}
            </p>

            {data.images?.[0] && (
                <img
                    src={data.images[0]}
                    alt=""
                    className="w-full rounded-lg max-h-96 object-cover"
                />
            )}

            {/* Actions */}
            <div className="pt-3 border-t">
                <button
                    onClick={mutate}
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
