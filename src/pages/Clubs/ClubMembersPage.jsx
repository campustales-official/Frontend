import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClubMembers, updateClubMember, removeClubMember } from "../../api/clubs.api";
import { useMe } from "../../hooks/useMe";
import { ArrowLeft, MoreVertical, Loader2, Trash2, Edit2 } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal";

export default function ClubMembersPage() {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const collegeId = me?.college?.id;

    // Fetch Members
    const { data: members, isLoading } = useQuery({
        queryKey: ["clubMembers", clubId],
        queryFn: () => fetchClubMembers({ clubId }),
        enabled: !!clubId
    });

    // Admin Check
    const myRoleObj = me?.clubRoles?.find(r => r.clubId === clubId);
    const isAdmin = myRoleObj?.role === "admin" || myRoleObj?.role === "superadmin" || me?.platformRole === "admin";

    // Action State
    const [selectedMember, setSelectedMember] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Mutations
    const { mutate: updateMember, isPending: isUpdating } = useMutation({
        mutationFn: ({ userId, roleInClub, positions }) =>
            updateClubMember({ collegeId, clubId, userId, roleInClub, positions }),
        onSuccess: () => {
            toast.success("Member updated successfully");
            queryClient.invalidateQueries({ queryKey: ["clubMembers", clubId] });
            setIsEditOpen(false);
            setSelectedMember(null);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Update failed")
    });

    const { mutate: removeMember, isPending: isRemoving } = useMutation({
        mutationFn: (userId) => removeClubMember({ collegeId, clubId, userId }),
        onSuccess: () => {
            toast.success("Member removed successfully");
            queryClient.invalidateQueries({ queryKey: ["clubMembers", clubId] });
        },
        onError: (err) => toast.error(err.response?.data?.message || "Removal failed")
    });

    // Sorting Logic
    const rolePriority = { super_admin: 0, admin: 1, assistant: 2, member: 3 };
    const sortedMembers = members ? [...members].sort((a, b) => { // Create a copy to sort
        const pA = rolePriority[a.roleInClub] ?? 99;
        const pB = rolePriority[b.roleInClub] ?? 99;
        return pA - pB;
    }) : [];

    // Role Styles Configuration
    const roleStyles = {
        super_admin: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700 border-amber-200", label: "Super Admin" },
        admin: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700 border-blue-200", label: "Admin" },
        assistant: { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-700 border-green-200", label: "Assistant" },
        member: { bg: "bg-white", border: "border-gray-200", badge: "bg-gray-100 text-gray-700 border-gray-200", label: "Member" }
    };

    const handleEdit = (member) => {
        setSelectedMember(member);
        setIsEditOpen(true);
        setActiveMenuId(null);
    };

    const handleRemove = (member) => {
        if (confirm(`Are you sure you want to remove ${member.user.name} from the club?`)) {
            removeMember(member.user.id);
        }
        setActiveMenuId(null);
    };

    const toggleMenu = (e, userId) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === userId ? null : userId);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8" onClick={() => setActiveMenuId(null)}>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white rounded-full transition shadow-sm bg-white border border-gray-200"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Club Members</h1>
                        <p className="text-gray-500 text-sm">Manage roles and permissions</p>
                    </div>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
                ) : (
                    <div className="space-y-3">
                        {sortedMembers.map((member) => {
                            const style = roleStyles[member.roleInClub] || roleStyles.member;

                            return (
                                <div key={member.user.id} className={`${style.bg} ${style.border} border rounded-xl p-4 transition hover:shadow-md relative`}>

                                    {/* Action Menu (Top Right) */}
                                    {isAdmin && (
                                        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => toggleMenu(e, member.user.id)}
                                                    className={`p-2 rounded-full transition ${activeMenuId === member.user.id ? 'bg-black/10 text-gray-900' : 'hover:bg-black/5 text-gray-500'}`}
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>

                                                {activeMenuId === member.user.id && (
                                                    <div
                                                        className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-1"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={() => handleEdit(member)}
                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                                                        >
                                                            <Edit2 className="w-4 h-4" /> Edit Role
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemove(member)}
                                                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                                                        >
                                                            <Trash2 className="w-4 h-4" /> Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pr-10 md:pr-0">

                                        {/* User Info & Role Badge (Col 1-4) */}
                                        <div className="md:col-span-4 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white/80 border border-black/5 flex-shrink-0 flex items-center justify-center text-gray-700 font-bold text-lg shadow-sm">
                                                {member.user.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                                    <h3 className="font-bold text-gray-900 truncate">{member.user.name}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-bold border ${style.badge}`}>
                                                        {style.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">{member.user.email}</p>
                                            </div>
                                        </div>

                                        {/* College Info (Col 5-7) */}
                                        <div className="md:col-span-3">
                                            <div className="text-xs text-gray-400 uppercase font-medium mb-1">College</div>
                                            <div className="font-medium text-gray-700 text-sm line-clamp-2 break-words" title={member.user.college?.name}>
                                                {member.user.college?.name || member.college?.name || "Unknown College"}
                                            </div>
                                        </div>

                                        {/* Position & Joined (Col 8-12) */}
                                        <div className="md:col-span-5 flex flex-col md:flex-row gap-4 md:items-center justify-between overflow-hidden">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-gray-400 uppercase font-medium mb-0.5">Position</div>
                                                <div className="font-medium text-gray-800 text-sm break-words leading-tight">
                                                    {member.positions?.[0] || <span className="text-gray-400 italic font-normal">No Position</span>}
                                                </div>
                                            </div>
                                            <div className="min-w-[100px] md:text-right md:pr-10">
                                                <div className="text-xs text-gray-400 uppercase font-medium mb-0.5">Joined</div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(member.joinedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                        {members?.length === 0 && (
                            <div className="text-center py-10 text-gray-500">No members found.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditOpen && selectedMember && (
                <EditMemberModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    member={selectedMember}
                    onSave={updateMember}
                    isPending={isUpdating}
                />
            )}
        </div>
    );
}

function EditMemberModal({ isOpen, onClose, member, onSave, isPending }) {
    const [roleInClub, setRoleInClub] = useState(member.roleInClub);
    const [position, setPosition] = useState(member.positions?.[0] || "");

    const handleSubmit = () => {
        onSave({
            userId: member.user.id,
            roleInClub,
            positions: position ? [position] : []
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Member">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                        value={roleInClub}
                        onChange={(e) => setRoleInClub(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none"
                    >
                        <option value="member">Member</option>
                        <option value="assistant">Assistant</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position Title</label>
                    <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="e.g. Event Coordinator"
                        className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition shadow-sm disabled:opacity-70 flex items-center gap-2"
                    >
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </Modal>
    );
}
