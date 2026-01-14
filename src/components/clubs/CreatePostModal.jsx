import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, X, UploadCloud, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../common/Modal";
import { createClubPost } from "../../api/clubs.api";

export default function CreatePostModal({ isOpen, onClose, clubId, collegeId }) {
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: createClubPost,
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

    const processFiles = (newFiles) => {
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

        setFiles(prev => [...prev, ...filesToAdd]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!content.trim() && files.length === 0) {
            toast.warn("Please add some content or an image.");
            return;
        }
        mutate({ collegeId, clubId, content, files });
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
                    placeholder="What's happening in the club?"
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

                <div className="pt-2 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow-md transition active:scale-95 disabled:opacity-70 flex items-center gap-2"
                    >
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        Post Update
                    </button>
                </div>
            </div>
        </Modal>
    );
}
