    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
    import { auth, googleProvider } from "./firebase";
    import { useAuth } from "./Routes/UseAuth";
    import "./styles/Register.css";
    import Swal from 'sweetalert2';

    interface RegisterForm {
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    correo: string;
    password: string;
    confirmPassword: string;
    }

    type FormErrors    = Partial<Record<keyof RegisterForm, string>>;
    type TouchedFields = Partial<Record<keyof RegisterForm, boolean>>;

    // ── Utilidad: calcular edad desde fecha de nacimiento ─────────────────────────
    function calcularEdad(fechaNacimiento: string): number {
    const hoy       = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const edad      = hoy.getFullYear() - nacimiento.getFullYear();
    const cumpleEsteAnio = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
    return hoy >= cumpleEsteAnio ? edad : edad - 1;
    }

    // ── Reglas de validación ──────────────────────────────────────────────────────
    function validate(form: RegisterForm): FormErrors {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.nombre.trim())               errors.nombre = "El nombre es obligatorio.";
    else if (form.nombre.trim().length < 3) errors.nombre = "Mínimo 3 caracteres.";

    if (!form.apellido.trim())                errors.apellido = "El apellido es obligatorio.";
    else if (form.apellido.trim().length < 3)  errors.apellido = "Mínimo 3 caracteres.";

    if (!form.fechaNacimiento) {
        errors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    } else {
        const edadCalculada = calcularEdad(form.fechaNacimiento);
        if (edadCalculada < 18)   errors.fechaNacimiento = "Debes ser mayor de 18 años para registrarte.";
        else if (edadCalculada > 120) errors.fechaNacimiento = "Fecha de nacimiento inválida.";
    }

    if (!form.correo.trim())                errors.correo = "El correo es obligatorio.";
    else if (!emailRegex.test(form.correo)) errors.correo = "Ingresa un correo válido (usuario@dominio.com).";

    if (!form.password)                errors.password = "La contraseña es obligatoria.";
    else if (form.password.length < 8) errors.password = "Mínimo 8 caracteres.";

    if (!form.confirmPassword)                       errors.confirmPassword = "Confirma tu contraseña.";
    else if (form.password !== form.confirmPassword)  errors.confirmPassword = "Las contraseñas no coinciden.";

    return errors;
    }

    function getFirebaseError(e: unknown): string {
    const code = (e as { code?: string })?.code ?? "";
    const map: Record<string, string> = {
        "auth/email-already-in-use":   "Ya existe una cuenta con ese correo.",
        "auth/invalid-email":          "El correo no es válido.",
        "auth/weak-password":          "La contraseña debe tener al menos 6 caracteres.",
        "auth/network-request-failed": "Error de red. Verifica tu conexión.",
        "auth/popup-closed-by-user":   "Cerraste el popup de Google.",
    };
    return map[code] ?? "Ocurrió un error. Intenta de nuevo.";
    }

    export default function Register() {
    const { login }  = useAuth();
    const navigate   = useNavigate();

    const [form, setForm] = useState<RegisterForm>({
        nombre: "", apellido: "", fechaNacimiento: "",
        correo: "", password: "", confirmPassword: "",
    });
    const [touched, setTouched]         = useState<TouchedFields>({});
    const [showPass, setShowPass]       = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [firebaseError, setFirebaseError] = useState("");
    const [loading, setLoading]         = useState(false);

    const errors      = validate(form);
    const isFormValid = Object.keys(errors).length === 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    };
    const fieldError = (field: keyof RegisterForm) =>
        touched[field] ? errors[field] : undefined;
    const inputState = (field: keyof RegisterForm) => {
        if (!touched[field]) return "";
        return errors[field] ? "input-error" : "input-ok";
    };

    // ── Registro con email ────────────────────────────────────────────────────
    const handleSubmit = async () => {
        const allTouched: TouchedFields = {
        nombre: true, apellido: true, fechaNacimiento: true,
        correo: true, password: true, confirmPassword: true,
        };
        setTouched(allTouched);
        if (!isFormValid) return;

        setLoading(true);
        setFirebaseError("");
        try {
        const result = await createUserWithEmailAndPassword(auth, form.correo, form.password);

        await updateProfile(result.user, {
            displayName: `${form.nombre.trim()} ${form.apellido.trim()}`,
        });

        const edadCalculada = calcularEdad(form.fechaNacimiento);

        login({
            nombre:    form.nombre.trim(),
            apellido:  form.apellido.trim(),
            edad:      edadCalculada,
            correo:    form.correo.trim(),
            proveedor: "email",
        });

        localStorage.setItem("userToken", "logged");

// Primero muestra "Creando cuenta..."
    Swal.fire({
    title: "Creando tu cuenta...",
    html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:1rem; padding:0.5rem 0">
        <div class="swal-spinner"></div>
        <p style="color:#7070a0; font-size:0.9rem; margin:0">Configurando tu espacio de trabajo</p>
        </div>
    `,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    timer: 2000,
    customClass: {
        popup: "swal-popup",
        title: "swal-title",
    },
    });

// Espera 2 segundos y muestra éxito
await new Promise((r) => setTimeout(r, 2000));

    await Swal.fire({
    title: "¡Bienvenido!",
    html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem">
        <p style="color:#7070a0; font-size:0.95rem; margin:0">
            Tu cuenta ha sido creada, <strong style="color:#f0f0f8">${form.nombre.trim()}</strong>
        </p>
        </div>
    `,
    icon: "success",
    confirmButtonText: "Comenzar →",
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm",
    },
    });

        navigate("/taskhome");
        } catch (e) {
        setFirebaseError(getFirebaseError(e));
        } finally {
        setLoading(false);
        }
    };

    // ── Registro / Login con Google ───────────────────────────────────────────
    const handleGoogle = async () => {
        setLoading(true);
        setFirebaseError("");
        try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;

        login({
            nombre:    fbUser.displayName?.split(" ")[0] ?? "Usuario",
            apellido:  fbUser.displayName?.split(" ").slice(1).join(" ") ?? "",
            edad:      0,
            correo:    fbUser.email ?? "",
            foto:      fbUser.photoURL ?? undefined,
            proveedor: "google",
        });

        Swal.fire({
    title: "Creando tu cuenta...",
    html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:1rem; padding:0.5rem 0">
        <div class="swal-spinner"></div>
        <p style="color:#7070a0; font-size:0.9rem; margin:0">Configurando tu espacio de trabajo</p>
        </div>
    `,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    timer: 2000,
    customClass: {
        popup: "swal-popup",
        title: "swal-title",
    },
    });

    await new Promise((r) => setTimeout(r, 2000));

    await Swal.fire({
    title: "¡Bienvenido!",
    html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem">
        <p style="color:#7070a0; font-size:0.95rem; margin:0">
            Tu cuenta ha sido creada, <strong style="color:#f0f0f8">${form.nombre.trim()}</strong>
        </p>
        </div>
    `,
    icon: "success",
    confirmButtonText: "Comenzar →",
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm",
    },
    });


        navigate("/taskhome");
        } catch (e) {
        setFirebaseError(getFirebaseError(e));
        } finally {
        setLoading(false);
        }
    };

    const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;

    return (
        <div className="register-container">
        <div className="register-card">

            <div className="register-logo">
            <img src="/logo.png" alt="MyTask Logo" className="card-logo" />
            </div>

            <h1 className="register-title">Crear <span>cuenta</span></h1>
            <p className="register-subtitle">Regístrate para comenzar a usar la plataforma.</p>

            {/* Nombre y Apellido */}
            <div className="register-row">
            <div className="register-field">
                <label className="register-label">Nombre</label>
                <div className={`register-input-wrap ${inputState("nombre")}`}>
                <span className="register-icon">👤</span>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} onBlur={handleBlur} placeholder="Ana" autoComplete="off"/>
                </div>
                {fieldError("nombre") && <p className="register-error">{fieldError("nombre")}</p>}
            </div>

            <div className="register-field">
                <label className="register-label">Apellido</label>
                <div className={`register-input-wrap ${inputState("apellido")}`}>
                <span className="register-icon">👤</span>
                <input type="text" name="apellido" value={form.apellido} onChange={handleChange} onBlur={handleBlur} placeholder="García" autoComplete="off"/>
                </div>
                {fieldError("apellido") && <p className="register-error">{fieldError("apellido")}</p>}
            </div>
            </div>

            {/* Fecha de nacimiento */}
            <div className="register-field">
            <label className="register-label">Fecha de nacimiento</label>
            <div className={`register-input-wrap ${inputState("fechaNacimiento")}`}>
                <span className="register-icon">📅</span>
                <input
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
                onBlur={handleBlur}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                    .toISOString().split("T")[0]}
                />
            </div>
            {fieldError("fechaNacimiento") && <p className="register-error">{fieldError("fechaNacimiento")}</p>}
            </div>

            {/* Correo */}
            <div className="register-field">
            <label className="register-label">Correo Electrónico</label>
            <div className={`register-input-wrap ${inputState("correo")}`}>
                <span className="register-icon">✉️</span>
                <input type="email" name="correo" value={form.correo} onChange={handleChange} onBlur={handleBlur} placeholder="tucorreo@email.com" autoComplete="off"/>
            </div>
            {fieldError("correo") && <p className="register-error">{fieldError("correo")}</p>}
            </div>

            {/* Contraseña */}
            <div className="register-field">
            <label className="register-label">Contraseña</label>
            <div className={`register-input-wrap ${inputState("password")}`}>
                <span className="register-icon">🔒</span>
                <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} onBlur={handleBlur} placeholder="••••••••" autoComplete="new-password"/>
                <button className="register-eye" onClick={() => setShowPass(!showPass)} type="button" aria-label="Mostrar contraseña">
                {showPass ? "🙈" : "👁️"}
                </button>
            </div>
            {fieldError("password") ? <p className="register-error">{fieldError("password")}</p> : <p className="register-hint">Mínimo 8 caracteres</p>}
            </div>

            {/* Confirmar contraseña */}
            <div className="register-field">
            <label className="register-label">Confirmar Contraseña</label>
            <div className={`register-input-wrap ${inputState("confirmPassword")}`}>
                <span className="register-icon">🔒</span>
                <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur} placeholder="••••••••" autoComplete="new-password"/>
                <button className="register-eye" onClick={() => setShowConfirm(!showConfirm)} type="button" aria-label="Mostrar contraseña">
                {showConfirm ? "🙈" : "👁️"}
                </button>
            </div>
            {fieldError("confirmPassword") ? (
                <p className="register-error">{fieldError("confirmPassword")}</p>
            ) : passwordsMatch ? (
                <p className="register-match ok">✓ Las contraseñas coinciden</p>
            ) : null}
            </div>

            {firebaseError && <p className="register-firebase-error">⚠ {firebaseError}</p>}

            <button className="register-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Registrando..." : "Registrarse →"}
            </button>

            <div className="register-divider">o</div>

            <button className="login-btn-google" onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.36 3.1 29.45 1 24 1 14.82 1 7.07 6.48 3.64 14.18l7.17 5.57C12.6 13.36 17.85 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.96-2.2 5.47-4.67 7.15l7.17 5.57C43.36 37.7 46.5 31.5 46.5 24.5z"/>
                <path fill="#FBBC05" d="M10.81 28.25A14.6 14.6 0 0 1 9.5 24c0-1.48.26-2.9.71-4.25L3.04 14.18A23.94 23.94 0 0 0 .5 24c0 3.87.93 7.53 2.54 10.77l7.77-6.52z"/>
                <path fill="#34A853" d="M24 47c5.45 0 10.03-1.8 13.37-4.88l-7.17-5.57C28.4 38.3 26.3 39 24 39c-6.15 0-11.4-3.86-13.19-9.25l-7.77 6.52C6.07 42.52 14.55 47 24 47z"/>
            </svg>
            Continuar con Google
            </button>

            <div className="register-divider-line" />

            <p className="register-login">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
            </p>
        </div>
        </div>
    );
    }