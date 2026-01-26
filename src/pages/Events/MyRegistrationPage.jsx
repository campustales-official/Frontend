import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    ArrowLeft, User, Mail,
    BookOpen, GraduationCap, Calendar, Hash, Clock,
    CheckCircle2, FileText, Download, ExternalLink, Loader2, School,
    Pencil, Trash2, AlertTriangle, Award
} from "lucide-react";
import { useMe } from "../../hooks/useMe";
import { getRegistrationDetails, getEventDetails, cancelRegistration, getCertificateDownloadUrl } from "../../api/events.api";

export default function MyRegistrationPage() {
    const navigate = useNavigate();
    const { registrationId } = useParams();
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const collegeId = me?.college?.id;

    // We need eventId to fetch details, but the registrationId is what we have.
    // Assuming the API returns enough info to get eventId if we fetch registration first.
    // Or we rely on the feed giving us registrationId.

    const { data: reg, isLoading: regLoading, isError } = useQuery({
        queryKey: ["registration", registrationId],
        queryFn: () => getRegistrationDetails({
            registrationId
        }),
        enabled: !!registrationId
    });

    const eventId = reg?.event?.id;

    const { data: event, isLoading: eventLoading } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventDetails(eventId),
        enabled: !!eventId
    });

    const isRegistrationClosed = (event?.status === 'published' && event?.registrationEndAt) ? new Date(event.registrationEndAt) < new Date() : false;

    const { mutate: handleCancel, isPending: cancelPending } = useMutation({
        mutationFn: () => cancelRegistration(registrationId),
        onSuccess: () => {
            toast.success("Registration cancelled successfully");
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            navigate("/events");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to cancel registration");
        }
    });

    const onCancelClick = () => {
        if (window.confirm("Are you sure you want to cancel your registration for this event? This action cannot be undone.")) {
            handleCancel();
        }
    };

    const getQuestionLabel = (questionKey) => {
        const question = event?.registrationQuestions?.find(q => q.key === questionKey);
        return question?.label || `Question (${questionKey})`;
    };

    if (regLoading || (eventId && eventLoading)) {
        return <div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
    }

    if (isError || !reg) {
        return <div className="p-10 text-center font-bold text-red-500 bg-gray-50 h-screen">Registration details not found.</div>;
    }

    const user = reg.user;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-16 z-20">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/events")} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft className="w-5 h-5" /></button>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 leading-none">My Submission</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Event: {reg.event.title}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isRegistrationClosed && (
                            <button
                                onClick={() => navigate(`/events/${eventId}/register`, { state: { editRegistration: reg } })}
                                className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-800 transition shadow-lg active:scale-95"
                            >
                                <Pencil className="w-3.5 h-3.5" /> Edit Details
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-8 space-y-8">

                {/* Status Banner */}
                <div className={`p-4 rounded-2xl flex items-center justify-between ${reg.status === 'registered' ? 'bg-blue-50 border border-blue-100 text-blue-700' :
                    reg.status === 'confirmed' ? 'bg-green-50 border border-green-100 text-green-700' :
                        'bg-gray-200 border border-gray-300 text-gray-700'
                    }`}>
                    <div className="flex items-center gap-3">
                        {reg.status === 'confirmed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        <span className="text-sm font-black uppercase tracking-wider">Status: {reg.status}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold opacity-60 uppercase tracking-widest">
                        <Hash className="w-3 h-3" /> Booking ID: {registrationId.slice(-8).toUpperCase()}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / Profile Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-3xl mx-auto mb-4 ring-4 ring-white shadow-xl shadow-blue-500/10">
                                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "U"}
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">{user?.name || "Anonymous"}</h2>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">{user?.degree || ""} {user?.branch || ""}</p>

                            <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Registered Email</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{user?.email || "No email"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400">
                                        <School className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Institution</p>
                                        <p className="text-sm font-bold text-gray-900 leading-tight">{reg.collegeName || "Not specified"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        {!isRegistrationClosed && (
                            <div className="bg-red-50 rounded-3xl border border-red-100 p-6 sm:block hidden">
                                <h3 className="text-xs font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Danger Zone
                                </h3>
                                <p className="text-[11px] text-red-500 font-bold leading-relaxed mb-4">
                                    If you can no longer attend this event, please cancel your registration to open up space for others.
                                </p>
                                <button
                                    onClick={onCancelClick}
                                    disabled={cancelPending}
                                    className="w-full bg-white border border-red-200 text-red-600 font-bold py-2.5 rounded-xl text-xs hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                                >
                                    {cancelPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                    Cancel Registration
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Main Info - Tubular Layout */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Submitted Details Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" /> Submitted Details
                                </h3>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-2 gap-6">
                                    {(() => {
                                        const fieldLabels = {
                                            name: "Full Name",
                                            email: "Email",
                                            identifier: "Student ID",
                                            branch: "Branch",
                                            degree: "Degree",
                                            year: "Year",
                                            yearOfAdmission: "Admission Year",
                                            passingYear: "Passing Year"
                                        };

                                        // Fields to show: required ones + Institution (always relevant)
                                        const fieldsToShow = event?.requiredUserFields?.length
                                            ? event.requiredUserFields
                                            : ["name", "email", "identifier", "branch", "degree", "year", "yearOfAdmission", "passingYear"];

                                        const items = fieldsToShow.map(key => ({
                                            label: fieldLabels[key] || key.replace(/([A-Z])/g, ' $1').trim(),
                                            value: user?.[key],
                                            key
                                        }));

                                        // Add Institution separately as it's common
                                        items.push({ label: "Institution", value: reg.collegeName, key: "college" });

                                        return items.map((item, idx) => (
                                            <div key={item.key} className={`${item.key === 'name' || item.key === 'email' ? 'col-span-2' : ''}`}>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                                <p className="text-sm font-bold text-gray-900 break-words">{item.value || "Not set"}</p>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        </div>
                        {/* Custom Form Answers Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-purple-600" /> Your Responses
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {reg.answers && reg.answers.length > 0 ? (
                                    reg.answers.map((ans, idx) => (
                                        <div key={idx} className="p-8 group hover:bg-gray-50/50 transition-colors">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                {getQuestionLabel(ans.questionKey)}
                                            </p>
                                            <div className="text-gray-900 font-bold whitespace-pre-wrap leading-relaxed">
                                                {typeof ans.answer === 'string' && ans.answer.startsWith('http') ? (
                                                    <div className="mt-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between border-dashed">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                                                <Download className="w-5 h-5" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-black text-gray-900 truncate">Uploaded File</p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">VIEW ONLINE</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 shrink-0">
                                                            <a href={ans.answer} target="_blank" rel="noopener noreferrer"
                                                                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all flex items-center gap-2">
                                                                View <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    ans.answer
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-gray-500 font-bold italic">No custom details were submitted.</div>
                                )}
                            </div>
                        </div>

                        {/* Extra help card */}
                        {(!isRegistrationClosed || reg.certificateId) && (
                            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                                {reg.certificateId ? (
                                    <>
                                        <h3 className="text-lg font-black mb-2 relative z-10 flex items-center gap-2">
                                            <Award className="w-6 h-6" /> Congratulations!
                                        </h3>
                                        <p className="text-sm font-bold text-blue-100 leading-relaxed mb-6 relative z-10">
                                            Your participation has been recognized. You can now download your digital certificate.
                                        </p>
                                        <a
                                            href={getCertificateDownloadUrl(reg.certificateId)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition relative z-10 shadow-lg"
                                        >
                                            <Download className="w-4 h-4" /> Download Certificate
                                        </a>
                                    </>
                                ) : (
                                    <div>
                                        <h3 className="text-lg font-black mb-2 relative z-10">Need to make changes?</h3>
                                        <p className="text-sm font-bold text-blue-100 leading-relaxed mb-6 relative z-10">
                                            You can update your registration details at any time before the registration period ends.
                                            Your profile details are synced automatically.
                                        </p>

                                        <button
                                            onClick={() => navigate(`/events/${eventId}/register`, { state: { editRegistration: reg } })}
                                            className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition relative z-10 shadow-lg"
                                        >
                                            Update Registration
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Danger Zone */}
                {!isRegistrationClosed && (
                    <div className="bg-red-50 rounded-3xl border border-red-100 p-6 block sm:hidden">
                        <h3 className="text-xs font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5" /> Danger Zone
                        </h3>
                        <p className="text-[11px] text-red-500 font-bold leading-relaxed mb-4">
                            If you can no longer attend this event, please cancel your registration to open up space for others.
                        </p>
                        <button
                            onClick={onCancelClick}
                            disabled={cancelPending}
                            className="w-full bg-white border border-red-200 text-red-600 font-bold py-2.5 rounded-xl text-xs hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                        >
                            {cancelPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            Cancel Registration
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
