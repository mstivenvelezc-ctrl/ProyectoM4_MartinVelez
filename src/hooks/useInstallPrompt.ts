            import { useState, useEffect, useRef } from "react";
            import Swal from 'sweetalert2';

            interface BeforeInstallPromptEvent extends Event {
            prompt: () => Promise<void>;
            userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
            }

            export function useInstallPrompt() {
            const [canInstall, setCanInstall] = useState(false);
            const promptRef = useRef<BeforeInstallPromptEvent | null>(null);

            const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
            const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

            useEffect(() => {
                const handler = (e: Event) => {
                e.preventDefault();
                promptRef.current = e as BeforeInstallPromptEvent;
                setCanInstall(true);
                };
                window.addEventListener("beforeinstallprompt", handler);
                return () => window.removeEventListener("beforeinstallprompt", handler);
            }, []);

        const install = async () => {
    if (!promptRef.current) return;

    // 1. Tu Swal primero como confirmación
    const { isConfirmed } = await Swal.fire({
        title: "Instalar MyTask",
        text: "Agrega la app a tu pantalla de inicio para acceder más rápido.",
        icon: "question",
        background: "#0a0a0a",
        color: "#e2e2e2",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "📲 Instalar",
        cancelButtonText: "Ahora no",
        showCancelButton: true,
    });

    if (!isConfirmed) return;

    // 2. Luego el prompt del navegador 
    await promptRef.current.prompt();
    const { outcome } = await promptRef.current.userChoice;

    if (outcome === "accepted") {
        setCanInstall(false);
        Swal.fire({
        icon: "success",
        title: "¡App instalada!",
        text: "Ya puedes acceder desde tu pantalla de inicio.",
        background: "#0a0a0a",
        color: "#e2e2e2",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "Genial 🚀",
        timer: 3000,
        timerProgressBar: true,
        });
    }
    };
    return { canInstall, install, isIOS, isStandalone };
    }