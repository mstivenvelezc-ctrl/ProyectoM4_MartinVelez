    import { useState } from "react";
    import { useInstallPrompt } from "../hooks/useInstallPrompt";

    export function InstallButton() {
    const { canInstall, install, isIOS, isStandalone } = useInstallPrompt();
    const [iosDismissed, setIosDismissed] = useState(false);

    if (isStandalone) return null;

    if (canInstall) {
        return (
        <button onClick={install} className="btn-install">
            📲 Agregalo a tu inicio
        </button>
        );
    }

    if (isIOS && !iosDismissed) {
        return (
        <div className="ios-install-hint">
            <span translate="no">
            <span>Toca <strong>Compartir ⬆</strong> → "Agregalo a tu inicio"</span>
            </span>
            <button onClick={() => setIosDismissed(true)}>✕</button>
        </div>
        );
    }

    return null;
    }