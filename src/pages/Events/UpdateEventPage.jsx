import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useMe } from "../../hooks/useMe";
import { getEventDetails, updateEvent } from "../../api/events.api";
import EventFormBase from "../../components/events/EventFormBase";
import { ArrowLeft, Save, Loader2, X } from "lucide-react";

export default function UpdateEventPage() {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const collegeId = me?.college?.id;

    const { data: event, isLoading, isError } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventDetails(eventId),
        enabled: !!eventId
    });

    const { mutate: handleUpdate, isPending } = useMutation({
        mutationFn: (formData) => {
            // Extract clubId from event - handle different response structures
            const clubId = event?.clubId || event?.club?._id || event?.club?.id || null;
            return updateEvent({
                collegeId,
                clubId,
                eventId,
                formData
            });
        },
        onSuccess: () => {
            toast.success("Event updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
            navigate(`/events/${eventId}/manage`);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update event");
        }
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-gray-500 font-bold">Loading Event Details...</p>
        </div>
    );

    if (isError) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <p className="text-red-500 font-bold">Failed to load event. It might not exist or you don't have access.</p>
            <button onClick={() => navigate(-1)} className="text-blue-600 font-bold hover:underline">Go Back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-5">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit Event Details</h1>
                    <p className="text-gray-500 mt-2 font-medium tracking-tight">Update information for your event. Status cannot be changed here.</p>
                </div>
            </div>

            {/* Form */}
            <EventFormBase
                id="update-event-form"
                initialData={event}
                onSubmit={(data) => handleUpdate(data)}
                clubId={event?.clubId || event?.club?._id || event?.club?.id || null}
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

                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                            document.getElementById("update-event-form").requestSubmit();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Update Event
                    </button>
                </div>
            </div>
        </div>
    );
}
