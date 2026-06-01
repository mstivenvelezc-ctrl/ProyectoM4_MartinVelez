    // src/EmailResumenBtn.tsx
    import { useState } from "react";
    import Swal from "sweetalert2";
    import { useAuth } from "./Routes/UseAuth";
    import { enviarResumenEmail } from "./email.service";
    import type { Tarea } from "./Tareas.types";
    import "./styles/EmailResumenBtn.css";

    interface Props {
    tareas: Tarea[];
    }

    export default function EmailResumenBtn({ tareas }: Props) {
    const { user }        = useAuth();
    const [loading, setLoading] = useState(false);

    const swalEstilos = {
        customClass: {
        popup:         "swal-popup",
        title:         "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm",
        cancelButton:  "swal-cancel",
        },
    };

    const handleEnviar = async () => {
        if (!user) return;

        if (tareas.length === 0) {
        Swal.fire({
            title: "Sin tareas",
            text:  "No tienes tareas registradas para enviar.",
            icon:  "info",
            ...swalEstilos,
        });
        return;
        }

        const confirm = await Swal.fire({
        title:             "¿Enviar resumen?",
        text:              `Se enviará un resumen de tus ${tareas.length} tarea(s) a ${user.correo}.`,
        icon:              "question",
        showCancelButton:  true,
        confirmButtonText: "Sí, enviar",
        cancelButtonText:  "Cancelar",
        ...swalEstilos,
        });

        if (!confirm.isConfirmed) return;

        setLoading(true);
        try {
        await enviarResumenEmail(user.correo, user.nombre, tareas);
        Swal.fire({
            title: "¡Email enviado!",
            text:  `Revisa tu bandeja en ${user.correo}.`,
            icon:  "success",
            timer: 3000,
            showConfirmButton: false,
            ...swalEstilos,
        });
        } catch (e) {
        Swal.fire({
            title: "Error al enviar",
            text:  e instanceof Error ? e.message : "Intenta de nuevo.",
            icon:  "error",
            ...swalEstilos,
        });
        } finally {
        setLoading(false);
        }
    };

    return (
        <button
        className="email-resumen-btn"
        onClick={handleEnviar}
        disabled={loading}
        title="Enviar resumen de tareas por email"
        >
        {loading ? (
            <span className="email-resumen-spinner" />
        ) : (
            <span>✉️</span>
        )}
        {loading ?  "Enviando..." : "Enviar resumen"}
        </button>
    );
    }