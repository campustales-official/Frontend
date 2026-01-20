import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    ArrowLeft, ChevronLeft, ChevronRight, User, Mail,
    BookOpen, GraduationCap, Calendar, Hash, Clock,
    CheckCircle2, XCircle, FileText, Download, ExternalLink, Loader2, School
} from "lucide-react";
import { useMe } from "../../hooks/useMe";
import { getRegistrationDetails, getEventDetails } from "../../api/events.api";

export default function RegistrationDetailPage() {
    const navigate = useNavigate();
    const { eventId, registrationId } = useParams();
    const { state } = useLocation();
    const { data: me } = useMe();
    const collegeId = me?.college?.id;

    // Prev/Next logic from state
    const registrationIds = state?.registrationIds || [];
    const currentIndex = registrationIds.indexOf(registrationId);

    const { data: event } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventDetails(eventId),
        enabled: !!eventId
    });

    const { data: reg, isLoading, isError } = useQuery({
        queryKey: ["registration", registrationId],
        queryFn: () => getRegistrationDetails({
            collegeId,
            clubId: state?.clubId,
            eventId,
            registrationId
        }),
        enabled: !!registrationId && !!collegeId
    });

    const handleNavigate = (direction) => {
        const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex < 0) {
            toast.info("Reached beginning of the list");
            return;
        }
        if (nextIndex >= registrationIds.length) {
            toast.info("Reached end of the list");
            return;
        }

        const nextId = registrationIds[nextIndex];
        navigate(`/events/${eventId}/registrations/${nextId}`, {
            state: { ...state }
        });
    };

    const getQuestionLabel = (questionKey) => {
        // Find the question in event data using the key from registration data
        const question = event?.registrationQuestions?.find(q => q.key === questionKey);
        // Return the 'label' from the event model
        return question?.label || `Question (${questionKey})`;
    };

    // CRITICAL: We MUST wait for !event data to load, otherwise the lookup above will fail and show the key
    if (isLoading || !event) return <div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
    if (isError) return <div className="p-10 text-center font-bold text-red-500 bg-gray-50 h-screen">Registration details not found.</div>;

    const user = reg.user;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft className="w-5 h-5" /></button>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 leading-none">Participant Profile</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Event: {reg.event.title}</p>
                        </div>
                    </div>

                    {registrationIds.length > 0 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleNavigate('prev')}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors border border-gray-100"
                                title="Previous Candidate"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-xs font-black text-gray-400 tabular-nums">
                                {currentIndex + 1} / {registrationIds.length}
                            </span>
                            <button
                                onClick={() => handleNavigate('next')}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors border border-gray-100"
                                title="Next Candidate"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-8 space-y-8">

                {/* Status Banner */}
                <div className={`p-4 rounded-2xl flex items-center justify-between ${reg.status === 'registered' ? 'bg-blue-50 border border-blue-100 text-blue-700' :
                    reg.status === 'confirmed' ? 'bg-green-50 border border-green-100 text-green-700' :
                        'bg-gray-100 border border-gray-200 text-gray-700'
                    }`}>
                    <div className="flex items-center gap-3">
                        {reg.status === 'confirmed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        <span className="text-sm font-black uppercase tracking-wider">Status: {reg.status}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold opacity-60">
                        <Hash className="w-3 h-3" /> ID: {registrationId}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / Profile Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-3xl mx-auto mb-4 ring-4 ring-white shadow-xl shadow-blue-500/10">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">{user.name}</h2>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Student Participant</p>

                            <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Email Address</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Registered On</p>
                                        <p className="text-sm font-bold text-gray-900">{new Date(reg.registeredAt).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400">
                                        <School className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">College / Institution</p>
                                        <p className="text-sm font-bold text-gray-900 leading-tight">{reg.collegeName || "Not specified"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden relative group">
                            <div className={`p-4 rounded-2xl flex items-center gap-4 transition-colors ${reg.attended ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                                <CheckCircle2 className={`w-6 h-6 ${reg.attended ? 'text-green-600' : 'text-gray-300'}`} />
                                <div>
                                    <p className="text-sm font-black leading-none">Attendance</p>
                                    <p className="text-[10px] font-bold mt-1 uppercase tracking-wider">{reg.attended ? 'MARKED AS PRESENT' : 'NOT CHECKED-IN'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Info - Tubular Layout */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Academic Details Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-600" /> Academic Information
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                <DataRow icon={GraduationCap} label="Degree & Branch" value={`${user.degree} in ${user.branch}`} />
                                <DataRow icon={Hash} label="Academic Year" value={`Year ${user.year} (Sem ${user.semester})`} />
                                <DataRow icon={Calendar} label="Batch" value={`Admission: ${user.yearOfAdmission} | Passing: ${user.passingYear}`} />
                            </div>
                        </div>

                        {/* Custom Form Answers Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-purple-600" /> Registration Form Responses
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {reg.answers && reg.answers.length > 0 ? (
                                    reg.answers.map((ans, idx) => (
                                        <div key={idx} className="p-8 group hover:bg-gray-50/50 transition-colors">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                                {getQuestionLabel(ans.questionKey)}
                                            </p>
                                            <div className="text-gray-900 font-bold whitespace-pre-wrap leading-relaxed">
                                                {ans.answer.startsWith('http') ? (
                                                    <div className="mt-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between border-dashed">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                                                <Download className="w-5 h-5" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-black text-gray-900 truncate">File Attachment</p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">DOCUMENT/IMAGE</p>
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
                                    <div className="p-12 text-center text-gray-400 italic">No additional questions were asked for this event.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DataRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-6 p-8 group hover:bg-gray-50/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400 group-hover:text-blue-600 group-hover:border-blue-100 group-hover:bg-blue-50 transition-all shrink-0">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-base font-bold text-gray-900 leading-tight">{value}</p>
            </div>
        </div>
    );
}
