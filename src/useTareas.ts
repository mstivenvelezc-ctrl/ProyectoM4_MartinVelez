    // src/useTareas.ts
    import { useState, useEffect } from "react";
    import Swal from 'sweetalert2';

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

    const swalEstilos = {
    customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel",
    },
    };

    function getStorageKey(correo: string) {
    return `mytask_tareas_${correo}`;
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

    function cargarTareas(key: string): Tarea[] {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return parsed.map((t: Tarea) => ({
        ...t,
        fechaHora: new Date(t.fechaHora),
        fechaEntrega: t.fechaEntrega ? new Date(t.fechaEntrega) : undefined,
        completada: t.completada ?? false,
        estado: t.estado === "completada"
            ? "completada"
            : calcularEstado(t.fechaEntrega ? new Date(t.fechaEntrega) : undefined),
        }));
    } catch {
        return [];
    }
    }

    function guardarTareas(key: string, tareas: Tarea[]) {
    localStorage.setItem(key, JSON.stringify(tareas));
    }

    export function useTareas(correo: string) {
    const key = getStorageKey(correo);

    const [tareas, setTareas] = useState<Tarea[]>(() => cargarTareas(key));
    const [modalAbierto, setModalAbierto] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [error, setError] = useState("");
    const [modalEditar, setModalEditar] = useState(false);
    const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
    const [tituloEditar, setTituloEditar] = useState("");
    const [descripcionEditar, setDescripcionEditar] = useState("");
    const [fechaEntregaEditar, setFechaEntregaEditar] = useState("");
    const [errorEditar, setErrorEditar] = useState("");

    const [currentKey, setCurrentKey] = useState(key);
    if (key !== currentKey) {
        setCurrentKey(key);
        setTareas(cargarTareas(key));
    }

    useEffect(() => {
        guardarTareas(key, tareas);
    }, [tareas, key]);

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
    const tarea = tareas.find((t) => t.id === id);
    const esCompletada = tarea?.estado === "completada";

    Swal.fire({
        title: esCompletada ? "¿Eliminar tarea completada?" : "¿Eliminar tarea?",
        text: esCompletada
        ? "La tarea fue completada. ¿Deseas eliminarla del historial?"
        : "Esta acción no se puede deshacer.",
        icon: esCompletada ? "success" : "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        ...swalEstilos,
        }).then((result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {
        setTareas((prev) => prev.filter((t) => t.id !== id));
        }
        });
    };

    const completarTarea = (id: string) => {
        Swal.fire({
        title: "¿Completar tarea?",
        text: "Una vez completada no se puede desmarcar.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, completar",
        cancelButtonText: "Cancelar",
        ...swalEstilos,
        }).then((result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {
            setTareas((prev) =>
            prev.map((t) => t.id === id ? { ...t, completada: true, estado: "completada" } : t)
            );
        }
        });
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

        Swal.fire({
        title: "¡Tarea creada!",
        text: `"${nueva.titulo}" fue agregada correctamente.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        ...swalEstilos,
        });
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

    const abrirModalEditar = (tarea: Tarea) => {
  setTareaEditando(tarea);
  setTituloEditar(tarea.titulo);
  setDescripcionEditar(tarea.descripcion);
  setFechaEntregaEditar(
    tarea.fechaEntrega
      ? new Date(tarea.fechaEntrega.getTime() - tarea.fechaEntrega.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
      : ""
  );
  setErrorEditar("");
  setModalEditar(true);
};

const cerrarModalEditar = () => {
  setModalEditar(false);
  setTareaEditando(null);
  setErrorEditar("");
};

    const guardarEdicion = () => {
    if (!tituloEditar.trim() || !descripcionEditar.trim()) {
        setErrorEditar("Por favor completa todos los campos.");
        return;
    }
    if (tituloEditar.trim().length < 3) {
        setErrorEditar("El título debe tener al menos 3 caracteres.");
        return;
    }
    if (descripcionEditar.trim().length < 5) {
        setErrorEditar("La descripción debe tener al menos 5 caracteres.");
        return;
    }
    if (descripcionEditar.trim().length > 200) {
        setErrorEditar("La descripción no puede superar los 200 caracteres.");
        return;
    }

    const entrega = fechaEntregaEditar ? new Date(fechaEntregaEditar) : undefined;

    setTareas((prev) =>
        prev.map((t) =>
        t.id === tareaEditando?.id
            ? {
                ...t,
                titulo: tituloEditar.trim(),
                descripcion: descripcionEditar.trim(),
                fechaEntrega: entrega,
                estado: calcularEstado(entrega),
            }
            : t
        )
    );

    cerrarModalEditar();

    Swal.fire({
        title: "¡Tarea actualizada!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        ...swalEstilos,
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
        completarTarea,
        formatearFecha,
        modalEditar,
        tituloEditar,
        descripcionEditar,
        fechaEntregaEditar,
        errorEditar,
        setTituloEditar,
        setDescripcionEditar,
        setFechaEntregaEditar,
        abrirModalEditar,
        cerrarModalEditar,
        guardarEdicion,
    };
    }