    // src/WhatsApp.service.ts
    import type { Tarea } from "./Tareas.types";

    function generarMensajeAlerta(tareas: Tarea[], nombre: string): string {
    const perdidas    = tareas.filter((t) => t.estado === "perdida");
    const prioridad   = tareas.filter((t) => t.estado === "prioridad");
    const completadas = tareas.filter((t) => t.estado === "completada");
    const normales    = tareas.filter((t) => t.estado === "normal");

    const lineas: string[] = [
        `📋 *MyTask — Resumen de tareas*`,
        `Hola *${nombre}*, aquí tu resumen:`,
        ``,
        `📊 *Estado general*`,
        `• Total: ${tareas.length}`,
        `• ✅ Completadas: ${completadas.length}`,
        `• ● Activas: ${normales.length}`,
        `• ⚠️ Prioridad: ${prioridad.length}`,
        `• ✕ Perdidas: ${perdidas.length}`,
    ];

    if (perdidas.length > 0) {
        lineas.push(``, `🔴 *Tareas perdidas:*`);
        perdidas.forEach((t) => lineas.push(`• ${t.titulo}`));
    }

    if (prioridad.length > 0) {
        lineas.push(``, `⚠️ *Tareas urgentes (menos de 24h):*`);
        prioridad.forEach((t) => {
        const entrega = t.fechaEntrega
            ? new Date(t.fechaEntrega).toLocaleString("es-CO", {
                day: "2-digit", month: "2-digit",
                hour: "2-digit", minute: "2-digit",
            })
            : "Sin fecha";
        lineas.push(`• ${t.titulo} — vence: ${entrega}`);
        });
    }

    lineas.push(``, `_Enviado desde MyTask_ 🚀`);
    return lineas.join("\n");
    }

    export class SandboxError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "SandboxError";
    }
    }

    export async function enviarAlertaWhatsApp(
    telefono: string,
    nombre: string,
    tareas: Tarea[]
    ): Promise<void> {
    const message = generarMensajeAlerta(tareas, nombre);

    const response = await fetch("/api/sendWhatsApp", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: telefono, message }),
    });

    if (!response.ok) {
        let data: { error?: string; message?: string } = {};
        try { data = await response.json(); } catch { /* empty */ }

        // Número no registrado en Sandbox
        if (data.error === "SANDBOX_NOT_REGISTERED" || response.status === 403) {
        throw new SandboxError(data.message ?? "Número no registrado.");
        }

        throw new Error(data.error ?? `Error del servidor (${response.status}).`);
    }
    }