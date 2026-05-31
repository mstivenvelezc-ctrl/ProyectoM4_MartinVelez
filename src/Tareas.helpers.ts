    // src/tareas.helpers.ts — funciones puras sin efectos secundarios

    import type { EstadoTarea } from "./Tareas.types";

    export const swalEstilos = {
    customClass: {
        popup:         "swal-popup",
        title:         "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm",
        cancelButton:  "swal-cancel",
    },
    };

    export function calcularEstado(fechaEntrega?: Date): EstadoTarea {
    if (!fechaEntrega) return "normal";
    const ahora = new Date();
    const diff  = fechaEntrega.getTime() - ahora.getTime();
    const horasRestantes = diff / (1000 * 60 * 60);
    if (horasRestantes < 0)   return "perdida";
    if (horasRestantes <= 24) return "prioridad";
    return "normal";
    }

    export function formatearFecha(fecha: Date): string {
    return fecha.toLocaleString("es-CO", {
        day:    "2-digit",
        month:  "2-digit",
        year:   "numeric",
        hour:   "2-digit",
        minute: "2-digit",
    });
    }

    export function validarTarea(
    titulo: string,
    descripcion: string,
    fechaEntrega: string
    ): string | null {
    if (!titulo.trim() || !descripcion.trim())
        return "Por favor completa todos los campos.";
    if (titulo.trim().length < 3)
        return "El título debe tener al menos 3 caracteres.";
    if (descripcion.trim().length < 5)
        return "La descripción debe tener al menos 5 caracteres.";
    if (descripcion.trim().length > 200)
        return "La descripción no puede superar los 200 caracteres.";

    if (fechaEntrega) {
        const ahora  = new Date();
        const entrega = new Date(fechaEntrega);
        const hoy    = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        const solodia = new Date(entrega.getFullYear(), entrega.getMonth(), entrega.getDate());

        if (solodia < hoy)
        return "La fecha de entrega no puede ser anterior al día de hoy.";
        if (solodia.getTime() === hoy.getTime()) {
        const mediaHora = new Date(ahora.getTime() + 30 * 60 * 1000);
        if (entrega.getTime() < mediaHora.getTime())
            return "La hora de entrega debe ser al menos 30 minutos después de la hora actual.";
        }
    }
    return null;
    }

    // ── Ordenar por prioridad ─────────────────────────────────────────────────────
    // Orden: perdida → prioridad → normal → completada
    const ORDEN_ESTADO: Record<string, number> = {
    perdida:    0,
    prioridad:  1,
    normal:     2,
    completada: 3,
    };

    export function ordenarPorPrioridad<T extends { estado: string; fechaEntrega?: Date }>(
    tareas: T[]
    ): T[] {
    return [...tareas].sort((a, b) => {
        const diff = (ORDEN_ESTADO[a.estado] ?? 2) - (ORDEN_ESTADO[b.estado] ?? 2);
        if (diff !== 0) return diff;
        // mismo estado → ordena por fecha de entrega más próxima
        if (a.fechaEntrega && b.fechaEntrega) {
        return a.fechaEntrega.getTime() - b.fechaEntrega.getTime();
        }
        if (a.fechaEntrega) return -1;
        if (b.fechaEntrega) return 1;
        return 0;
    });
    }