import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClubs, updateClubDetails } from "../../api/clubs.api";
import { useMe } from "../../hooks/useMe";
import { ArrowLeft, Save, Upload, X, Plus, Instagram, Linkedin, Globe, Twitter, Facebook, Mail, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function EditClubPage() {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const collegeId = me?.college?.id;

    const { data: club, isLoading } = useQuery({
        queryKey: ["clubs", collegeId],
        queryFn: () => fetchClubs({ collegeId }),
        enabled: !!collegeId,
        select: (clubs) => clubs.find((c) => c.id === clubId),
        staleTime: 5 * 60 * 1000,
    });

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        tags: [],
        availablePositions: [],
        establishedYear: "",
        socialLinks: {
            instagram: "",
            linkedin: "",
            website: "",
            twitter: "",
            facebook: "",
            email: ""
        }
    });

    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [cover, setCover] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const [tagInput, setTagInput] = useState("");
    const [positionInput, setPositionInput] = useState("");

    useEffect(() => {
        if (club) {
            setFormData({
                name: club.name || "",
                description: club.description || "",
                category: club.category || "",
                tags: club.tags || [],
                availablePositions: club.availablePositions || [],
                establishedYear: club.establishedYear || "",
                socialLinks: {
                    instagram: club.socialLinks?.instagram || "",
                    linkedin: club.socialLinks?.linkedin || "",
                    website: club.socialLinks?.website || "",
                    twitter: club.socialLinks?.twitter || "",
                    facebook: club.socialLinks?.facebook || "",
                    email: club.socialLinks?.email || ""
                }
            });
            if (club.logo) setLogoPreview(club.logo);
            if (club.coverImage) setCoverPreview(club.coverImage);
        }
    }, [club]);

    const { mutate: updateClub, isPending } = useMutation({
        mutationFn: (data) => updateClubDetails({ collegeId, clubId, data }),
        onSuccess: () => {
            toast.success("Club updated successfully");
            queryClient.invalidateQueries({ queryKey: ["club", clubId] });
            navigate(`/club/${clubId}`);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update club");
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === "logo") {
                setLogo(file);
                setLogoPreview(URL.createObjectURL(file));
            } else {
                setCover(file);
                setCoverPreview(URL.createObjectURL(file));
            }
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
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("establishedYear", formData.establishedYear);

        // Use repeated keys for arrays
        formData.tags.forEach(tag => data.append("tags", tag));
        formData.availablePositions.forEach(pos => data.append("availablePositions", pos));

        // Use bracket notation for nested objects
        if (formData.socialLinks) {
            Object.entries(formData.socialLinks).forEach(([key, value]) => {
                if (value) data.append(`socialLinks[${key}]`, value);
            });
        }

        if (logo) data.append("logo", logo);
        if (cover) data.append("coverImage", cover);

        updateClub(data);
    };

    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Edit Club Details</h1>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold transition flex items-center gap-2 disabled:opacity-70 shadow-sm"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">

                {/* Visuals Section */}
                <section className="bg-white rounded-2xl border p-6 shadow-sm overflow-hidden">
                    <h2 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-500" /> Visual Identity
                    </h2>

                    <div className="space-y-6">
                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Cover Image</label>
                            <div
                                className="relative h-48 w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer group overflow-hidden"
                                onClick={() => document.getElementById('coverInput').click()}
                            >
                                {coverPreview ? (
                                    <img src={coverPreview} className="w-full h-full object-cover" alt="Cover" />
                                ) : (
                                    <div className="text-center">
                                        <div className="bg-white p-3 rounded-full shadow-sm mb-2 inline-block"><Upload className="w-5 h-5 text-gray-400" /></div>
                                        <p className="text-sm text-gray-500 font-medium">Click to upload cover image</p>
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
                                <button onClick={() => document.getElementById('logoInput').click()} className="text-sm text-blue-600 font-bold hover:underline">Change Logo</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Info Section */}
                <section className="bg-white rounded-2xl border p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 text-gray-800">General Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Club Name</label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition"
                                placeholder="Enter club name"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description" value={formData.description} onChange={handleChange} rows="4"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition resize-none"
                                placeholder="Tell us about the club..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <input
                                type="text" name="category" value={formData.category} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition"
                                placeholder="e.g. Technical, Cultural"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Established Year</label>
                            <input
                                type="number" name="establishedYear" value={formData.establishedYear} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition"
                                placeholder="e.g. 2018"
                            />
                        </div>
                    </div>
                </section>

                {/* Tags & Positions */}
                <section className="bg-white rounded-2xl border p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-blue-500"
                                    placeholder="Add tag..."
                                />
                                <button onClick={addTag} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Plus className="w-5 h-5" /></button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map(t => (
                                    <span key={t} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                        {t} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(t)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Available Positions</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text" value={positionInput} onChange={(e) => setPositionInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addPosition()}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-blue-500"
                                    placeholder="Add position..."
                                />
                                <button onClick={addPosition} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Plus className="w-5 h-5" /></button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.availablePositions.map(p => (
                                    <span key={p} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                        {p} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removePosition(p)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Links */}
                <section className="bg-white rounded-2xl border p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 text-gray-800">Social Presence</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4 bg-gray-50 px-4 py-1 rounded-xl border border-gray-100 focus-within:border-blue-500 transition">
                            <Instagram className="w-5 h-5 text-pink-500" />
                            <input
                                type="text" name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleChange}
                                className="flex-1 bg-transparent py-3 outline-none text-sm"
                                placeholder="Instagram Profile Link"
                            />
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 px-4 py-1 rounded-xl border border-gray-100 focus-within:border-blue-500 transition">
                            <Linkedin className="w-5 h-5 text-blue-700" />
                            <input
                                type="text" name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange}
                                className="flex-1 bg-transparent py-3 outline-none text-sm"
                                placeholder="LinkedIn Profile Link"
                            />
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 px-4 py-1 rounded-xl border border-gray-100 focus-within:border-blue-500 transition">
                            <Twitter className="w-5 h-5 text-sky-500" />
                            <input
                                type="text" name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleChange}
                                className="flex-1 bg-transparent py-3 outline-none text-sm"
                                placeholder="X (formerly Twitter)"
                            />
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 px-4 py-1 rounded-xl border border-gray-100 focus-within:border-blue-500 transition">
                            <Facebook className="w-5 h-5 text-blue-600" />
                            <input
                                type="text" name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleChange}
                                className="flex-1 bg-transparent py-3 outline-none text-sm"
                                placeholder="Facebook Profile Link"
                            />
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 px-4 py-1 rounded-xl border border-gray-100 focus-within:border-blue-500 transition">
                            <Mail className="w-5 h-5 text-orange-500" />
                            <input
                                type="email" name="socialLinks.email" value={formData.socialLinks.email} onChange={handleChange}
                                className="flex-1 bg-transparent py-3 outline-none text-sm"
                                placeholder="Club Official Email"
                            />
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 px-4 py-1 rounded-xl border border-gray-100 focus-within:border-blue-500 transition">
                            <Globe className="w-5 h-5 text-gray-600" />
                            <input
                                type="text" name="socialLinks.website" value={formData.socialLinks.website} onChange={handleChange}
                                className="flex-1 bg-transparent py-3 outline-none text-sm"
                                placeholder="Official Website"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
