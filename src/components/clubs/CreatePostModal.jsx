import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, X, UploadCloud, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../common/Modal";
import { createClubPost } from "../../api/clubs.api";
import { createCollegePost } from "../../api/colleges.api";
import { Eye, Globe, Building2, Users as UsersIcon } from "lucide-react";
import { compressImage } from "../../utils/image.utils";

export default function CreatePostModal({ isOpen, onClose, clubId, collegeId, isCollegeScope = false }) {
    const [content, setContent] = useState("");
    const [visibility, setVisibility] = useState(isCollegeScope ? "college" : "club");
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: isCollegeScope ? createCollegePost : createClubPost,
        onSuccess: () => {
            toast.success("Post created successfully!");
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            handleClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to create post");
        }
    });

    const handleClose = () => {
        setContent("");
        setFiles([]);
        setVisibility(isCollegeScope ? "college" : "club");
        onClose();
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            processFiles([...e.target.files]);
        }
        // Reset input so same files can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const processFiles = async (newFiles) => {
        const validFiles = newFiles.filter(file => file.type.startsWith("image/"));

        if (validFiles.length !== newFiles.length) {
            toast.warning("Some files were skipped (only images allowed).");
        }

        const currentCount = files.length;
        const remainingSlots = 5 - currentCount;

        if (remainingSlots <= 0) {
            toast.warning("Maximum 5 images allowed.");
            return;
        }

        const filesToAdd = validFiles.slice(0, remainingSlots);

        if (filesToAdd.length < validFiles.length) {
            toast.warning(`Only added ${filesToAdd.length} file(s) to stay within the 5-file limit.`);
        }

        setIsProcessing(true);
        try {
            const compressedResults = await Promise.all(
                filesToAdd.map(file => compressImage(file, 0.7))
            );
            setFiles(prev => [...prev, ...compressedResults]);
        } catch (error) {
            console.error("Compression failed", error);
            toast.error("Failed to process some images.");
        } finally {
            setIsProcessing(false);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!content.trim() && files.length === 0) {
            toast.warn("Please add some content or an image.");
            return;
        }
        mutate({ collegeId, clubId, content, files, visibility });
    };

    // Drag and Drop
    const [isDragging, setIsDragging] = useState(false);
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles([...e.dataTransfer.files]);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create New Post">
            <div className="space-y-4">
                <textarea
                    rows="4"
                    placeholder={isCollegeScope ? "What's happening in the college?" : "What's happening in the club?"}
                    className="w-full p-4 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-blue-100 resize-none transition"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {/* Image Upload Area */}
                <div
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <div className="bg-blue-50 p-3 rounded-full mb-3 text-blue-600">
                        <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5)</p>
                </div>

                {/* Previews */}
                {files.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                        {files.map((file, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-100">
                                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Visibility Selector */}
                <div className="sm:flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 ">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Visibility:</span>
                    <div className="flex items-center gap-1">
                        {[
                            { id: 'global', label: 'Global', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { id: 'college', label: 'College', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            ...(isCollegeScope ? [] : [{ id: 'club', label: 'Club', icon: UsersIcon, color: 'text-pink-600', bg: 'bg-pink-50' }])
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setVisibility(opt.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${visibility === opt.id
                                    ? `${opt.bg} ${opt.color} ring-1 ring-inset ring-current shadow-sm`
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                                title={`${opt.label} visibility`}
                            >
                                <opt.icon className="w-3.5 h-3.5" />
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || isProcessing}
                        className="bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-8 rounded-xl shadow-lg shadow-gray-200 transition active:scale-95 disabled:opacity-70 flex items-center gap-2"
                    >
                        {(isPending || isProcessing) && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isProcessing ? "Optimizing..." : "Publish Post"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
