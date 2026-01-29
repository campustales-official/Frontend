import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2, Info, CheckCircle2, AlertCircle } from "lucide-react";

import { getEventDetails, registerForEvent, updateRegistration } from "../../api/events.api";
import { useMe } from "../../hooks/useMe";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function EventRegistrationPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: me } = useMe();

    // Fetch Event
    const { data: event, isLoading: isEventLoading } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventDetails(eventId),
        enabled: !!eventId
    });
    const { state } = useLocation();
    const editRegistration = state?.editRegistration;

    // Form State for dynamic answers
    // Map questionKey -> value
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        if (editRegistration?.answers) {
            const initialAnswers = {};
            editRegistration.answers.forEach(ans => {
                initialAnswers[ans.questionKey] = ans;
            });
            setAnswers(initialAnswers);
        }
    }, [editRegistration]);

    const { mutate: handleRegister, isPending } = useMutation({
        mutationFn: async () => {
            const formattedAnswers = Object.values(answers);

            if (editRegistration) {
                const regId = editRegistration.id || editRegistration._id || editRegistration.registrationId;
                return updateRegistration(regId, {
                    answers: formattedAnswers
                });
            }

            return registerForEvent({
                collegeId: me?.college?.id,
                clubId: event?.club?.id,
                eventId,
                answers: formattedAnswers,
                visibility: event?.visibility,
                isExternal: me?.roleInCollege === 'external'
            });
        },
        onSuccess: () => {
            const regId = editRegistration?.id || editRegistration?._id || editRegistration?.registrationId;
            toast.success(editRegistration ? "Registration updated!" : "Successfully registered!");
            queryClient.invalidateQueries({ queryKey: ["my-events"] });
            if (regId) queryClient.invalidateQueries({ queryKey: ["registration", regId] });

            if (editRegistration && regId) {
                navigate(`/my-registrations/${regId}`);
            } else {
                navigate(`/events/${eventId}`);
            }
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        }
    });

    if (isEventLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!event) return null; // Should handle not found better but assumed covered by Details page flow

    const questions = event.registrationQuestions || [];

    const handleAnswerChange = (key, value) => {
        setAnswers(prev => ({
            ...prev,
            [key]: {
                questionKey: key,
                answer: value
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required questions
        for (const q of questions) {
            const currentAnswer = answers[q.key]?.answer;
            if (q.required && (currentAnswer === undefined || currentAnswer === null || currentAnswer === "")) {
                toast.error(`Please answer "${q.label}"`);
                return;
            }
        }

        handleRegister();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 font-medium transition"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Event
                </button>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Header */}
                    <div className="bg-gray-900 px-8 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <h1 className="text-3xl font-bold text-white mb-2 relative z-10">
                            {editRegistration ? "Update Registration" : "Event Registration"}
                        </h1>
                        <p className="text-gray-400 font-medium relative z-10">
                            {editRegistration ? "Update your form responses below." : "Complete the form below to secure your spot."}
                        </p>
                    </div>

                    <div className="p-8">
                        {/* Event Summary */}
                        <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 mb-8">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                <img src={event.bannerImageUrl} alt={event.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{event.title}</h3>
                                <div className="text-sm text-gray-500">
                                    {new Date(event.eventStartAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* User Details Disclaimer (Auto Collected) */}
                            <section>
                                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-blue-600" />
                                    Your Details (Auto-Collected)
                                </h3>
                                <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 text-sm text-gray-600">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                                        {(event.requiredUserFields?.length ? event.requiredUserFields : ["name", "email", "identifier", "branch", "degree", "year", "yearOfAdmission", "passingYear"]).map(field => {
                                            let value = me?.[field];

                                            if (field === "identifier") {
                                                value = me?.identifiers?.student?.value;
                                            }

                                            let label = field.replace(/([A-Z])/g, ' $1').trim();
                                            if (field === "identifier") label = "Student ID";

                                            return (
                                                <div key={field} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                                                    <span className="block text-[10px] font-bold text-gray-400 mb-1 capitalize">{label}</span>
                                                    <div className="font-semibold text-gray-900 text-sm break-words leading-tight" title={value}>
                                                        {value || "Not set"}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-start gap-2 text-[11px] text-gray-500">
                                        <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                                        <p>
                                            These details are automatically linked from your profile.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Dynamic Questions */}
                            {questions.length > 0 && (
                                <section className="space-y-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Event Questions</h3>

                                    {questions.map((q) => (
                                        <div key={q.key} className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700">
                                                {q.label} {q.required && <span className="text-red-500">*</span>}
                                            </label>

                                            {/* Text & Number */}
                                            {(q.type === 'text' || q.type === 'number') && (
                                                <input
                                                    type={q.type}
                                                    required={q.required}
                                                    value={answers[q.key]?.answer || ""}
                                                    onChange={(e) => handleAnswerChange(q.key, e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition"
                                                    placeholder="Your answer"
                                                />
                                            )}

                                            {/* Textarea */}
                                            {q.type === 'textarea' && (
                                                <textarea
                                                    required={q.required}
                                                    rows={3}
                                                    value={answers[q.key]?.answer || ""}
                                                    onChange={(e) => handleAnswerChange(q.key, e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition resize-none"
                                                    placeholder="Type your answer here..."
                                                />
                                            )}

                                            {/* Dropdown */}
                                            {q.type === 'dropdown' && (
                                                <div className="relative">
                                                    <select
                                                        required={q.required}
                                                        value={answers[q.key]?.answer || ""}
                                                        onChange={(e) => handleAnswerChange(q.key, e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition appearance-none bg-white"
                                                    >
                                                        <option value="">Select an option</option>
                                                        {q.options?.map((opt, idx) => (
                                                            <option key={idx} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {/* File Upload */}
                                            {q.type === 'file' && (
                                                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 text-center hover:bg-gray-100 transition cursor-pointer"
                                                    onClick={() => document.getElementById(`file-${q.key}`).click()}>

                                                    {answers[q.key]?.answer ? (
                                                        <div className="flex items-center justify-between pointer-events-none">
                                                            <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                                                {answers[q.key].answer.name}
                                                            </span>
                                                            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">Selected</span>
                                                        </div>
                                                    ) : (
                                                        <div className="pointer-events-none">
                                                            <span className="text-sm font-medium text-gray-500">Click to upload file</span>
                                                            <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
                                                        </div>
                                                    )}

                                                    <input
                                                        id={`file-${q.key}`}
                                                        type="file"
                                                        required={q.required}
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                if (file.size > 10 * 1024 * 1024) {
                                                                    toast.error("File size must be less than 10MB");
                                                                    e.target.value = null; // Reset
                                                                    return;
                                                                }
                                                                handleAnswerChange(q.key, file);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* Submit */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {editRegistration ? "Updating..." : "Registering..."}
                                        </>
                                    ) : (
                                        <>
                                            {editRegistration ? "Update Registration" : "Confirm Registration"}
                                            <CheckCircle2 className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Double-check your information before confirming.
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
