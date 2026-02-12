import { useState, useEffect } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InstallPWAPrompt() {
    const { installPrompt, isAppInstalled, install } = usePWA();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('pwa_prompt_dismissed');
        if (installPrompt && !isAppInstalled && !dismissed) {
            // Delay showing the prompt slightly for better UX
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [installPrompt, isAppInstalled]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pwa_prompt_dismissed', 'true');
    };

    const handleInstall = async () => {
        setIsVisible(false);
        await install();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-24 left-4 right-4 md:bottom-8 md:right-8 md:left-auto md:w-96 z-50"
                >
                    <div className="bg-white rounded-xl shadow-2xl border border-blue-100 overflow-hidden">
                        <div className="p-4 flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Download className="text-white w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">Install CampusTales</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Install our app for a better experience and quicker access!
                                </p>
                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={handleInstall}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Install Now
                                    </button>
                                    <button
                                        onClick={handleDismiss}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Later
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="h-1 bg-blue-600 w-full animate-pulse" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
