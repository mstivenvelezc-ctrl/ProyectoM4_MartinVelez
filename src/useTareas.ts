    // src/useTareas.ts
    import { useState, useEffect } from "react";

    export type EstadoTarea = "normal" | "prioridad" | "perdida";

    export interface Tarea {
    id: string;
    titulo: string;
    descripcion: string;
    fechaHora: Date;
    fechaEntrega?: Date;
    estado: EstadoTarea;
    }

    function calcularEstado(fechaEntrega?: Date): EstadoTarea {
    if (!fechaEntrega) return "normal";
    const ahora = new Date();
    const diff = fechaEntrega.getTime() - ahora.getTime();
    const horasRestantes = diff / (1000 * 60 * 60);

    if (horasRestantes < 0) return "perdida";
    if (horasRestantes <= 24) return "prioridad";
    return "normal";
    }

    export function useTareas() {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [error, setError] = useState("");

    // Recalcula estados cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
        setTareas((prev) =>
            prev.map((t) => ({
            ...t,
            estado: calcularEstado(t.fechaEntrega),
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

    const crearTarea = () => {
        if (!titulo.trim() || !descripcion.trim()) {
        setError("Por favor completa todos los campos.");
        return;
        }

        const entrega = fechaEntrega ? new Date(fechaEntrega) : undefined;

        const nueva: Tarea = {
        id: crypto.randomUUID(),
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        fechaHora: new Date(),
        fechaEntrega: entrega,
        estado: calcularEstado(entrega),
        };

        setTareas((prev) => [nueva, ...prev]);
        cerrarModal();
    };

    const eliminarTarea = (id: string) => {
        setTareas((prev) => prev.filter((t) => t.id !== id));
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
        formatearFecha,
    };
    }