import { useState, useEffect } from "react";
import {
    Info, Calendar, MapPin, Eye, Upload, Plus,
    Trash2, ChevronDown, CheckCircle2, AlertCircle,
    Type, AlignLeft, Hash, List, FileText, Award, X
} from "lucide-react";
import { useMe } from "../../hooks/useMe";
import { toast } from "react-toastify";

const QUESTION_TYPES = [
    { value: "text", label: "Short Text", icon: Type },
    { value: "textarea", label: "Long Text", icon: AlignLeft },
    { value: "number", label: "Number", icon: Hash },
    { value: "dropdown", label: "Dropdown", icon: List },
    { value: "file", label: "File Upload", icon: FileText },
];

const VISIBILITY_OPTIONS = [
    { value: "global", label: "Public (Open to All)" },
    { value: "college", label: "College Only" },
    { value: "club", label: "Club Only" },
];

const REQUIRED_USER_FIELDS = [
    { value: "name", label: "Full Name", description: "Student's full name" },
    { value: "email", label: "Email", description: "College email address" },
    { value: "identifier", label: "Student ID", description: "Roll No. / Enrollment / Scholar ID" },
    { value: "branch", label: "Branch", description: "e.g. Computer Science, Mechanical" },
    { value: "degree", label: "Degree", description: "e.g. B.Tech, M.Tech, MBA" },
    // { value: "semester", label: "Semester", description: "Current semester" },
    { value: "year", label: "Year", description: "Current year of study" },
    { value: "yearOfAdmission", label: "Year of Admission", description: "When they joined" },
    { value: "passingYear", label: "Passing Year", description: "Expected graduation" },
];

