    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { useAuth } from "./Routes/UseAuth";
    import "./styles/Register.css";

    interface RegisterForm {
    nombre: string;
    apellido: string;
    edad: string;
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

    if (!form.edad) {
        errors.edad = "La edad es obligatoria.";
    } else if (Number(form.edad) < 18) {
        errors.edad = "Debes tener al menos 18 años.";
    } else if (Number(form.edad) > 120) {
        errors.edad = "Edad inválida.";
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
        edad: "",
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
        edad: true,
        correo: true,
        password: true,
        confirmPassword: true,
        };
        setTouched(allTouched);

        if (!isFormValid) return;

        // TODO: llamar a tu API de registro aquí
        login({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        edad: Number(form.edad),
        correo: form.correo.trim(),
        }, form.password);
        localStorage.setItem("userToken", "logged");
        navigate("/taskhome");
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
            <label className="register-label">Edad</label>
            <div className={`register-input-wrap ${inputState("edad")}`}>
                <span className="register-icon">📅</span>
                <input
                type="number"
                name="edad"
                value={form.edad}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="25"
                min={1}
                max={120}
                />
            </div>
            {fieldError("edad") && (
                <p className="register-error">{fieldError("edad")}</p>
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