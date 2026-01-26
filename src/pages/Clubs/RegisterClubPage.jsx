import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerClub } from "../../api/clubs.api";
import { useMe } from "../../hooks/useMe";
import {
    ArrowLeft, Plus, X, Info, Instagram, Linkedin,
    Globe, Twitter, Facebook, Mail, ShieldAlert, Rocket,
    User, Calendar, Hash, Upload, ImageIcon, Loader2
} from "lucide-react";
import { toast } from "react-toastify";

export default function RegisterClubPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const collegeId = me?.college?.id;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        tags: [],
        availablePositions: [],
        establishedYear: "",
        isOfficial: true,
        facultyAdvisor: {
            name: "",
            email: ""
        },
        socialLinks: {
            instagram: "",
            linkedin: "",
            website: "",
            twitter: "",
            facebook: "",
            email: ""
        }
    });

    // Load draft on mount
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (me?.id) {
            const saved = localStorage.getItem(`draft_club_reg_${me?.id}`);
            if (saved) {
                try {
                    setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
                } catch (e) {
                    console.error("Failed to parse draft", e);
                }
            }
            setIsLoaded(true);
        }
    }, [me?.id]);

    // Save draft on change
    useEffect(() => {
        if (me?.id && isLoaded) {
            localStorage.setItem(`draft_club_reg_${me?.id}`, JSON.stringify(formData));
        }
    }, [formData, me?.id, isLoaded]);

    const [tagInput, setTagInput] = useState("");
    const [positionInput, setPositionInput] = useState("");

    const [files, setFiles] = useState({ logo: null, cover: null });
    const [logoPreview, setLogoPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [type]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'logo') setLogoPreview(reader.result);
                else setCoverPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const { mutate: handleRegister, isPending } = useMutation({
        mutationFn: (data) => registerClub({ collegeId, data }),
        onSuccess: () => {
            toast.success("Club registration submitted successfully!");
            localStorage.removeItem(`draft_club_reg_${me?.id}`);
            queryClient.invalidateQueries({ queryKey: ["clubs", collegeId] });
            navigate("/clubs");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to submit club registration");
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith("facultyAdvisor.")) {
            const field = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                facultyAdvisor: { ...prev.facultyAdvisor, [field]: value }
            }));
        } else if (name.startsWith("socialLinks.")) {
            const field = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, [field]: value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        }
    };

    const addTag = () => {
        if (tagInput.trim()) {
            const newTags = tagInput.split(',').map(t => t.trim()).filter(t => t && !formData.tags.includes(t));
            if (newTags.length > 0) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, ...newTags] }));
                setTagInput("");
            }
        }
    };

    const removeTag = (t) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== t) }));
    };

    const addPosition = () => {
        if (positionInput.trim()) {
            const newPositions = positionInput.split(',').map(p => p.trim()).filter(p => p && !formData.availablePositions.includes(p));
            if (newPositions.length > 0) {
                setFormData(prev => ({ ...prev, availablePositions: [...prev.availablePositions, ...newPositions] }));
                setPositionInput("");
            }
        }
    };

    const removePosition = (p) => {
        setFormData(prev => ({ ...prev, availablePositions: prev.availablePositions.filter(pos => pos !== p) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.name || !formData.description || !formData.category || !formData.facultyAdvisor.name || !formData.facultyAdvisor.email) {
            toast.warning("Please fill in all important fields.");
            return;
        }

        const data = new FormData();

        // Append simple fields
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("establishedYear", formData.establishedYear);
        data.append("isOfficial", formData.isOfficial);

        // Append Arrays
        formData.tags.forEach(t => data.append("tags", t));
        formData.availablePositions.forEach(p => data.append("availablePositions", p));

        // Append Objects (backend expects JSON string or flat fields? using JSON string as per RegisterCollege pattern)
        data.append("facultyAdvisor", JSON.stringify(formData.facultyAdvisor));
        data.append("socialLinks", JSON.stringify(formData.socialLinks));

        // Append Files
        if (files.logo) data.append("logo", files.logo);
        if (files.cover) data.append("coverImage", files.cover);

        handleRegister(data);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-none">Register New Club</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Start a community at {me?.college?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
                {/* Verification Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest leading-none mt-1">Manual Verification Required</h3>
                        <p className="text-xs font-bold text-amber-700/80 mt-2 leading-relaxed">
                            Every club registration must be manually verified and approved by the college authorities.
                            Your club will not be visible to other students until it has been reviewed and cleared.
                        </p>
                    </div>
                </div>
                {/* Visuals Section */}
                <section className="bg-white rounded-2xl border p-6 shadow-sm overflow-hidden">
                    <h2 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-500" /> Visual Identity
                    </h2>

                    <div className="space-y-6">
                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Cover Image</label>
                            <div
                                className="relative aspect-[4/1] h-auto w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer group overflow-hidden"
                                onClick={() => document.getElementById('coverInput').click()}
                            >
                                {coverPreview ? (
                                    <img src={coverPreview} className="w-full h-full object-cover" alt="Cover" />
                                ) : (
                                    <div className="text-center">
                                        <div className="bg-white p-3 rounded-full shadow-sm mb-2 inline-block"><Upload className="w-5 h-5 text-gray-400" /></div>
                                        <p className="text-sm text-gray-500 font-medium">Click to upload cover image</p>
                                        <p className="text-xs text-gray-400 mt-1">4:1 aspect ratio (e.g. 1600×400)</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <p className="text-white font-bold flex items-center gap-2">Change Cover <Upload className="w-4 h-4" /></p>
                                </div>
                                <input id="coverInput" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                            </div>
                        </div>

                        {/* Logo */}
                        <div className="flex items-end gap-6">
                            <div
                                className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer group shrink-0 overflow-hidden"
                                onClick={() => document.getElementById('logoInput').click()}
                            >
                                {logoPreview ? (
                                    <img src={logoPreview} className="w-full h-full object-cover" alt="Logo" />
                                ) : (
                                    <Upload className="w-6 h-6 text-gray-300" />
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-white" />
                                </div>
                                <input id="logoInput" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                            </div>
                            <div className="space-y-1 pb-1">
                                <h3 className="font-bold text-gray-900">Club Logo</h3>
                                <p className="text-xs text-gray-500 max-w-sm">Upload a square image. This will be displayed in the club list and dashboard.</p>
                                <button type="button" onClick={() => document.getElementById('logoInput').click()} className="text-sm text-blue-600 font-bold hover:underline">Change Logo</button>
                            </div>
                        </div>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Important Information */}
                    <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Info className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Important Information</h2>
                                <p className="text-xs font-bold text-gray-400">Required fields to initiate verification</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Club Name *</label>
                                <input
                                    type="text" name="name" value={formData.name} onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-bold"
                                    placeholder="e.g., Technical Coding Club"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description *</label>
                                <textarea
                                    name="description" value={formData.description} onChange={handleChange} rows="4"
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-medium resize-none"
                                    placeholder="What is the purpose of this club?"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category *</label>
                                <input
                                    type="text" name="category" value={formData.category} onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-bold"
                                    placeholder="e.g., Technical, Cultural"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Established Year *</label>
                                <div className="relative">
                                    <input
                                        type="number" name="establishedYear" value={formData.establishedYear} onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-bold pr-12"
                                        placeholder="e.g., 2024"
                                        required
                                    />
                                    <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">Official Club Status</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-0.5">Is this club officially recognized by the college?</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox" name="isOfficial" checked={formData.isOfficial}
                                            onChange={handleChange} className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Faculty Advisor */}
                    <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Faculty Advisor</h2>
                                <p className="text-xs font-bold text-gray-400">Verifying authority for the club</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Advisor Name *</label>
                                <input
                                    type="text" name="facultyAdvisor.name" value={formData.facultyAdvisor.name} onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-bold"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Advisor Email *</label>
                                <div className="relative">
                                    <input
                                        type="email" name="facultyAdvisor.email" value={formData.facultyAdvisor.email} onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-bold pr-12"
                                        placeholder="advisor@college.edu"
                                        required
                                    />
                                    <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Taxonomy & Structure */}
                    <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Hash className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Tags & Positions</h2>
                                <p className="text-xs font-bold text-gray-400">Define your club's reach and leadership</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Available Positions (Core Team) *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text" value={positionInput} onChange={(e) => setPositionInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPosition())}
                                        className="flex-1 px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-blue-500 font-bold"
                                        placeholder="e.g. Coordinator, Tech Lead"
                                    />
                                    <button
                                        type="button" onClick={addPosition}
                                        className="sm:px-6 px-2 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition font-black uppercase text-xs tracking-widest"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {formData.availablePositions.map(p => (
                                        <span key={p} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 border border-blue-100 shadow-sm transition hover:scale-105">
                                            {p} <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => removePosition(p)} />
                                        </span>
                                    ))}
                                    {formData.availablePositions.length === 0 && <p className="text-xs text-gray-300 italic">No positions added yet (e.g. Coordinator)</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Category Tags *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        className="flex-1 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-blue-500 font-bold"
                                        placeholder="e.g. coding, singing, robot"
                                    />
                                    <button
                                        type="button" onClick={addTag}
                                        className="sm:px-6 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition font-black uppercase text-xs tracking-widest border border-gray-100"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {formData.tags.map(t => (
                                        <span key={t} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 border border-white shadow-sm transition hover:scale-105">
                                            {t} <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => removeTag(t)} />
                                        </span>
                                    ))}
                                    {formData.tags.length === 0 && <p className="text-xs text-gray-300 italic">No tags added yet</p>}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Social links (Optional) */}
                    <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Social Presence</h2>
                                <p className="text-xs font-bold text-gray-400">Optional: Connect your community online</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 bg-gray-50 px-5 rounded-2xl border border-gray-100 focus-within:ring-4 focus-within:ring-pink-50 focus-within:border-pink-500/20 transition group">
                                <Instagram className="w-5 h-5 text-gray-300 group-focus-within:text-pink-500" />
                                <input
                                    type="text" name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleChange}
                                    className="flex-1 bg-transparent py-4 outline-none text-sm font-bold"
                                    placeholder="Instagram URL"
                                />
                            </div>
                            <div className="flex items-center gap-4 bg-gray-50 px-5 rounded-2xl border border-gray-100 focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-500/20 transition group">
                                <Linkedin className="w-5 h-5 text-gray-300 group-focus-within:text-blue-700" />
                                <input
                                    type="text" name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange}
                                    className="flex-1 bg-transparent py-4 outline-none text-sm font-bold"
                                    placeholder="LinkedIn URL"
                                />
                            </div>
                            <div className="flex items-center gap-4 bg-gray-50 px-5 rounded-2xl border border-gray-100 focus-within:ring-4 focus-within:ring-sky-50 focus-within:border-sky-500/20 transition group">
                                <Twitter className="w-5 h-5 text-gray-300 group-focus-within:text-sky-500" />
                                <input
                                    type="text" name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleChange}
                                    className="flex-1 bg-transparent py-4 outline-none text-sm font-bold"
                                    placeholder="X (Twitter) URL"
                                />
                            </div>
                            <div className="flex items-center gap-4 bg-gray-50 px-5 rounded-2xl border border-gray-100 focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-500/20 transition group">
                                <Facebook className="w-5 h-5 text-gray-300 group-focus-within:text-blue-600" />
                                <input
                                    type="text" name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleChange}
                                    className="flex-1 bg-transparent py-4 outline-none text-sm font-bold"
                                    placeholder="Facebook URL"
                                />
                            </div>
                            <div className="flex items-center gap-4 bg-gray-50 px-5 rounded-2xl border border-gray-100 focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-500/20 transition group">
                                <Mail className="w-5 h-5 text-gray-300 group-focus-within:text-blue-600" />
                                <input
                                    type="email" name="socialLinks.email" value={formData.socialLinks.email} onChange={handleChange}
                                    className="flex-1 bg-transparent py-4 outline-none text-sm font-bold"
                                    placeholder="Club Official Email"
                                />
                            </div>
                            <div className="flex items-center gap-4 bg-gray-50 px-5 rounded-2xl border border-gray-100 focus-within:ring-4 focus-within:ring-gray-50 focus-within:border-gray-500/20 transition group">
                                <Globe className="w-5 h-5 text-gray-300 group-focus-within:text-gray-600" />
                                <input
                                    type="text" name="socialLinks.website" value={formData.socialLinks.website} onChange={handleChange}
                                    className="flex-1 bg-transparent py-4 outline-none text-sm font-bold"
                                    placeholder="Official Website"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-16 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-gray-900/40 hover:bg-gray-800 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
                        >
                            {isPending ? <Plus className="w-6 h-6 animate-spin" /> : "Initiate Verification"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