export default function EventFormBase({
    initialData = {},
    onSubmit,
    id = "event-form",
    isSubmitting = false
}) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        venue: "",
        visibility: "college",
        eventStartAt: "",
        eventEndAt: "",
        registrationStartAt: "",
        registrationEndAt: "",
        capacity: "",
        allowWaitlist: false,
        requiredUserFields: [],
        registrationQuestions: []
    });

    const [banner, setBanner] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const { data: me } = useMe();
    const [isLoaded, setIsLoaded] = useState(false);

    // Track raw text for options so commas don't break typing
    const [optionsText, setOptionsText] = useState({});

    // Unified Initialization: Load draft or initialData
    useEffect(() => {
        if (!me?.id) return; // Wait for user info

        const isEditing = initialData?.id || initialData?._id;

        // 1. If Editing, always trust initialData from server
        if (isEditing) {
            setFormData({
                title: initialData.title || "",
                description: initialData.description || "",
                venue: initialData.venue || "",
                visibility: initialData.visibility || "college",
                eventStartAt: initialData.eventStartAt ? new Date(initialData.eventStartAt).toISOString().slice(0, 16) : "",
                eventEndAt: initialData.eventEndAt ? new Date(initialData.eventEndAt).toISOString().slice(0, 16) : "",
                registrationStartAt: initialData.registrationStartAt ? new Date(initialData.registrationStartAt).toISOString().slice(0, 16) : "",
                registrationEndAt: initialData.registrationEndAt ? new Date(initialData.registrationEndAt).toISOString().slice(0, 16) : "",
                capacity: initialData.capacity || "",
                allowWaitlist: !!initialData.allowWaitlist,
                requiredUserFields: initialData.requiredUserFields || [],
                registrationQuestions: initialData.registrationQuestions || []
            });
            if (initialData.bannerImageUrl) {
                setBannerPreview(initialData.bannerImageUrl);
            }
        }
        // 2. If Creating, try loading draft first
        else {
            const saved = localStorage.getItem(`event_draft_${me.id}`);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setFormData(prev => ({ ...prev, ...parsed }));

                    // Pre-fill optionsText for dropdowns
                    const initialOptionsText = {};
                    parsed.registrationQuestions?.forEach(q => {
                        if (q.type === 'dropdown' && q.options) {
                            initialOptionsText[q.key] = q.options.join(", ");
                        }
                    });
                    setOptionsText(initialOptionsText);
                } catch (e) {
                    console.error("Failed to parse event draft", e);
                }
            }
        }

        setIsLoaded(true);
    }, [me?.id, initialData]);

    // Save draft on change (only for new events)
    useEffect(() => {
        const isEditing = initialData?.id || initialData?._id;

        // CRITICAL: Check isSubmitting to prevent re-saving draft after it was cleared in onSuccess
        if (me?.id && isLoaded && !isEditing && !isSubmitting) {
            const draftKey = `event_draft_${me.id}`;
            localStorage.setItem(draftKey, JSON.stringify(formData));
        }
    }, [formData, me?.id, isLoaded, initialData, isSubmitting]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBanner(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const addQuestion = () => {
        const newQuestion = {
            key: `q_${Date.now()}`,
            label: "",
            type: "text",
            required: false,
            options: []
        };
        setFormData(prev => ({
            ...prev,
            registrationQuestions: [...prev.registrationQuestions, newQuestion]
        }));
    };

    const removeQuestion = (key) => {
        setFormData(prev => ({
            ...prev,
            registrationQuestions: prev.registrationQuestions.filter(q => q.key !== key)
        }));
    };

    const updateQuestion = (key, field, value) => {
        setFormData(prev => ({
            ...prev,
            registrationQuestions: prev.registrationQuestions.map(q =>
                q.key === key ? { ...q, [field]: value } : q
            )
        }));
    };

    const handleOptionsChange = (key, text) => {
        setOptionsText(prev => ({ ...prev, [key]: text }));
        const optionsArray = text.split(",").map(o => o.trim()).filter(o => o);
        updateQuestion(key, "options", optionsArray);
    };

    const toggleUserField = (fieldValue) => {
        setFormData(prev => {
            const current = prev.requiredUserFields;
            const isSelected = current.includes(fieldValue);
            return {
                ...prev,
                requiredUserFields: isSelected
                    ? current.filter(f => f !== fieldValue)
                    : [...current, fieldValue]
            };
        });
    };

    const handleFormSubmit = (e) => {
        e?.preventDefault();
        const data = new FormData();

        Object.keys(formData).forEach(key => {
            if (key === "registrationQuestions") {
                data.append(key, JSON.stringify(formData[key]));
            } else if (key === "requiredUserFields") {
                // Send as JSON array
                data.append(key, JSON.stringify(formData[key]));
            } else if (formData[key] !== "" && formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        if (banner) {
            data.append("banner", banner);
        }

        onSubmit(data);
    };

    return (
        <form id={id} onSubmit={handleFormSubmit} className="max-w-6xl mx-auto px-4 py-8 pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-8">

                    {/* Basic Information */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-gray-900">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-600" />
                            <h2 className="font-bold">Basic Information</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
                                <input
                                    type="text" name="title" value={formData.title} onChange={handleChange} required
                                    placeholder="e.g. Annual Tech Symposium 2024"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description" value={formData.description} onChange={handleChange} required rows="5"
                                    placeholder="Describe your event, agenda, and what participants can expect..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Venue</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text" name="venue" value={formData.venue} onChange={handleChange} required
                                            placeholder="e.g. Grand Auditorium, Block C"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Visibility</label>
                                    <div className="relative">
                                        <Eye className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <select
                                            name="visibility" value={formData.visibility} onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition appearance-none bg-white"
                                        >
                                            {VISIBILITY_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Date & Time */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-gray-900">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <h2 className="font-bold">Date & Time</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Event Timing</p>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Starts</label>
                                        <input
                                            type="datetime-local" name="eventStartAt" value={formData.eventStartAt} onChange={handleChange} required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Ends</label>
                                        <input
                                            type="datetime-local" name="eventEndAt" value={formData.eventEndAt} onChange={handleChange} required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 border-t md:border-t-0 md:border-l md:pl-8 pt-6 md:pt-0">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registration Period</p>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Opens</label>
                                        <input
                                            type="datetime-local" name="registrationStartAt" value={formData.registrationStartAt} onChange={handleChange} required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Closes</label>
                                        <input
                                            type="datetime-local" name="registrationEndAt" value={formData.registrationEndAt} onChange={handleChange} required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Capacity Section */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-gray-900">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <h2 className="font-bold">Capacity & Settings</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-wrap items-end gap-6">
                                <div className="w-full md:w-48">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Capacity</label>
                                    <input
                                        type="number" name="capacity" value={formData.capacity} onChange={handleChange}
                                        placeholder="No limit"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition text-gray-900"
                                    />
                                </div>
                                <label className="flex items-center gap-3 py-3 px-5 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition select-none">
                                    <input
                                        type="checkbox" name="allowWaitlist" checked={formData.allowWaitlist} onChange={handleChange}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">Allow Waitlist</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Basic Registration Details */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-gray-900">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-600" />
                            <h2 className="font-bold">Basic Registration Details</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-4">Select which user profile fields are required during registration.</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {REQUIRED_USER_FIELDS.map(field => {
                                    const isSelected = formData.requiredUserFields.includes(field.value);
                                    return (
                                        <button
                                            key={field.value}
                                            type="button"
                                            onClick={() => toggleUserField(field.value)}
                                            className={`p-3 rounded-xl border-2 text-left transition ${isSelected
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-100 bg-gray-50/50 text-gray-600 hover:border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-bold">{field.label}</span>
                                                {isSelected && (
                                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-400 leading-tight">{field.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Questions Builder */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-gray-900">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <List className="w-5 h-5 text-blue-600" />
                                <h2 className="font-bold">Registration Questions</h2>
                            </div>
                            <button
                                type="button" onClick={addQuestion}
                                className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                            >
                                <Plus className="w-4 h-4" /> Add Question
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {formData.registrationQuestions.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                                    <p className="text-gray-400 text-sm">No custom questions added yet.</p>
                                </div>
                            ) : (
                                formData.registrationQuestions.map((q) => (
                                    <div key={q.key} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 group relative transition hover:border-blue-200">
                                        <button
                                            type="button" onClick={() => removeQuestion(q.key)}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-red-100 text-red-500 rounded-full shadow-sm items-center justify-center hidden group-hover:flex hover:bg-red-50 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-gray-900">
                                            <div className="lg:col-span-8">
                                                <input
                                                    type="text" value={q.label} onChange={(e) => updateQuestion(q.key, "label", e.target.value)}
                                                    placeholder="Question Label (e.g. T-Shirt Size)"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-blue-500 outline-none text-sm transition font-medium"
                                                />
                                            </div>
                                            <div className="lg:col-span-4">
                                                <select
                                                    value={q.type} onChange={(e) => updateQuestion(q.key, "type", e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-blue-500 outline-none text-sm appearance-none"
                                                >
                                                    {QUESTION_TYPES.map(type => (
                                                        <option key={type.value} value={type.value}>{type.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <div className={`w-10 h-5 rounded-full relative transition ${q.required ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                                    <input
                                                        type="checkbox" checked={q.required} onChange={(e) => updateQuestion(q.key, "required", e.target.checked)}
                                                        className="hidden"
                                                    />
                                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${q.required ? 'left-5.5' : 'left-0.5'}`}></div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Required Field</span>
                                            </label>

                                            {q.type === 'dropdown' && (
                                                <div className="flex-1 ml-6">
                                                    <input
                                                        type="text"
                                                        placeholder="Options (comma separated)"
                                                        value={optionsText[q.key] ?? q.options.join(", ")}
                                                        onChange={(e) => handleOptionsChange(q.key, e.target.value)}
                                                        className="w-full px-3 py-1.5 rounded-lg border border-gray-100 bg-white text-xs text-gray-900 outline-none focus:border-blue-400"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-8">

                    {/* Event Banner */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-gray-900">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                            <h2 className="font-bold">Event Banner</h2>
                        </div>
                        <div className="p-6">
                            <div
                                className="aspect-[16/9] w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer group overflow-hidden relative"
                                onClick={() => document.getElementById("bannerInput").click()}
                            >
                                {bannerPreview ? (
                                    <img src={bannerPreview} className="w-full h-full object-cover" alt="Banner Preview" />
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3 text-gray-400 group-hover:text-blue-500 transition">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-700">Upload Banner</p>
                                        <p className="text-xs text-gray-400 mt-1">1200x675px recommended</p>
                                    </div>
                                )}
                                <input
                                    id="bannerInput" type="file" className="hidden" accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Certificate Notice */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-gray-900 group">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold flex items-center gap-2">
                                <Award className="w-5 h-5 text-purple-600" /> Certificates
                            </h2>
                        </div>
                        <div className="p-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-6">
                                Reward your participants with custom digital certificates.
                            </p>

                            {initialData?.id || initialData?._id ? (
                                <a
                                    href={`/events/${initialData.id || initialData._id}/certificate-template`}
                                    className="w-full py-3 bg-purple-50 text-purple-600 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-100 transition flex items-center justify-center gap-2 border border-purple-100"
                                >
                                    Open Designer <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                                </a>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                    You can design certificates from the "Manage Event" dashboard after saving this event.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Tips Section */}
                    <section className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Organizer Tips
                        </h3>
                        <ul className="text-sm space-y-4 opacity-90">
                            <li className="flex gap-3">
                                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-[10px] font-bold">1</span>
                                <p>Use a high-quality banner to increase engagement.</p>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-[10px] font-bold">2</span>
                                <p>Clearly state the registration deadline.</p>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </form>
    );
}
