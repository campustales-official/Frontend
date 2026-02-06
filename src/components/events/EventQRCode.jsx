import QRCodeStyling from 'qr-code-styling';
import { Download, QrCode, Palette, Circle } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const QR_THEMES = [
    { id: 'dots', name: 'Dotted', dots: 'dots', corners: 'extra-rounded' },
    { id: 'rounded', name: 'Rounded', dots: 'rounded', corners: 'extra-rounded' },
    { id: 'classy', name: 'Classy', dots: 'classy', corners: 'extra-rounded' },
    { id: 'classy-rounded', name: 'Premium', dots: 'classy-rounded', corners: 'extra-rounded' },
    { id: 'square', name: 'Square', dots: 'square', corners: 'square' },
];

const QR_COLORS = [
    { name: 'Midnight', color: '#1e293b' },
    { name: 'Royal Blue', color: '#2563eb' },
    { name: 'Deep Purple', color: '#7c3aed' },
    { name: 'Emerald', color: '#059669' },
    { name: 'Crimson', color: '#dc2626' },
    { name: 'Sunset', color: '#f59e0b' },
];

export default function EventQRCode({ url, eventTitle }) {
    const qrRef = useRef();
    const [theme, setTheme] = useState(QR_THEMES[0]);
    const [activeColor, setActiveColor] = useState(QR_COLORS[1].color);
    const [qrCode] = useState(new QRCodeStyling({
        width: 300,
        height: 300,
        type: 'svg',
        data: url,
        margin: 10,
        qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: 'Q'
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 20
        },
        dotsOptions: {
            color: activeColor,
            type: 'dots'
        },
        backgroundOptions: {
            color: 'transparent',
        },
        cornersSquareOptions: {
            color: activeColor,
            type: 'extra-rounded'
        },
        cornersDotOptions: {
            color: activeColor,
            type: 'dot'
        }
    }));

    useEffect(() => {
        if (qrRef.current) {
            qrRef.current.innerHTML = '';
            qrCode.append(qrRef.current);
        }
    }, [qrCode]);

    useEffect(() => {
        qrCode.update({
            dotsOptions: {
                type: theme.dots,
                color: activeColor
            },
            cornersSquareOptions: {
                type: theme.corners,
                color: activeColor
            },
            cornersDotOptions: {
                type: theme.dots === 'dots' || theme.dots === 'rounded' ? 'dot' : 'square',
                color: activeColor
            }
        });
    }, [theme, activeColor, qrCode]);

    const downloadQRCode = () => {
        qrCode.download({
            name: `QRCode-${eventTitle.replace(/\s+/g, '-').toLowerCase()}`,
            extension: 'png'
        });
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-blue-600" /> Share Event
                </h3>
            </div>

            <div className="flex flex-col items-center gap-6">
                {/* QR Display Container - Adjusted for visibility */}
                <div
                    className="p-1 bg-white rounded-3xl border-4 border-gray-50 shadow-inner overflow-hidden flex items-center justify-center"
                    style={{ width: '220px', height: '220px' }}
                >
                    <div
                        ref={qrRef}
                        className="scale-[0.7] transform origin-center"
                    ></div>
                </div>

                {/* Theme Selector */}
                <div className="w-full space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Palette className="w-3 h-3" /> Select Style
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {QR_THEMES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t)}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${theme.id === t.id
                                        ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                                        : "bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200"
                                    }`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Selector */}
                <div className="w-full space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Circle className="w-3 h-3" /> Choose Color
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                        {QR_COLORS.map((c) => (
                            <button
                                key={c.color}
                                onClick={() => setActiveColor(c.color)}
                                className={`w-7 h-7 rounded-full border-2 transition-all transform active:scale-90 ${activeColor === c.color ? "ring-2 ring-gray-900 ring-offset-1 scale-110" : "border-white shadow-sm"
                                    }`}
                                style={{ backgroundColor: c.color }}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={downloadQRCode}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    <Download className="w-4 h-4" />
                    Download Ticket QR
                </button>
            </div>
        </div>
    );
}
