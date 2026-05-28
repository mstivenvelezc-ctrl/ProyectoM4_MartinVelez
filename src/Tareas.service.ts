    // src/tareas.service.ts — CRUD contra Firestore

    import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    Timestamp,
    type Unsubscribe,
    } from "firebase/firestore";
    import { db } from "./firebase";
    import type { Tarea } from "./Tareas.types";
    import { calcularEstado } from "./Tareas.helpers";

    // Colección: users/{correo}/tareas
    function tareasRef(correo: string) {
    return collection(db, "users", correo, "tareas");
    }

    // Convierte documento Firestore → Tarea
    function docToTarea(id: string, data: Record<string, unknown>): Tarea {
    const fechaEntrega = data.fechaEntrega
        ? (data.fechaEntrega as Timestamp).toDate()
        : undefined;

    const estado = data.completada
        ? "completada"
        : calcularEstado(fechaEntrega);

    return {
        id,
        titulo:       data.titulo as string,
        descripcion:  data.descripcion as string,
        fechaHora:    (data.fechaHora as Timestamp).toDate(),
        fechaEntrega,
        estado,
        completada:   data.completada as boolean,
    };
    }

    // ── CREATE ───────────────────────────────────────────────────────────────────
    export async function crearTareaFS(
    correo: string,
    tarea: Omit<Tarea, "id">
    ): Promise<string> {
    const ref = await addDoc(tareasRef(correo), {
        titulo:       tarea.titulo,
        descripcion:  tarea.descripcion,
        fechaHora:    Timestamp.fromDate(tarea.fechaHora),
        fechaEntrega: tarea.fechaEntrega
        ? Timestamp.fromDate(tarea.fechaEntrega)
        : null,
        estado:    tarea.estado,
        completada: tarea.completada,
    });
    return ref.id;
    }

    // ── UPDATE ───────────────────────────────────────────────────────────────────
    export async function actualizarTareaFS(
    correo: string,
    id: string,
    campos: Partial<Omit<Tarea, "id">>
    ): Promise<void> {
    const data: Record<string, unknown> = { ...campos };

    if (campos.fechaEntrega !== undefined) {
        data.fechaEntrega = campos.fechaEntrega
        ? Timestamp.fromDate(campos.fechaEntrega)
        : null;
    }
    if (campos.fechaHora) {
        data.fechaHora = Timestamp.fromDate(campos.fechaHora);
    }

    await updateDoc(doc(tareasRef(correo), id), data);
    }

    // ── DELETE ───────────────────────────────────────────────────────────────────
    export async function eliminarTareaFS(
    correo: string,
    id: string
    ): Promise<void> {
    await deleteDoc(doc(tareasRef(correo), id));
    }

    // ── READ (tiempo real) ───────────────────────────────────────────────────────
    export function suscribirTareas(
    correo: string,
    onData: (tareas: Tarea[]) => void,
    onError?: (e: Error) => void
    ): Unsubscribe {
    const q = query(tareasRef(correo), orderBy("fechaHora", "desc"));

    return onSnapshot(
        q,
        (snap) => {
        const tareas = snap.docs.map((d) =>
            docToTarea(d.id, d.data() as Record<string, unknown>)
        );
        onData(tareas);
        },
        (err) => onError?.(err)
    );
    }