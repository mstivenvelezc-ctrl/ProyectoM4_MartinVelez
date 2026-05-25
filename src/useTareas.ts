    // src/useTareas.ts
    import { useState } from "react";

    export interface Tarea {
    id: string;
    titulo: string;
    descripcion: string;
    fechaHora: Date;
    }

    export function useTareas() {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [error, setError] = useState("");

    const abrirModal = () => {
        setTitulo("");
        setDescripcion("");
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

        const nueva: Tarea = {
        id: crypto.randomUUID(),
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        fechaHora: new Date(),
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
        error,
        setTitulo,
        setDescripcion,
        abrirModal,
        cerrarModal,
        crearTarea,
        eliminarTarea,
        formatearFecha,
    };
    }