    // src/useTareas.ts
    import { useState, useEffect } from "react";

    export type EstadoTarea = "normal" | "prioridad" | "perdida" | "completada";

    export interface Tarea {
    id: string;
    titulo: string;
    descripcion: string;
    fechaHora: Date;
    fechaEntrega?: Date;
    estado: EstadoTarea;
    completada: boolean;
    }

    const STORAGE_KEY = "mytask_tareas";

    function calcularEstado(fechaEntrega?: Date): EstadoTarea {
    if (!fechaEntrega) return "normal";
    const ahora = new Date();
    const diff = fechaEntrega.getTime() - ahora.getTime();
    const horasRestantes = diff / (1000 * 60 * 60);
    if (horasRestantes < 0) return "perdida";
    if (horasRestantes <= 24) return "prioridad";
    return "normal";
    }

    // Carga desde localStorage y convierte fechas de string a Date
    function cargarTareas(): Tarea[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return parsed.map((t: Tarea) => ({
        ...t,
        fechaHora: new Date(t.fechaHora),
        fechaEntrega: t.fechaEntrega ? new Date(t.fechaEntrega) : undefined,
        completada: t.completada ?? false,

        // Si ya está completada, mantener ese estado; si no, recalcular
        estado: t.estado === "completada" 
        ? "completada" 
        : calcularEstado(t.fechaEntrega ? new Date(t.fechaEntrega) : undefined), 
        }));
    } catch {
        return [];
    }
    }

    function guardarTareas(tareas: Tarea[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
    }

    export function useTareas() {
    const [tareas, setTareas] = useState<Tarea[]>(cargarTareas);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [error, setError] = useState("");
    

    // Guarda en localStorage cada vez que cambian las tareas
    useEffect(() => {
        guardarTareas(tareas);
    }, [tareas]);

    // Recalcula estados cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
        setTareas((prev) =>
            prev.map((t) => ({
            ...t,
            estado: t.estado === "completada"
            ? "completada"
            : calcularEstado(t.fechaEntrega),
            }))
        );
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const abrirModal = () => {
        setTitulo("");
        setDescripcion("");
        setFechaEntrega("");
        setError("");
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setError("");
    };

    const eliminarTarea = (id: string) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
        setTareas((prev) => prev.filter((t) => t.id !== id));
        }
    };

    const completarTarea = (id: string) => {
        if (window.confirm("Una vez colmpletada la tarea no se puede desdmarcar")) {
        setTareas((prev) => prev.map((t) => t.id === id ? { ...t, completada: true, estado: "completada" } : t
        ));
        }
    };

    const crearTarea = () => {
        if (!titulo.trim() || !descripcion.trim()) {
        setError("Por favor completa todos los campos.");
        return;
        }
        if (titulo.trim().length < 3) {
        setError("El título debe tener al menos 3 caracteres.");
        return;
        }
        if (descripcion.trim().length < 5) {
        setError("La descripción debe tener al menos 5 caracteres.");
        return;
        }
        if (descripcion.trim().length > 200) {
        setError("La descripción no puede superar los 200 caracteres.");
        return;
        }

        const ahora = new Date();
        const entrega = fechaEntrega ? new Date(fechaEntrega) : undefined;

        if (entrega) {
        const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        const fechaEntregaSoloDia = new Date(entrega.getFullYear(), entrega.getMonth(), entrega.getDate());
        if (fechaEntregaSoloDia < hoy) {
            setError("La fecha de entrega no puede ser anterior al día de hoy.");
            return;
        }
        if (fechaEntregaSoloDia.getTime() === hoy.getTime()) {
            const mediaHoraDespues = new Date(ahora.getTime() + 30 * 60 * 1000);
            if (entrega.getTime() < mediaHoraDespues.getTime()) {
            setError("La hora de entrega debe ser al menos 30 minutos después de la hora actual.");
            return;
            }
        }
        }

        const nueva: Tarea = {
        id: crypto.randomUUID(),
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        fechaHora: new Date(),
        fechaEntrega: entrega,
        estado: calcularEstado(entrega),
        completada: false,
        };

        setTareas((prev) => [nueva, ...prev]);
        cerrarModal();
    };

    const formatearFecha = (fecha: Date): string => {
        return fecha.toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        });
    };

    return {
        tareas,
        modalAbierto,
        titulo,
        descripcion,
        fechaEntrega,
        error,
        setTitulo,
        setDescripcion,
        setFechaEntrega,
        abrirModal,
        cerrarModal,
        crearTarea,
        eliminarTarea,
        completada: false,
        formatearFecha,
        completarTarea,
    };
    }