    // src/useTareas.ts — hook principal (solo estado + lógica UI)

    import { useState, useEffect } from "react";
    import Swal from "sweetalert2";
    import type { Tarea } from "./Tareas.types";
    import { calcularEstado, formatearFecha, validarTarea, swalEstilos, ordenarPorPrioridad } from "./Tareas.helpers";
    import {
    crearTareaFS,
    actualizarTareaFS,
    eliminarTareaFS,
    suscribirTareas,
    } from "./Tareas.service";

    export type { Tarea };

    export function useTareas(correo: string) {
    const [tareas, setTareas]           = useState<Tarea[]>([]);
    const [cargando, setCargando]       = useState(false);
    const [creando, setCreando]   = useState(false);

    // Modal crear
    const [modalAbierto, setModalAbierto] = useState(false);
    const [titulo, setTitulo]             = useState("");
    const [descripcion, setDescripcion]   = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [error, setError]               = useState("");

    // Modal editar
    const [modalEditar, setModalEditar]               = useState(false);
    const [tareaEditando, setTareaEditando]           = useState<Tarea | null>(null);
    const [tituloEditar, setTituloEditar]             = useState("");
    const [descripcionEditar, setDescripcionEditar]   = useState("");
    const [fechaEntregaEditar, setFechaEntregaEditar] = useState("");
    const [errorEditar, setErrorEditar]               = useState("");

    // ── Suscripción en tiempo real ─────────────────────────────────────────────
    useEffect(() => {
        if (!correo) return;
        const unsub = suscribirTareas(
        correo,
        (data) => { setTareas(ordenarPorPrioridad(data)); setCargando(false); },
        ()     => { setCargando(false); }
        );
        return () => unsub();
    }, [correo]);

    // ── Actualizar estado cada minuto (prioridad / perdida) ────────────────────
    useEffect(() => {
        const interval = setInterval(() => {
        setTareas((prev) =>
            prev.map((t) => ({
            ...t,
            estado: t.completada ? "completada" : calcularEstado(t.fechaEntrega),
            }))
        );
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // ── Modal crear ────────────────────────────────────────────────────────────
    const abrirModal = () => {
        setTitulo(""); setDescripcion(""); setFechaEntrega(""); setError("");
        setModalAbierto(true);
    };
    const cerrarModal = () => { setModalAbierto(false); setError(""); };

    // ── CREATE ─────────────────────────────────────────────────────────────────
    const crearTarea = async () => {
        const err = validarTarea(titulo, descripcion, fechaEntrega);
        if (err) { setError(err); return; }
        if (creando) return;

        setCreando(true);
        const entrega = fechaEntrega ? new Date(fechaEntrega) : undefined;
        const nueva: Omit<Tarea, "id"> = {
        titulo:      titulo.trim(),
        descripcion: descripcion.trim(),
        fechaHora:   new Date(),
        fechaEntrega: entrega,
        estado:      calcularEstado(entrega),
        completada:  false,
        };

        try {
        await crearTareaFS(correo, nueva);
        cerrarModal();
        Swal.fire({
            title: "¡Tarea creada!",
            text:  `"${nueva.titulo}" fue agregada correctamente.`,
            icon:  "success",
            timer: 2000,
            showConfirmButton: false,
            ...swalEstilos,
        });
        } catch {
        setError("Error al guardar la tarea. Intenta de nuevo.");
        }finally {
    setCreando(false); 
    }
    };

    // ── DELETE ─────────────────────────────────────────────────────────────────
    const eliminarTarea = (id: string) => {
        const tarea       = tareas.find((t) => t.id === id);
        const esCompletada = tarea?.estado === "completada";

        Swal.fire({
        title: esCompletada ? "¿Eliminar tarea completada?" : "¿Eliminar tarea?",
        text:  esCompletada
            ? "La tarea fue completada. ¿Deseas eliminarla del historial?"
            : "Esta acción no se puede deshacer.",
        icon: esCompletada ? "success" : "warning",
        showCancelButton:  true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText:  "Cancelar",
        ...swalEstilos,
        }).then(async (result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {
            try {
            await eliminarTareaFS(correo, id);
            } catch {
            Swal.fire({ title: "Error al eliminar", icon: "error", ...swalEstilos });
            }
        }
        });
    };

    // ── COMPLETAR ──────────────────────────────────────────────────────────────
    const completarTarea = (id: string) => {
        Swal.fire({
        title: "¿Completar tarea?",
        text:  "Una vez completada no se puede desmarcar.",
        icon:  "question",
        showCancelButton:  true,
        confirmButtonText: "Sí, completar",
        cancelButtonText:  "Cancelar",
        ...swalEstilos,
        }).then(async (result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {
            try {
            await actualizarTareaFS(correo, id, { completada: true, estado: "completada" });
            } catch {
            Swal.fire({ title: "Error al actualizar", icon: "error", ...swalEstilos });
            }
        }
        });
    };

    // ── Modal editar ───────────────────────────────────────────────────────────
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
        setModalEditar(false); setTareaEditando(null); setErrorEditar("");
    };

    // ── UPDATE ─────────────────────────────────────────────────────────────────
    const guardarEdicion = async () => {
        const err = validarTarea(tituloEditar, descripcionEditar, fechaEntregaEditar);
        if (err) { setErrorEditar(err); return; }
        if (!tareaEditando) return;

        const entrega = fechaEntregaEditar ? new Date(fechaEntregaEditar) : undefined;

        try {
        await actualizarTareaFS(correo, tareaEditando.id, {
            titulo:       tituloEditar.trim(),
            descripcion:  descripcionEditar.trim(),
            fechaEntrega: entrega,
            estado:       calcularEstado(entrega),
        });
        cerrarModalEditar();
        Swal.fire({
            title: "¡Tarea actualizada!",
            icon:  "success",
            timer: 1500,
            showConfirmButton: false,
            ...swalEstilos,
        });
        } catch {
        setErrorEditar("Error al actualizar la tarea. Intenta de nuevo.");
        }
    };

    return {
        tareas,
        cargando,
        creando,
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