import { useState, useEffect } from 'react';

export const usePWA = () => {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isAppInstalled, setIsAppInstalled] = useState(false);

    useEffect(() => {
        // Check if the event was already captured globally (before React mounted)
        if (window.__pwaInstallPrompt) {
            setInstallPrompt(window.__pwaInstallPrompt);
            window.__pwaInstallPrompt = null;
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        const handleAppInstalled = () => {
            setIsAppInstalled(true);
            setInstallPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Check if app is already installed (standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            setIsAppInstalled(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const install = async () => {
        if (!installPrompt) return;

        // Show the prompt
        installPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await installPrompt.userChoice;

        // We've used the prompt, and can't use it again, throw it away
        setInstallPrompt(null);
    };

    return { installPrompt, isAppInstalled, install };
};
