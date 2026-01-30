import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode } from 'lucide-react';
import { useRef } from 'react';

export default function EventQRCode({ url, eventTitle }) {
    const qrRef = useRef();

    const downloadQRCode = () => {
        const svg = qrRef.current.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            // Add some padding to the canvas
            const padding = 20;
            canvas.width = img.width + padding * 2;
            canvas.height = img.height + padding * 2;

            // Fill background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img, padding, padding);

            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `QRCode-${eventTitle.replace(/\s+/g, '-').toLowerCase()}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                <QrCode className="w-4 h-4 text-purple-600" /> Event QR Code
            </h3>
            <div className="flex flex-col items-center gap-4">
                <div ref={qrRef} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                    <QRCodeSVG
                        value={url}
                        size={160}
                        level="H"
                        includeMargin={false}
                    />
                </div>
                <button
                    onClick={downloadQRCode}
                    className="w-full py-3 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition border border-gray-200 shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    <Download className="w-4 h-4 text-blue-600" />
                    Download QR Code
                </button>
            </div>
        </div>
    );
}
