import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerClub } from "../../api/clubs.api";
import { useMe } from "../../hooks/useMe";
import {
    ArrowLeft, Plus, X, Info, Instagram, Linkedin,
    Globe, Twitter, Facebook, Mail, ShieldAlert, Rocket,
    User, Calendar, Hash
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

    const [tagInput, setTagInput] = useState("");
    const [positionInput, setPositionInput] = useState("");

    const { mutate: handleRegister, isPending } = useMutation({
        mutationFn: (data) => registerClub({ collegeId, data }),
        onSuccess: () => {
            toast.success("Club registration submitted successfully!");
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
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            setTagInput("");
        }
    };

    const removeTag = (t) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== t) }));
    };

    const addPosition = () => {
        if (positionInput.trim() && !formData.availablePositions.includes(positionInput.trim())) {
            setFormData(prev => ({ ...prev, availablePositions: [...prev.availablePositions, positionInput.trim()] }));
            setPositionInput("");
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

        handleRegister(formData);
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
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        <ShieldAlert className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-1">Administrative Verification Required</h3>
                        <p className="text-sm text-amber-700 leading-relaxed font-medium">
                            Clubs created are non-operational until verified by the college admin. Please contact your college administration to get it verified.
                            <span className="block mt-2 text-xs opacity-80">Note: You can add the club logo and banner image from the club edit option once verification is requested or approved.</span>
                        </p>
                    </div>
                </div>

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
                                        className="flex-1 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-blue-500 font-bold"
                                        placeholder="e.g. Coordinator, Tech Lead"
                                    />
                                    <button
                                        type="button" onClick={addPosition}
                                        className="px-6 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition font-black uppercase text-xs tracking-widest"
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
                                        className="px-6 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition font-black uppercase text-xs tracking-widest border border-gray-100"
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
