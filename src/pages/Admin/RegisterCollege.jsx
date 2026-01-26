import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerCollege } from "../../api/admin.api";
import AdminNavbar from "../../components/layout/AdminNavbar";
import {
    School,
    Mail,
    MapPin,
    Globe,
    Upload,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Image as ImageIcon,
    Plus,
    X,
    Type,
    Twitter,
    Facebook,
    Linkedin,
    Instagram,
    Hash,
    Trash2,
    ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Helper Component for Identifier Configuration
function IdentifierConfigSection({ title, type, config, setConfig }) {
    const [newType, setNewType] = useState("");


    const handleAddType = () => {
        if (!newType) return;
        const normalized = newType.toLowerCase().replace(/\s+/g, "_");
        if (config.allowedTypes.includes(normalized)) {
            toast.warning("Type already exists");
            return;
        }
        setConfig(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                allowedTypes: [...prev[type].allowedTypes, normalized]
            }
        }));
        setNewType("");
    };

    const handleRemoveType = (typeToRemove) => {
        if (config.allowedTypes.length <= 1) {
            toast.warning("Must have at least one allowed type");
            return;
        }
        if (typeToRemove === config.primaryType) {
            toast.warning("Cannot remove primary type");
            return;
        }
        setConfig(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                allowedTypes: prev[type].allowedTypes.filter(t => t !== typeToRemove)
            }
        }));
    };



    return (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-500" />
                {title} Identifiers
            </h3>

            {/* Allowed Types Management */}
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Allowed Types</label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {config.allowedTypes.map(t => (
                        <span key={t} className="inline-flex items-center gap-1 bg-white border border-gray-200 px-3 py-1 rounded-lg text-sm font-medium text-gray-700">
                            {t}
                            {t !== config.primaryType && (
                                <button type="button" onClick={() => handleRemoveType(t)} className="text-gray-400 hover:text-red-500">
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        placeholder="Add type (e.g. prn)"
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <button type="button" onClick={handleAddType} className="bg-gray-900 text-white p-2 rounded-xl hover:bg-gray-800">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Primary Type</label>
                    <select
                        value={config.primaryType}
                        onChange={(e) => setConfig(prev => ({ ...prev, [type]: { ...prev[type], primaryType: e.target.value } }))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                    >
                        {config.allowedTypes.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

            </div>


        </div>
    );
}

export default function RegisterCollege() {
    const navigate = useNavigate();
    const [logoPreview, setLogoPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        aisheCode: "",
        type: "college",
        state: "",
        city: "",
        address: "",
        emailDomains: "",
        requiresManualVerification: false,
        website: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        facebook: "",
        email: "",
        adminId: ""
    });

    const [identifierConfig, setIdentifierConfig] = useState({
        student: {
            allowedTypes: ["roll_no"],
            primaryType: "roll_no",
            regex: "^NCE[0-9]{5}$"
        },
        faculty: {
            allowedTypes: ["employee_id"],
            primaryType: "employee_id",
            regex: "^FAC[0-9]{3}$"
        }
    });

    const [files, setFiles] = useState({
        logo: null,
        coverImage: null
    });

    const mutation = useMutation({
        mutationFn: registerCollege,
        onSuccess: () => {
            toast.success("College registered successfully!");
            navigate("/admin");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to register college");
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files: uploadedFiles } = e.target;
        const file = uploadedFiles[0];
        if (file) {
            setFiles(prev => ({ ...prev, [name]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                if (name === "logo") setLogoPreview(reader.result);
                else setCoverPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();

        // Append text fields
        Object.keys(formData).forEach(key => {
            if (key === "emailDomains") {
                data.append(key, JSON.stringify(formData[key].split(",").map(d => d.trim())));
            } else if (["website", "instagram", "twitter", "linkedin", "facebook", "email"].includes(key)) {
                // Don't append social links directly, we group them
            } else {
                data.append(key, formData[key]);
            }
        });

        // Pack social links
        const socialLinks = {
            website: formData.website,
            instagram: formData.instagram,
            twitter: formData.twitter,
            linkedin: formData.linkedin,
            facebook: formData.facebook,
            email: formData.email
        };
        data.append("socialLinks", JSON.stringify(socialLinks));

        // Append files
        if (files.logo) data.append("logo", files.logo);
        if (files.coverImage) data.append("coverImage", files.coverImage);

        // Append Config
        const sanitizedConfig = Object.fromEntries(
            Object.entries(identifierConfig).map(([k, v]) => {
                const { regex, ...rest } = v;
                return [k, rest];
            })
        );
        data.append("identifierConfig", JSON.stringify(sanitizedConfig));

        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-8">
            <AdminNavbar />

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-600 p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                                <School className="w-8 h-8" />
                                Register Institution
                            </h1>
                            <p className="text-indigo-100 font-medium">Add a new college or university to the hub ecosystem.</p>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <School className="w-48 h-48 -mr-12 -mt-12" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
                        {/* Media Upload Section */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-indigo-500" />
                                Branding Media
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">College Logo</label>
                                    <div className="relative group">
                                        <div className={`aspect-square rounded-3xl border-4 border-dashed transition-all flex flex-col items-center justify-center p-4 ${logoPreview ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-gray-50'}`}>
                                            {logoPreview ? (
                                                <img src={logoPreview} className="w-full h-full object-contain rounded-2xl" alt="Preview" />
                                            ) : (
                                                <>
                                                    <Upload className="w-10 h-10 text-gray-300 group-hover:text-indigo-400 mb-2" />
                                                    <p className="text-xs text-gray-400 font-bold">PNG/JPG up to 2MB</p>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                name="logo"
                                                onChange={handleFileChange}
                                                required
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        {logoPreview && (
                                            <button
                                                type="button"
                                                onClick={() => setLogoPreview(null)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Cover Image</label>
                                    <div className="relative group">
                                        <div className={`aspect-[4/1] rounded-3xl border-4 border-dashed transition-all flex flex-col items-center justify-center p-4 ${coverPreview ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-gray-50'}`}>
                                            {coverPreview ? (
                                                <img src={coverPreview} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                                            ) : (
                                                <>
                                                    <Upload className="w-10 h-10 text-gray-300 group-hover:text-indigo-400 mb-2" />
                                                    <p className="text-xs text-gray-400 font-bold">4:1 Aspect Ratio (e.g. 1600×400)</p>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                name="coverImage"
                                                onChange={handleFileChange}
                                                required
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        {coverPreview && (
                                            <button
                                                type="button"
                                                onClick={() => setCoverPreview(null)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Basic Info Section */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <School className="w-5 h-5 text-indigo-500" />
                                Basic Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">College Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. National College of Engineering"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-gray-900"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">AISHE Code</label>
                                        <input
                                            type="text"
                                            name="aisheCode"
                                            value={formData.aisheCode}
                                            onChange={handleChange}
                                            required
                                            placeholder="C-9876"
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-gray-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Type</label>
                                        <div className="relative">
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-gray-700 appearance-none"
                                            >
                                                <option value="college">College</option>
                                                <option value="university">University</option>
                                                <option value="institute">Institute</option>
                                            </select>
                                            <Type className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Admin ID (MongoDB ID)</label>
                                    <div className="relative group">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            type="text"
                                            name="adminId"
                                            value={formData.adminId}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. 64b1f..."
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                            placeholder="State"
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-gray-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            placeholder="City"
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Full Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        placeholder="Full Campus Address"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-gray-900"
                                    />
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Social Links Section */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-indigo-500" />
                                Social Presence
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Contact Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="contact@college.edu" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Website</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://college.edu" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Instagram</label>
                                    <div className="relative group">
                                        <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
                                        <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="https://instagram.com/..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-pink-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Twitter (X)</label>
                                    <div className="relative group">
                                        <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
                                        <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="https://x.com/..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-sky-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">LinkedIn</label>
                                    <div className="relative group">
                                        <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-700 transition-colors" />
                                        <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/school/..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-700 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Facebook</label>
                                    <div className="relative group">
                                        <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input type="url" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-600 outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Domain & Verification */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                                Verification Config
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Approved Email Domains</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            type="text"
                                            name="emailDomains"
                                            value={formData.emailDomains}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. nce.edu.in, nce.ac.in (comma separated)"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Identifier Config */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                                Identification Rules
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <IdentifierConfigSection
                                    title="Student"
                                    type="student"
                                    config={identifierConfig.student}
                                    setConfig={setIdentifierConfig}
                                />
                                <IdentifierConfigSection
                                    title="Faculty"
                                    type="faculty"
                                    config={identifierConfig.faculty}
                                    setConfig={setIdentifierConfig}
                                />
                            </div>
                        </section>

                        {/* Submit Section */}
                        <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="requiresManualVerification"
                                        checked={formData.requiresManualVerification}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6 shadow-inner"></div>
                                </div>
                                <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Manual verification required</span>
                            </label>

                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95"
                            >
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        Complete Registration
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
