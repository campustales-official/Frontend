import React, { useState, useRef, useEffect } from 'react';
import {
    Move, Type, Type as TypeIcon, Bold, AlignCenter, AlignLeft, AlignRight,
    Trash2, Plus, Image as ImageIcon, Info, ChevronRight, HelpCircle, Loader2, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_FIELD_LABELS = {
    branch: "Branch",
    degree: "Degree",
    // semester: "Semester",
    year: "Year",
    yearOfAdmission: "Year of Admission",
    passingYear: "Passing Year",
    identifier: "Student Id"
};

const PDF_WIDTH = 841.89;
const PDF_HEIGHT = 595.28;
const A4_ASPECT_RATIO = PDF_WIDTH / PDF_HEIGHT; // 1.414275...

export default function CertificateEditor({ event, initialData, onSave, isSaving, onPreview, isPreviewing }) {
    const [background, setBackground] = useState(initialData?.backgroundImageUrl || null);
    const [backgroundFile, setBackgroundFile] = useState(null);
    const [orientation, setOrientation] = useState(initialData?.orientation || "landscape");
    const [tempImage, setTempImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    // Virtual coordinate system: Width is always 800. Height depends on orientation and A4 ratio.
    const getCanvasHeight = (orient) => orient === "landscape" ? Math.round(800 / A4_ASPECT_RATIO) : Math.round(800 * A4_ASPECT_RATIO);
    const canvasHeight = getCanvasHeight(orientation);

    const [textBlocks, setTextBlocks] = useState(() => {
        if (initialData?.textBlocks) {
            return initialData.textBlocks.map(block => ({
                ...block,
                text: block.placeholderKey || block.text || "",
                // Coordinates are already stored as percentages (0-100), use directly
                x: block.x,
                y: block.y,
                width: block.width ?? 30
            }));
        }
        return [
            { text: "Certificate of Participation", x: 50, y: 25, fontSize: 1.2, fontWeight: "bold", color: "#000000", align: "center", width: 80 },
            { text: "This is to certify that", x: 50, y: 40, fontSize: 0.8, fontWeight: "normal", color: "#666666", align: "center", width: 60 },
            { text: "{{Student_full_name}}", x: 50, y: 55, fontSize: 1.5, fontWeight: "bold", color: "#111111", align: "center", width: 70 },
            { text: "has successfully participated in {{event}}", x: 50, y: 68, fontSize: 0.6, fontWeight: "normal", color: "#666666", align: "center", width: 70 },
            { text: "held on {{date}}", x: 50, y: 75, fontSize: 0.5, fontWeight: "normal", color: "#999999", align: "center", width: 40 }
        ];
    });
    const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
    const canvasRef = useRef(null);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [resizingIndex, setResizingIndex] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleBackgroundChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempImage(URL.createObjectURL(file));
            setShowCropper(true);
        }
    };

    const handleCropComplete = (blob, url) => {
        setBackground(url);
        setBackgroundFile(new File([blob], "background.png", { type: "image/png" }));
        setShowCropper(false);
    };

    const addTextBlock = () => {
        const newBlock = {
            text: "New Text Block",
            x: 50,
            y: 50,
            fontSize: 1,
            fontWeight: "normal",
            color: "#000000",
            align: "center",
            width: 30
        };
        setTextBlocks([...textBlocks, newBlock]);
        setSelectedBlockIndex(textBlocks.length);
    };

    const updateBlock = (index, updates) => {
        const newBlocks = [...textBlocks];
        newBlocks[index] = { ...newBlocks[index], ...updates };
        setTextBlocks(newBlocks);
    };

    const removeBlock = (index) => {
        const newBlocks = textBlocks.filter((_, i) => i !== index);
        setTextBlocks(newBlocks);
        setSelectedBlockIndex(null);
    };

    const handleMouseDown = (e, index) => {
        e.stopPropagation();
        setSelectedBlockIndex(index);
        setDraggingIndex(index);

        const block = textBlocks[index];
        const rect = canvasRef.current.getBoundingClientRect();

        const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

        setDragOffset({
            x: mouseX - block.x,
            y: mouseY - block.y
        });
    };

    const handleResizeStart = (e, index) => {
        e.stopPropagation();
        setResizingIndex(index);
    };

    const handleMouseMove = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        if (draggingIndex !== null) {
            const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
            const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

            updateBlock(draggingIndex, {
                x: Math.min(100, Math.max(0, mouseX - dragOffset.x)),
                y: Math.min(100, Math.max(0, mouseY - dragOffset.y))
            });
        } else if (resizingIndex !== null) {
            const block = textBlocks[resizingIndex];
            const mouseX = ((e.clientX - rect.left) / rect.width) * 100;

            // Calculate new width relative to the anchor point
            // For center alignment, width expands both ways, but simplified to track mouseX
            let newWidth;
            if (block.align === 'center') {
                newWidth = Math.abs(mouseX - block.x) * 2;
            } else if (block.align === 'right') {
                newWidth = block.x - mouseX;
            } else {
                newWidth = mouseX - block.x;
            }

            updateBlock(resizingIndex, {
                width: Math.min(100, Math.max(5, newWidth))
            });
        }
    };

    const handleMouseUp = () => {
        setDraggingIndex(null);
        setResizingIndex(null);
    };

    const insertPlaceholder = (placeholder) => {
        if (selectedBlockIndex === null) return;
        const block = textBlocks[selectedBlockIndex];
        updateBlock(selectedBlockIndex, {
            text: block.text + ` ${placeholder}`
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Map textBlocks to match the expected backend schema (Normalized Coordinates)
        const mappedBlocks = textBlocks.map(block => ({
            text: block.text,
            // GOLDEN RULE: Normalized Coordinates
            xPercent: block.x,
            yPercent: block.y,
            fontScale: block.fontSize,
            // Legacy Fields (Required for Validation)
            x: block.x,
            y: block.y,
            width: block.width || 30, // Save width for proper X positioning in backend
            fontSize: block.fontSize,

            fontWeight: block.fontWeight,
            color: block.color,
            align: block.align,
            // Keeping placeholderKey for backward compat if needed, but text is primary
            placeholderKey: block.text
        }));

        console.log("Certificate Editor Debug - Submit (Normalized):", {
            textBlocks: mappedBlocks,
            orientation
        });

        const data = {
            name: event?.title || "Participation Certificate",
            pageSize: "A4",
            orientation: orientation,
            textBlocks: mappedBlocks
        };
        onSave(data, backgroundFile);
    };

    const placeholders = [
        { label: "Full Name", value: "{{Student_full_name}}" },
        { label: "Email Address", value: "{{email}}" },
        { label: "Student Id", value: "{{identifier}}" },
        { label: "Event Title", value: "{{event}}" },
        { label: "Event Date", value: "{{eventDate}}" },
        { label: "Student's College Name", value: "{{Students_college}}" },
        ...(event?.club ? [{ label: "Club Name", value: "{{clubName}}" }] : []),
        ...(Array.isArray(event?.requiredUserFields)
            ? event.requiredUserFields
                .filter(f => !['name', 'email'].includes(f))
                .map(f => ({ label: SYSTEM_FIELD_LABELS[f] || f, value: `{{${f}}}` }))
            : [])
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Editor Sidebar */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-blue-600" /> Canvas Settings
                    </h3>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Orientation</label>
                        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                            {[
                                { label: 'Landscape', value: 'landscape' },
                                { label: 'Portrait', value: 'portrait' }
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setOrientation(opt.value)}
                                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${orientation === opt.value ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Background Template</label>
                        <div
                            className={`relative group overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-400 transition-all flex flex-col items-center justify-center bg-gray-50`}
                            style={{ aspectRatio: orientation === 'landscape' ? A4_ASPECT_RATIO : 1 / A4_ASPECT_RATIO }}
                        >
                            {background ? (
                                <>
                                    <img src={background} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="bg" />
                                    <div className="relative z-10 text-center p-4">
                                        <button
                                            onClick={() => document.getElementById('bg-upload').click()}
                                            className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-900 border border-gray-200 shadow-sm hover:bg-white transition"
                                        >
                                            Change Image
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-tight">Upload {orientation} PNG/JPG</p>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('bg-upload').click()}
                                        className="mt-4 bg-gray-900 text-white text-[10px] font-bold px-4 py-2 rounded-xl"
                                    >
                                        Browse Files
                                    </button>
                                </div>
                            )}
                            <input id="bg-upload" type="file" className="hidden" accept="image/*" onChange={handleBackgroundChange} onClick={(e) => (e.target.value = null)} />
                        </div>
                    </div>

                    <button
                        onClick={addTextBlock}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition"
                    >
                        <Plus className="w-4 h-4" /> Add Text Block
                    </button>
                </div>

                {selectedBlockIndex !== null && (
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Edit Block</h3>
                            <button onClick={() => removeBlock(selectedBlockIndex)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Content</label>
                                <textarea
                                    value={textBlocks[selectedBlockIndex].text}
                                    onChange={(e) => updateBlock(selectedBlockIndex, { text: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none"
                                    rows={3}
                                />
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {placeholders.map(p => (
                                    <button
                                        key={p.value}
                                        onClick={() => insertPlaceholder(p.value)}
                                        className="px-2.5 py-1 bg-gray-100 text-[10px] font-bold text-gray-600 rounded-lg hover:bg-gray-200 transition"
                                    >
                                        + {p.label}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Size</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={textBlocks[selectedBlockIndex].fontSize}
                                        onChange={(e) => updateBlock(selectedBlockIndex, { fontSize: parseFloat(e.target.value) || 0.1 })}
                                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Weight</label>
                                    <select
                                        value={textBlocks[selectedBlockIndex].fontWeight}
                                        onChange={(e) => updateBlock(selectedBlockIndex, { fontWeight: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black outline-none"
                                    >
                                        <option value="normal">Default</option>
                                        <option value="bold">Bold</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Color</label>
                                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                        <input
                                            type="color"
                                            value={textBlocks[selectedBlockIndex].color}
                                            onChange={(e) => updateBlock(selectedBlockIndex, { color: e.target.value })}
                                            className="w-6 h-6 rounded-md border-none cursor-pointer"
                                        />
                                        <span className="text-[10px] font-black uppercase text-gray-500">{textBlocks[selectedBlockIndex].color}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Align</label>
                                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 h-[42px]">
                                        {[
                                            { icon: AlignLeft, value: 'left' },
                                            { icon: AlignCenter, value: 'center' },
                                            { icon: AlignRight, value: 'right' }
                                        ].map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => updateBlock(selectedBlockIndex, { align: opt.value })}
                                                className={`flex-1 flex items-center justify-center rounded-lg transition ${textBlocks[selectedBlockIndex].align === opt.value ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                <opt.icon className="w-3.5 h-3.5" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Canvas Area */}
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm overflow-hidden relative group">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Design Interface</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Drag blocks to reposition</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 italic">
                                <Info className="w-3.5 h-3.5" /> A4 {orientation}
                            </div>
                        </div>
                    </div>

                    <div
                        className={`relative w-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-inner flex items-center justify-center group/canvas transition-all ${orientation === 'portrait' ? 'min-h-[600px]' : ''}`}
                        style={{
                            aspectRatio: orientation === 'landscape' ? A4_ASPECT_RATIO : 1 / A4_ASPECT_RATIO,
                            maxWidth: orientation === 'portrait' ? '500px' : 'none',
                            margin: '0 auto'
                        }}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        {/* The Actual Canvas Scaling container */}
                        <div
                            ref={canvasRef}
                            className="relative w-full h-full bg-white transition-opacity duration-500 origin-center canvas-grid"
                            style={{
                                backgroundImage: background ? `url(${background})` : 'none',
                                backgroundSize: '100% 100%',
                                backgroundRepeat: 'no-repeat',
                                // Fixed baseline of 800px width for coordinate system
                                // Real CSS dimension will vary, so we handle relative scaling in JS events
                            }}
                            onClick={() => setSelectedBlockIndex(null)}
                        >
                            {!background && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 flex-col gap-4">
                                    <ImageIcon className="w-20 h-20 text-gray-400" />
                                    <p className="font-black text-2xl uppercase tracking-tighter">No Background Image</p>
                                </div>
                            )}

                            {textBlocks.map((block, i) => {
                                const isSelected = selectedBlockIndex === i;

                                return (
                                    <div
                                        key={i}
                                        onMouseDown={(e) => handleMouseDown(e, i)}
                                        onClick={(e) => e.stopPropagation()}
                                        className={`absolute cursor-move select-none p-1 rounded hover:ring-2 hover:ring-blue-400 transition-shadow ${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 z-50 bg-blue-50/10' : 'z-10'}`}
                                        style={{
                                            left: `${block.x}%`,
                                            top: `${block.y}%`,
                                            width: `${block.width}%`,
                                            transform: block.align === 'center' ? 'translateX(-50%)' : block.align === 'right' ? 'translateX(-100%)' : 'none',
                                            fontSize: `calc(1cqw * ${block.fontSize * (orientation === 'landscape' ? 1.25 : 1.25)})` // Scale font relative to canvas width
                                        }}
                                    >
                                        <div style={{
                                            fontSize: 'inherit',
                                            fontWeight: block.fontWeight,
                                            color: block.color,
                                            textAlign: block.align,
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word'
                                        }}>
                                            {block.text}
                                        </div>

                                        {/* Resize Handle */}
                                        {isSelected && (
                                            <div
                                                onMouseDown={(e) => handleResizeStart(e, i)}
                                                className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white cursor-se-resize shadow-sm flex items-center justify-center transform translate-x-1/2 translate-y-1/2"
                                            >
                                                <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Overlay Controls if nothing uploaded */}
                        {!background && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
                                <div className="bg-white p-10 rounded-[32px] shadow-2xl border border-gray-100 text-center max-w-xs transition-transform transform hover:scale-105">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <ImageIcon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 mb-2">Upload Required</h4>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-8">
                                        Please upload a {orientation} background to begin designing your template.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('bg-upload').click()}
                                        className="w-full bg-blue-600 text-white rounded-2xl py-4 font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-95 transition"
                                    >
                                        Select Image
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        {initialData && (
                            <button
                                type="button"
                                onClick={onPreview}
                                disabled={!background || isPreviewing}
                                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-3 shadow-xl active:scale-95"
                            >
                                {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Eye className="w-4 h-4 text-white" />}
                                Preview Certificate
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleFormSubmit}
                            disabled={!background || isSaving}
                            className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-3 shadow-xl active:scale-95"
                        >
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                            Apply & Save Template
                        </button>
                    </div>
                </div>

                {/* Instructions Card */}
                <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex items-start gap-6 mt-8">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-amber-900 uppercase tracking-widest text-sm mb-2">Design Guidelines</h4>
                        <ul className="space-y-3">
                            {[
                                `Upload a high-resolution ${orientation} image.`,
                                "Include your logos, signatures, and static text directly in the background image.",
                                "Use placeholders like {{name}} for text that should change per student.",
                                "The 'Live Grid' and 'Registration Details' will use these templates for downloads."
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-bold text-amber-700/80 leading-relaxed">
                                    <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" /> {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showCropper && (
                    <ImageCropper
                        imageUrl={tempImage}
                        orientation={orientation}
                        onCrop={handleCropComplete}
                        onCancel={() => setShowCropper(false)}
                    />
                )}
            </AnimatePresence>

            <style>{`
                .canvas-grid::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background-image: 
                        linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                    z-index: 5;
                }
                .canvas-grid::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background-image: 
                        linear-gradient(to right, rgba(0,0,0,0.01) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,0,0,0.01) 1px, transparent 1px);
                    background-size: 8px 8px;
                    z-index: 4;
                }
            `}</style>
        </div>
    );
}

function ImageCropper({ imageUrl, orientation, onCrop, onCancel }) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const imageRef = useRef(null);

    const aspect = orientation === 'landscape' ? A4_ASPECT_RATIO : 1 / A4_ASPECT_RATIO;

    const handleCrop = () => {
        const canvas = document.createElement('canvas');
        const img = imageRef.current;
        const container = containerRef.current;

        const targetWidth = 2000;
        const targetHeight = Math.round(targetWidth / aspect);

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');

        // Calculate source rect based on current visual state
        const rect = container.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();

        // How many source pixels per visual pixel
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        const visualWidth = imgRect.width;
        const visualHeight = imgRect.height;

        const scaleX = naturalWidth / visualWidth;
        const scaleY = naturalHeight / visualHeight;

        // Visual offsets
        const visualX = rect.left - imgRect.left;
        const visualY = rect.top - imgRect.top;

        // Source coordinates
        const sx = visualX * scaleX;
        const sy = visualY * scaleY;
        const sWidth = rect.width * scaleX;
        const sHeight = rect.height * scaleY;

        console.log("Certificate Editor Debug - Crop:", {
            visualX, visualY,
            naturalWidth, naturalHeight,
            scaleX, scaleY,
            sx, sy, sWidth, sHeight,
            rect, imgRect
        });

        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            onCrop(blob, url);
        }, 'image/png', 1.0);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[40px] shadow-2xl overflow-hidden max-w-4xl w-full sm:w-[40vw] flex flex-col max-h-[90vh]"
            >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Snapshot Preview</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Adjust position to fit {orientation} frame</p>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <Trash2 className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6 md:p-10 bg-gray-100 flex">
                    <div
                        ref={containerRef}
                        className="relative bg-white shadow-2xl ring-1 ring-black/5 m-auto overflow-hidden flex-shrink-0"
                        style={{
                            aspectRatio: aspect,
                            width: `min(100%, calc(70vh * ${aspect}))`,
                            maxWidth: '100%',
                            maxHeight: '100%'
                        }}
                    >
                        <motion.img
                            ref={imageRef}
                            src={imageUrl}
                            drag
                            dragMomentum={false}
                            style={{
                                scale: scale,
                                cursor: 'move',
                                maxWidth: 'none',
                                width: '100%',
                                height: 'auto', // Keep natural ratio
                            }}
                            alt="crop-preview"
                        />
                        {/* Frame Overlay */}
                        <div className="absolute inset-0 border-2 border-blue-500/50 pointer-events-none z-10"></div>

                        {/* Visible Grid Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-20"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px'
                            }}
                        ></div>
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-100 space-y-1">
                    <div className="flex items-center gap-6">
                        <div className="flex-1">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Zoom Scale</label>
                            <input
                                type="range" min="0.1" max="10" step="0.01"
                                value={scale}
                                onChange={(e) => setScale(parseFloat(e.target.value))}
                                className="w-full accent-blue-600"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onCancel}
                            className="px-8 py-2 rounded-2xl font-black text-xs uppercase tracking-widest border border-gray-200 text-gray-400 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCrop}
                            className="px-10 py-2 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
                        >
                            Confirm Snapshot
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
