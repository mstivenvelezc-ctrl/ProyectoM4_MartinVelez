    // src/email.service.ts — llama al endpoint sin exponer credenciales

    import type { Tarea } from "./Tareas.types";

    function generarResumen(tareas: Tarea[], nombre: string): string {
    const total      = tareas.length;
    const completadas = tareas.filter((t) => t.estado === "completada").length;
    const perdidas    = tareas.filter((t) => t.estado === "perdida").length;
    const prioridad   = tareas.filter((t) => t.estado === "prioridad").length;
    const normales    = tareas.filter((t) => t.estado === "normal").length;

    const lineas = tareas.map((t, i) => {
        const entrega = t.fechaEntrega
        ? new Date(t.fechaEntrega).toLocaleString("es-CO", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
            })
        : "Sin fecha";

        const estadoLabel: Record<string, string> = {
        completada: "✓ Completada",
        perdida:    "✕ Perdida",
        prioridad:  "⚠ Prioridad",
        normal:     "● Activa",
        };

        return [
        `${i + 1}. ${t.titulo}`,
        `   Estado:      ${estadoLabel[t.estado] ?? t.estado}`,
        `   Descripción: ${t.descripcion}`,
        `   Entrega:     ${entrega}`,
        ].join("\n");
    });

    return [
        `Hola ${nombre},`,
        ``,
        `Aquí tienes el resumen de tus tareas en MyTask:`,
        ``,
        `📊 RESUMEN GENERAL`,
        `──────────────────`,
        `Total:       ${total}`,
        `Completadas: ${completadas}`,
        `Activas:     ${normales}`,
        `Prioridad:   ${prioridad}`,
        `Perdidas:    ${perdidas}`,
        ``,
        `📋 DETALLE DE TAREAS`,
        `────────────────────`,
        ...lineas,
        ``,
        `— MyTask`,
    ].join("\n");
    }

    export async function enviarResumenEmail(
    correo: string,
    nombre: string,
    tareas: Tarea[]
    ): Promise<void> {
    const body = generarResumen(tareas, nombre);

    const response = await fetch("/api/send-email", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        to:      correo,
        subject: "📋 Resumen de tus tareas — MyTask",
        body,
        }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Error al enviar el email.");
    }
    }