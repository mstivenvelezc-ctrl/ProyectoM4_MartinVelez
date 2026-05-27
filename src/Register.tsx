import { useState } from "react";
    import { useNavigate } from "react-router-dom";
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

    type FormErrors = Partial<Record<keyof RegisterForm, string>>;
    type TouchedFields = Partial<Record<keyof RegisterForm, boolean>>;

    // ── Reglas de validación ──────────────────────────────────────────────────────
    function validate(form: RegisterForm): FormErrors {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.nombre.trim()) {
        errors.nombre = "El nombre es obligatorio.";
    } else if (form.nombre.trim().length < 3) {
        errors.nombre = "Mínimo 3 caracteres.";
    }

    if (!form.apellido.trim()) {
        errors.apellido = "El apellido es obligatorio.";
    } else if (form.apellido.trim().length < 3) {
        errors.apellido = "Mínimo 3 caracteres.";
    }

    if (!form.fechaNacimiento) {
    errors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    } else {
    const hoy = new Date();
    const nacimiento = new Date(form.fechaNacimiento);
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    const cumpleEsteAnio = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
    const edadReal = hoy >= cumpleEsteAnio ? edad : edad - 1;

    if (edadReal < 18) {
        errors.fechaNacimiento = "Debes ser mayor de 18 años para registrarte.";
    } else if (edadReal > 120) {
        errors.fechaNacimiento = "Fecha de nacimiento inválida.";
    }
    }

    if (!form.correo.trim()) {
        errors.correo = "El correo es obligatorio.";
    } else if (!emailRegex.test(form.correo)) {
        errors.correo = "Ingresa un correo válido (usuario@dominio.com).";
    }

    if (!form.password) {
        errors.password = "La contraseña es obligatoria.";
    } else if (form.password.length < 8) {
        errors.password = "Mínimo 8 caracteres.";
    }

    if (!form.confirmPassword) {
        errors.confirmPassword = "Confirma tu contraseña.";
    } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden.";
    }

    return errors;
    }

    export default function Register() {
        const { login } = useAuth();
        const navigate = useNavigate();

    const [form, setForm] = useState<RegisterForm>({
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        correo: "",
        password: "",
        confirmPassword: "",
    });

    const [touched, setTouched] = useState<TouchedFields>({});
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const errors = validate(form);
    const isFormValid = Object.keys(errors).length === 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    };

    // Muestra error solo si el campo fue tocado
    const fieldError = (field: keyof RegisterForm) =>
        touched[field] ? errors[field] : undefined;

    // Estado del borde: error = rojo, válido = verde, neutro = default
    const inputState = (field: keyof RegisterForm) => {
        if (!touched[field]) return "";
        return errors[field] ? "input-error" : "input-ok";
    };

    const handleSubmit = () => {
        // Marcar todos como tocados para mostrar todos los errores
        const allTouched: TouchedFields = {
        nombre: true,
        apellido: true,
        fechaNacimiento: true,
        correo: true,
        password: true,
        confirmPassword: true,
        };
        setTouched(allTouched);

        if (!isFormValid) return;

        // TODO: llamar a tu API de registro aquí

        const nacimiento = new Date(form.fechaNacimiento);
        const hoy = new Date();
        const edad = hoy.getFullYear() - nacimiento.getFullYear();
        const cumpleEsteAnio = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
        const edadReal = hoy >= cumpleEsteAnio ? edad : edad - 1;

        login({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        edad: edadReal,
        correo: form.correo.trim(),
        }, form.password);
        localStorage.setItem("userToken", "logged");
        Swal.fire({
        title: "¡Registro exitoso!",
        text: `Bienvenido, ${form.nombre.trim()}. Tu cuenta ha sido creada.`,
        icon: "success",
        confirmButtonText: "Comenzar →",
        customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-text",
            confirmButton: "swal-confirm",
        },
        }).then(() => {
        navigate("/taskhome");
        });
    };

    const passwordsMatch =
        form.confirmPassword.length > 0 && form.password === form.confirmPassword;

    return (
        <div className="register-container">
        <div className="register-card">
            {/* Logo */}
            <div className="register-logo">
            <img src="/logo.png" alt="MyTask Logo" className="card-logo" />
            </div>

            <h1 className="register-title">
            Crear <span>cuenta</span>
            </h1>
            <p className="register-subtitle">Regístrate para comenzar a usar la plataforma.</p>

            {/* Nombre y Apellido */}
            <div className="register-row">
            <div className="register-field">
                <label className="register-label">Nombre</label>
                <div className={`register-input-wrap ${inputState("nombre")}`}>
                <span className="register-icon">👤</span>
                <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ana"
                    autoComplete="off"
                />
                </div>
                {fieldError("nombre") && (
                <p className="register-error">{fieldError("nombre")}</p>
                )}
            </div>

            <div className="register-field">
                <label className="register-label">Apellido</label>
                <div className={`register-input-wrap ${inputState("apellido")}`}>
                <span className="register-icon">👤</span>
                <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="García"
                    autoComplete="off"
                />
                </div>
                {fieldError("apellido") && (
                <p className="register-error">{fieldError("apellido")}</p>
                )}
            </div>
            </div>

            {/* Edad */}
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
                    .toISOString().split("T")[0]} // bloquea fecha menores de 18 años
                />
            </div>
            {fieldError("fechaNacimiento") && (
                <p className="register-error">{fieldError("fechaNacimiento")}</p>
            )}
            </div>

            {/* Correo */}
            <div className="register-field">
            <label className="register-label">Correo Electrónico</label>
            <div className={`register-input-wrap ${inputState("correo")}`}>
                <span className="register-icon">✉️</span>
                <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="tucorreo@email.com"
                autoComplete="off"
                />
            </div>
            {fieldError("correo") && (
                <p className="register-error">{fieldError("correo")}</p>
            )}
            </div>

            {/* Contraseña */}
            <div className="register-field">
            <label className="register-label">Contraseña</label>
            <div className={`register-input-wrap ${inputState("password")}`}>
                <span className="register-icon">🔒</span>
                <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                autoComplete="new-password"
                />
                <button
                className="register-eye"
                onClick={() => setShowPass(!showPass)}
                type="button"
                aria-label="Mostrar contraseña"
                >
                {showPass ? "🙈" : "👁️"}
                </button>
            </div>
            {fieldError("password") ? (
                <p className="register-error">{fieldError("password")}</p>
            ) : (
                <p className="register-hint">Mínimo 8 caracteres</p>
            )}
            </div>

            {/* Confirmar contraseña */}
            <div className="register-field">
            <label className="register-label">Confirmar Contraseña</label>
            <div className={`register-input-wrap ${inputState("confirmPassword")}`}>
                <span className="register-icon">🔒</span>
                <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                autoComplete="new-password"
                />
                <button
                className="register-eye"
                onClick={() => setShowConfirm(!showConfirm)}
                type="button"
                aria-label="Mostrar contraseña"
                >
                {showConfirm ? "🙈" : "👁️"}
                </button>
            </div>
            {fieldError("confirmPassword") ? (
                <p className="register-error">{fieldError("confirmPassword")}</p>
            ) : passwordsMatch ? (
                <p className="register-match ok">✓ Las contraseñas coinciden</p>
            ) : null}
            </div>

            {/* Botón */}
            <button className="register-btn" onClick={handleSubmit}>
            Registrarse →
            </button>

            <div className="register-divider">o</div>

            <p className="register-login">
            ¿Ya tienes cuenta?{" "}
            <a href="/login">Inicia sesión</a>
            </p>
        </div>
        </div>
    );
    }