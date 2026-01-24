import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useMe } from "../../hooks/useMe";
import { createEvent, publishEvent } from "../../api/events.api";
import EventFormBase from "../../components/events/EventFormBase";
import { useState, useRef } from "react";
import { Save, Send, Loader2, X } from "lucide-react";

export default function CreateEventPage() {
    const navigate = useNavigate();
    const { clubId: routeClubId } = useParams();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const { data: me } = useMe();

    const collegeId = me?.college?.id;
    const clubId = routeClubId || searchParams.get("clubId");

    // Use ref to track publish intent (avoids async state issues)
    const shouldPublishRef = useRef(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const { mutate: handleCreate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const event = await createEvent({ collegeId, clubId, formData });
            const eventId = event._id || event.id; // Handle both _id and id

            if (shouldPublishRef.current) {
                await publishEvent({ collegeId, clubId, eventId });
            }
            return { ...event, id: eventId };
        },
        onSuccess: (event) => {
            const action = shouldPublishRef.current ? "published" : "saved as draft";
            toast.success(`Event ${action} successfully!`);
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            navigate(`/events/${event.id}/manage`);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to create event");
            setIsPublishing(false);
        }
    });

    const onSubmit = (formData) => {
        handleCreate(formData);
    };

    const triggerSubmit = (publish) => {
        shouldPublishRef.current = publish;
        setIsPublishing(publish);
        document.getElementById("create-event-form").requestSubmit();
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                        <span>Events</span>
                        <span>/</span>
                        <span className="text-blue-600">Create New Event</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create New Event</h1>
                    <p className="text-gray-500 mt-2 font-medium">Fill in the details below to organize a new event for your community.</p>
                </div>
            </div>

            {/* Form */}
            <EventFormBase
                id="create-event-form"
                onSubmit={onSubmit}
                initialData={{ visibility: searchParams.get("visibility") || "college" }}
            />

            {/* Sticky Actions Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 py-4 px-6 z-30">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <button
                        type="button" onClick={() => navigate(-1)}
                        className="text-sm font-bold text-gray-500 hover:text-gray-900 transition flex items-center gap-2"
                    >
                        <X className="w-4 h-4" /> Discard Changes
                    </button>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => triggerSubmit(false)}
                            className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl transition flex items-center gap-2"
                        >
                            {isPending && !isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save as Draft
                        </button>
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => triggerSubmit(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            {isPending && isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Publish Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
