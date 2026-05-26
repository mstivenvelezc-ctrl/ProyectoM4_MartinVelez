    import { useState } from "react";
    import "./Register.css";

    interface RegisterForm {
    nombre: string;
    apellido: string;
    edad: string;
    correo: string;
    password: string;
    confirmPassword: string;
    }

    export default function Register() {
    const [form, setForm] = useState<RegisterForm>({
        nombre: "",
        apellido: "",
        edad: "",
        correo: "",
        password: "",
        confirmPassword: "",
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const passwordsMatch =
        form.confirmPassword.length > 0 && form.password === form.confirmPassword;
    const passwordsMismatch =
        form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

    const handleSubmit = () => {
        const { nombre, apellido, edad, correo, password, confirmPassword } = form;

        if (!nombre || !apellido || !edad || !correo || !password || !confirmPassword) {
        alert("Por favor completa todos los campos.");
        return;
        }
        if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
        }
        if (password.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
        }

        // TODO: llamar a tu API de registro aquí
        console.log("Registro:", { nombre, apellido, edad: Number(edad), correo });
    };

    return (
        <div className="register-container">
        <div className="register-card">
            {/* Logo */}
            <div className="register-logo">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="10" width="56" height="44" rx="6" fill="#2a1a4e" stroke="#7c4dff" strokeWidth="1.5" />
                <path d="M32 10 C32 10 32 54 32 54" stroke="#7c4dff" strokeWidth="1.5" />
                <line x1="14" y1="22" x2="28" y2="22" stroke="#c850c0" strokeWidth="2" strokeLinecap="round" />
                <line x1="14" y1="29" x2="28" y2="29" stroke="#c850c0" strokeWidth="2" strokeLinecap="round" />
                <line x1="14" y1="36" x2="24" y2="36" stroke="#c850c0" strokeWidth="2" strokeLinecap="round" />
                <line x1="36" y1="22" x2="50" y2="22" stroke="#b06bef" strokeWidth="2" strokeLinecap="round" />
                <line x1="36" y1="29" x2="50" y2="29" stroke="#b06bef" strokeWidth="2" strokeLinecap="round" />
                <line x1="36" y1="36" x2="46" y2="36" stroke="#b06bef" strokeWidth="2" strokeLinecap="round" />
                <circle cx="50" cy="46" r="8" fill="#1a1a2e" stroke="#7c4dff" strokeWidth="1.5" />
                <line x1="50" y1="42" x2="50" y2="50" stroke="#c850c0" strokeWidth="2" strokeLinecap="round" />
                <line x1="46" y1="46" x2="54" y2="46" stroke="#c850c0" strokeWidth="2" strokeLinecap="round" />
            </svg>
            </div>

            <h1 className="register-title">
            Crear <span>cuenta</span>
            </h1>
            <p className="register-subtitle">Regístrate para comenzar a usar la plataforma.</p>

            {/* Nombre y Apellido */}
            <div className="register-row">
            <div className="register-field">
                <label className="register-label">Nombre</label>
                <div className="register-input-wrap">
                <span className="register-icon">👤</span>
                <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ana"
                    autoComplete="off"
                />
                </div>
            </div>
            <div className="register-field">
                <label className="register-label">Apellido</label>
                <div className="register-input-wrap">
                <span className="register-icon">👤</span>
                <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    placeholder="García"
                    autoComplete="off"
                />
                </div>
            </div>
            </div>

            {/* Edad */}
            <div className="register-field">
            <label className="register-label">Edad</label>
            <div className="register-input-wrap">
                <span className="register-icon">📅</span>
                <input
                type="number"
                name="edad"
                value={form.edad}
                onChange={handleChange}
                placeholder="25"
                min={1}
                max={120}
                />
            </div>
            </div>

            {/* Correo */}
            <div className="register-field">
            <label className="register-label">Correo Electrónico</label>
            <div className="register-input-wrap">
                <span className="register-icon">✉️</span>
                <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="tucorreo@email.com"
                autoComplete="off"
                />
            </div>
            </div>

            {/* Contraseña */}
            <div className="register-field">
            <label className="register-label">Contraseña</label>
            <div className="register-input-wrap">
                <span className="register-icon">🔒</span>
                <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
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
            <p className="register-hint">Mínimo 8 caracteres</p>
            </div>

            {/* Confirmar contraseña */}
            <div className="register-field">
            <label className="register-label">Confirmar Contraseña</label>
            <div className="register-input-wrap">
                <span className="register-icon">🔒</span>
                <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
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
            {passwordsMatch && (
                <p className="register-match ok">✓ Las contraseñas coinciden</p>
            )}
            {passwordsMismatch && (
                <p className="register-match no">✗ Las contraseñas no coinciden</p>
            )}
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