import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
    ArrowLeft, Loader2, Award, ShieldAlert, Trash2,
    AlertCircle, CheckCircle2, FileJson
} from 'lucide-react';
import { useMe } from "../../hooks/useMe";
import {
    getEventDetails, getCertificateTemplate,
    createCertificateTemplate, updateCertificateTemplate,
    deleteCertificateTemplate
} from "../../api/events.api";
import CertificateEditor from "../../components/events/CertificateEditor";

export default function CertificateTemplatePage() {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const collegeId = me?.college?.id;

    // Fetch Event Details (needed for clubId, title, etc.)
    const { data: event, isLoading: eventLoading } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventDetails(eventId),
        enabled: !!eventId
    });

    const clubId = event?.club?._id || event?.club?.id || null;

    // Fetch Existing Template
    const { data: template, isLoading: templateLoading, isError: templateError } = useQuery({
        queryKey: ["certificate-template", eventId],
        queryFn: () => getCertificateTemplate({ collegeId, clubId, eventId }),
        enabled: !!eventId && !!collegeId && !!event,
        retry: false // API returns 404 if no template exists
    });

    // Mutations
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["certificate-template", eventId] });

    const { mutate: handleSave, isPending: savePending } = useMutation({
        mutationFn: ({ data, bgFile }) => {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("pageSize", data.pageSize);
            formData.append("orientation", data.orientation);
            formData.append("textBlocks", JSON.stringify(data.textBlocks));
            if (bgFile) {
                formData.append("file", bgFile);
            }

            if (template) {
                return updateCertificateTemplate({ collegeId, clubId, eventId, formData });
            } else {
                return createCertificateTemplate({ collegeId, clubId, eventId, formData });
            }
        },
        onSuccess: () => {
            toast.success(template ? "Template updated successfully!" : "Certificate template created!");
            invalidate();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to save template");
        }
    });

    const { mutate: handleDelete, isPending: deletePending } = useMutation({
        mutationFn: () => deleteCertificateTemplate({ collegeId, clubId, eventId }),
        onSuccess: () => {
            toast.success("Certificate template deleted");
            invalidate();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete template");
        }
    });

    const onSave = (data, bgFile) => {
        handleSave({ data, bgFile });
    };

    const onDeleteClick = () => {
        if (window.confirm("Are you sure you want to delete this certificate template? Students will no longer be able to download certificates for this event.")) {
            handleDelete();
        }
    };

    if (eventLoading || (templateLoading && !templateError)) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Warming up the designer...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-16 z-20">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(`/events/${eventId}/manage`)} className="p-2 hover:bg-gray-100 rounded-full transition">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-lg font-black text-gray-900 leading-none truncate select-none">Certificate Designer</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 truncate">Event: {event?.title}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {template && (
                            <button
                                onClick={onDeleteClick}
                                disabled={deletePending}
                                className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition border border-red-100 shadow-sm"
                                title="Delete Template"
                            >
                                {deletePending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                        )}
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${template ? 'bg-green-50 border-green-100 text-green-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                            {template ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            {template ? 'Template Active' : 'No Template Set'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                {/* Intro Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Reward your participants</h2>
                                <p className="text-gray-500 font-bold text-sm">Automate certificate generation for every student who registers.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Issued certificates cannot be modified
                        </span>
                    </div>
                </div>

                <CertificateEditor
                    event={event}
                    initialData={template}
                    onSave={onSave}
                    isSaving={savePending}
                />
            </div>
        </div>
    );
}
