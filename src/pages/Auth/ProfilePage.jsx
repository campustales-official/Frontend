import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useMe } from "../../hooks/useMe";
import { logout } from "../../api/auth.api";
import { updateUserProfile, updateExternalProfile } from "../../api/user.api";
import ChangePasswordModal from "../../components/profile/ChangePasswordModal";
import ChangeEmailModal from "../../components/profile/ChangeEmailModal";
import {
    User,
    Mail,
    BookOpen,
    GraduationCap,
    Calendar,
    Edit3,
    Save,
    LogOut,
    ShieldCheck,
    ChevronRight,
    Building2,
    Hash,
    Layers,
    Lock,
    CheckCircle2,
    Loader2,
    Phone,
    MapPin
} from "lucide-react";
import { toast } from "react-toastify";

export default function ProfilePage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: me } = useMe();

    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        branch: "",
        degree: "",
        year: "",
        yearOfAdmission: "",
        passingYear: "",
        identifierType: "",
        identifierValue: "",
        // External user fields
        collegeName: "",
        collegeAisheCode: "",
        collegeCity: "",
        collegeState: ""
    });

    // Sync formData when me loads
    useEffect(() => {
        if (me) {
            setFormData({
                name: me.name || "",
                branch: me.branch || "",
                degree: me.degree || "",
                year: me.year || "",
                yearOfAdmission: me.yearOfAdmission || "",
                passingYear: me.passingYear || "",
                identifierType: me.identifiers?.student?.type || "",
                identifierValue: me.identifiers?.student?.value || "",
                // External user fields (API returns nested college object)
                collegeName: me.college?.name || "",
                collegeAisheCode: me.college?.aisheCode || "",
                collegeCity: me.college?.city || "",
                collegeState: me.college?.state || ""
            });
        }
    }, [me]);

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.clear();
            localStorage.removeItem("roleInCollege");
            toast.success("Logged out successfully");
            navigate("/login");
        },
        onError: () => {
            queryClient.clear();
            navigate("/login");
        }
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data) => {
            if (me.roleInCollege === 'external') {
                return updateExternalProfile(data);
            }
            return updateUserProfile({ collegeId: me.college.id, data });
        },
        onSuccess: (res) => {
            toast.success(res.message || "Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ["me"] });
            setIsEditing(false);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to update profile");
        }
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    const handleSave = () => {
        const isExternal = me.roleInCollege === 'external';

        const payload = {
            name: formData.name,
            branch: formData.branch,
            degree: formData.degree,
            year: Number(formData.year) || undefined,
            yearOfAdmission: Number(formData.yearOfAdmission) || undefined,
            passingYear: Number(formData.passingYear) || undefined,
            identifiers: {
                student: {
                    type: formData.identifierType,
                    value: formData.identifierValue
                }
            }
        };

        // Add external-specific fields
        if (isExternal) {
            payload.collegeName = formData.collegeName || undefined;
            payload.collegeAisheCode = formData.collegeAisheCode || undefined;
            payload.collegeCity = formData.collegeCity || undefined;
            payload.collegeState = formData.collegeState || undefined;
        }

        updateProfileMutation.mutate(payload);
    };

    if (!me) return null;

    // Helper to get dynamic label for identifier
    const getIdentifierLabel = (type) => {
        const labels = {
            roll_no: "Roll Number",
            employee_id: "Employee ID",
            faculty_code: "Faculty Code",
            staff_id: "Staff ID",
            registration_no: "Registration No.",
            scholar_no: "Scholar No.",
            enrolment_no: "Enrolment No.",
            admission_no: "Admission No."
        };
        return labels[type] || "ID";
    };

    // Gender neutral avatar
    const dummyAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${me.name}&backgroundColor=6366f1&fontFamily=Arial&fontSize=40`;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            {/* Header Banner */}
            <div className="h-48 w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 relative">
                <div className="max-w-6xl mx-auto px-4 h-full relative">
                    {/* Avatar Positioned on edge */}
                    <div className="absolute -bottom-16 left-4 md:left-8">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden relative group">
                            <img src={dummyAvatar} alt={me.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Header Info */}
            <div className="max-w-6xl mx-auto px-4 pt-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">{me.name}</h1>
                            {me.isVerifiedByCollege && (
                                <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide">
                                    <ShieldCheck className="w-3 h-3" />
                                    Verified
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {me.college?.name}</span>
                        </div>
                        {me.isVerifiedByCollege && (
                            <div className="mt-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> College Verified
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            disabled={updateProfileMutation.isPending}
                            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition w-full md:w-auto justify-center shadow-lg shadow-gray-200 disabled:opacity-50"
                        >
                            {updateProfileMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isEditing ? (
                                <Save className="w-4 h-4" />
                            ) : (
                                <Edit3 className="w-4 h-4" />
                            )}
                            {updateProfileMutation.isPending ? "Saving..." : isEditing ? "Save Profile" : "Edit Profile"}
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

                    {/* Left Column: Personal Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-xl"><User className="w-5 h-5 text-blue-600" /></div>
                                    Personal Information
                                </h2>
                                {isEditing && (
                                    <button onClick={handleSave} className="text-sm font-bold text-blue-600 hover:text-blue-700">Save Changes</button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <InfoItem label="College" value={me.college?.name} icon={<Building2 className="w-4 h-4" />} />
                                <InfoItem label="Email" value={me.email} icon={<Mail className="w-4 h-4" />} />

                                <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                                    <InfoItem label="Role in College" value={me.roleInCollege} icon={<User className="w-4 h-4" />} />
                                    <EditableInfoItem
                                        label={getIdentifierLabel(formData.identifierType)}
                                        value={formData.identifierValue}
                                        icon={<Hash className="w-4 h-4" />}
                                        isEditing={isEditing}
                                        onChange={(val) => setFormData(prev => ({ ...prev, identifierValue: val }))}
                                    />
                                </div>

                                <div className="md:col-span-2 border-t border-gray-50 mt-2"></div>

                                {/* External user fields */}
                                {me.roleInCollege === 'external' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                                        <EditableInfoItem
                                            label="College Name"
                                            value={formData.collegeName}
                                            icon={<Building2 className="w-4 h-4" />}
                                            isEditing={isEditing}
                                            onChange={(val) => setFormData(prev => ({ ...prev, collegeName: val }))}
                                        />
                                        <EditableInfoItem
                                            label="AISHE Code"
                                            value={formData.collegeAisheCode}
                                            icon={<Hash className="w-4 h-4" />}
                                            isEditing={isEditing}
                                            onChange={(val) => setFormData(prev => ({ ...prev, collegeAisheCode: val }))}
                                        />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                                            <EditableInfoItem
                                                label="College City"
                                                value={formData.collegeCity}
                                                icon={<MapPin className="w-4 h-4" />}
                                                isEditing={isEditing}
                                                onChange={(val) => setFormData(prev => ({ ...prev, collegeCity: val }))}
                                            />
                                            <EditableInfoItem
                                                label="College State"
                                                value={formData.collegeState}
                                                icon={<MapPin className="w-4 h-4" />}
                                                isEditing={isEditing}
                                                onChange={(val) => setFormData(prev => ({ ...prev, collegeState: val }))}
                                            />
                                        </div>
                                        <div className="md:col-span-2 border-t border-gray-50 mt-2"></div>
                                    </>
                                )}

                                <EditableInfoItem
                                    label="Branch"
                                    value={formData.branch}
                                    icon={<Layers className="w-4 h-4" />}
                                    isEditing={isEditing}
                                    onChange={(val) => setFormData(prev => ({ ...prev, branch: val }))}
                                />
                                <EditableInfoItem
                                    label="Degree"
                                    value={formData.degree}
                                    icon={<GraduationCap className="w-4 h-4" />}
                                    isEditing={isEditing}
                                    onChange={(val) => setFormData(prev => ({ ...prev, degree: val }))}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <EditableInfoItem
                                        label="Year"
                                        value={formData.year}
                                        icon={<Calendar className="w-4 h-4" />}
                                        isEditing={isEditing}
                                        type="number"
                                        onChange={(val) => setFormData(prev => ({ ...prev, year: val }))}
                                    />
                                    {/* <EditableInfoItem
                                        label="Semester"
                                        value={formData.semester}
                                        icon={<BookOpen className="w-4 h-4" />}
                                        isEditing={isEditing}
                                        type="number"
                                        onChange={(val) => setFormData(prev => ({ ...prev, semester: val }))}
                                    />*/}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <EditableInfoItem
                                        label="Admission Year"
                                        value={formData.yearOfAdmission}
                                        icon={<Calendar className="w-4 h-4" />}
                                        isEditing={isEditing}
                                        onChange={(val) => setFormData(prev => ({ ...prev, yearOfAdmission: val }))}
                                    />
                                    <EditableInfoItem
                                        label="Passing Year"
                                        value={formData.passingYear}
                                        icon={<Calendar className="w-4 h-4" />}
                                        isEditing={isEditing}
                                        onChange={(val) => setFormData(prev => ({ ...prev, passingYear: val }))}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Account & Clubs */}
                    <div className="space-y-8">
                        {/* Account Settings */}
                        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-50 rounded-xl"><User className="w-5 h-5 text-purple-600" /></div>
                                Account
                            </h2>
                            <div className="space-y-3">
                                <button onClick={() => setIsEmailModalOpen(true)} className="w-full">
                                    <SettingsLink icon={<Mail className="w-4 h-4" />} label="Change Email" sub="Update your contact email" />
                                </button>
                                <button onClick={() => setIsPasswordModalOpen(true)} className="w-full">
                                    <SettingsLink icon={<Lock className="w-4 h-4" />} label="Change Password" sub="Secure your account" />
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={logoutMutation.isPending}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 group transition-all disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-100 transition">
                                            {logoutMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                                        </div>
                                        <div className="text-left font-bold text-red-600">Logout</div>
                                    </div>
                                </button>
                            </div>
                        </section>

                        {/* My Clubs */}
                        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between mb-6 px-1">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                    <div className="p-2 bg-pink-50 rounded-xl"><User className="w-5 h-5 text-pink-600" /></div>
                                    My Clubs
                                </h2>
                                <Link to="/clubs" className="text-xs font-bold text-pink-600 hover:underline">View All</Link>
                            </div>
                            <div className="space-y-4">
                                {me.clubRoles?.length > 0 ? me.clubRoles.map(cr => (
                                    <Link
                                        key={cr.clubId}
                                        to={`/club/${cr.clubId}`}
                                        className="flex items-center justify-between p-3 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                {cr.name?.substring(0, 2).toUpperCase() || "CL"}
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="font-bold text-gray-900 truncate text-sm">{cr.name}</div>
                                                <span className="inline-block text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded mt-1">
                                                    {cr.role}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </Link>
                                )) : (
                                    <p className="text-sm text-gray-500 text-center py-4">No clubs joined yet.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
            <ChangeEmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                currentEmail={me.email}
            />
        </div>
    );
}

// Internal Helper Components
function InfoItem({ label, value, icon }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400">{icon}</span>
                <span className="text-sm font-bold text-gray-700">{value || "Not provided"}</span>
            </div>
        </div>
    );
}

function EditableInfoItem({ label, value, icon, isEditing, onChange, type = "text" }) {
    if (!isEditing) return <InfoItem label={label} value={value} icon={icon} />;

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-widest">{label}</label>
            <div className="flex items-center gap-3 p-2 px-3 bg-white rounded-xl border-2 border-blue-500 shadow-sm shadow-blue-50">
                <span className="text-blue-500">{icon}</span>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm font-bold text-gray-900"
                />
            </div>
        </div>
    );
}

function SettingsLink({ icon, label, sub }) {
    return (
        <div className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 group transition-all cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                    {icon}
                </div>
                <div className="text-left">
                    <div className="font-bold text-gray-900 group-hover:text-blue-600 transition">{label}</div>
                    <div className="text-xs text-gray-500">{sub}</div>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition" />
        </div>
    );
}
