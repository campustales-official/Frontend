import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../common/Modal";
import { updateClubPost } from "../../api/clubs.api";

export default function EditPostModal({ isOpen, onClose, clubId, collegeId, post }) {
    const [content, setContent] = useState("");
    const queryClient = useQueryClient();

    useEffect(() => {
        if (post) {
            setContent(post.data.content || "");
        }
    }, [post]);

    const { mutate, isPending } = useMutation({
        mutationFn: updateClubPost,
        onSuccess: () => {
            toast.success("Post updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            onClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update post");
        }
    });

    const handleSubmit = () => {
        if (!content.trim()) {
            toast.warn("Content cannot be empty.");
            return;
        }
        mutate({ collegeId, clubId, postId: post.id, content });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Post">
            <div className="space-y-4">
                <textarea
                    rows="4"
                    placeholder="Update your post..."
                    className="w-full p-4 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-blue-100 resize-none transition"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="pt-2 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow-md transition active:scale-95 disabled:opacity-70 flex items-center gap-2"
                    >
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </Modal>
    );
}
