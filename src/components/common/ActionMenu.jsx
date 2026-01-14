import { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function ActionMenu({ onEdit, onDelete, canDeleteOnly = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                aria-label="Options"
            >
                <MoreVertical className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-100">
                    {!canDeleteOnly && onEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                                onEdit();
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                                onDelete();
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
