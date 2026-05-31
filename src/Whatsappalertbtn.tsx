    // src/WhatsAppAlertBtn.tsx
    import { useState } from "react";
    import Swal from "sweetalert2";
    import { useAuth } from "./Routes/UseAuth";
    import { enviarAlertaWhatsApp } from "./WhatsApp.service";
    import type { Tarea } from "./Tareas.types";
    import "./styles/WhatsAppAlertBtn.css";

    interface Props {
    tareas: Tarea[];
    }

    export default function WhatsAppAlertBtn({ tareas }: Props) {
    const { user, actualizarTelefono } = useAuth();
    const [loading, setLoading]        = useState(false);

    const swalEstilos = {
        customClass: {
        popup:         "swal-popup",
        title:         "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm",
        cancelButton:  "swal-cancel",
        },
    };

    const pedirTelefono = async (): Promise<string | null> => {
        const { value } = await Swal.fire({
        title:             "¿A qué número enviamos?",
        html: `
            <p style="color:#888;font-size:.85rem;margin-bottom:.8rem">
            Incluye el código de país sin el +<br/>
            Ejemplo Colombia: <b>573001234567</b>
            </p>
            <input
            id="swal-telefono"
            class="swal2-input"
            placeholder="573001234567"
            type="tel"
            style="font-size:1rem"
            />
        `,
        confirmButtonText: "Enviar",
        cancelButtonText:  "Cancelar",
        showCancelButton:  true,
        ...swalEstilos,
        preConfirm: () => {
            const val = (document.getElementById("swal-telefono") as HTMLInputElement)?.value?.trim();
            if (!val || val.length < 10) {
            Swal.showValidationMessage("Ingresa un número válido con código de país");
            return false;
            }
            return val;
        },
        });
        return value ?? null;
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

        // Usar teléfono guardado o pedir uno nuevo
        let telefono = user.telefono ?? "";

        if (!telefono) {
        const ingresado = await pedirTelefono();
        if (!ingresado) return;
        telefono = ingresado;
        actualizarTelefono(telefono);
        } else {
        // Confirmar con el número guardado
        const confirm = await Swal.fire({
            title:             "¿Enviar alerta?",
            text:              `Se enviará un resumen a WhatsApp +${telefono}`,
            icon:              "question",
            showCancelButton:  true,
            confirmButtonText: "Sí, enviar",
            cancelButtonText:  "Cancelar",
            footer:            `<a id="cambiar-num" style="color:#9b6dff;cursor:pointer">Usar otro número</a>`,
            ...swalEstilos,
            didOpen: () => {
            document.getElementById("cambiar-num")?.addEventListener("click", () => {
                Swal.clickCancel();
            });
            },
        });

        if (!confirm.isConfirmed) {
            // Si canceló para cambiar número
            const nuevo = await pedirTelefono();
            if (!nuevo) return;
            telefono = nuevo;
            actualizarTelefono(telefono);
        }
        }

        setLoading(true);
        try {
        await enviarAlertaWhatsApp(telefono, user.nombre, tareas);
        Swal.fire({
            title: "¡Mensaje enviado!",
            text:  "Revisa tu WhatsApp.",
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
        className="whatsapp-alert-btn"
        onClick={handleEnviar}
        disabled={loading}
        title="Enviar alerta de tareas por WhatsApp"
        >
        {loading ? (
            <span className="whatsapp-spinner" />
        ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
        )}
        {loading ? "Enviando..." : "Alerta WhatsApp"}
        </button>
    );
    }