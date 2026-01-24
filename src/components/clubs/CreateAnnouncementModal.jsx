import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Loader2, Clock } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../common/Modal";
import { createClubAnnouncement } from "../../api/clubs.api";
import { createCollegeAnnouncement } from "../../api/colleges.api";

export default function CreateAnnouncementModal({ isOpen, onClose, clubId, collegeId, isCollegeScope = false }) {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: isCollegeScope ? createCollegeAnnouncement : createClubAnnouncement,
        onSuccess: () => {
            toast.success("Announcement published!");
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            handleClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to publish announcement");
        }
    });

    const handleClose = () => {
        setTitle("");
        setMessage("");
        setExpiresAt("");
        onClose();
    };

    const handleSubmit = () => {
        if (!title.trim() || !message.trim() || !expiresAt) {
            toast.warn("Please fill in all fields including expiry.");
            return;
        }
        mutate({ collegeId, clubId, title, message, expiresAt });
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Post Announcement">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
                    <input
                        type="text"
                        placeholder="e.g. Meeting Rescheduled"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-100 transition"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Message</label>
                    <textarea
                        rows="4"
                        placeholder="Detailed information..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-100 resize-none transition"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Expires At
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-100 transition text-sm"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-gray-200 transition active:scale-95 disabled:opacity-70 flex items-center gap-2"
                    >
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                        Publish Now
                    </button>
                </div>
            </div>
        </Modal>
    );
}
