    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { useAuth } from "./Routes/UseAuth";
    import "./styles/Login.css";

    interface LoginForm {
    email: string;
    password: string;
    }

    export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth(); // 👈 aquí, al inicio del componente
    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form.email || !form.password) {
        setError("Por favor completa todos los campos.");
        return;
        }

        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailRegex.test(form.email)) {
        setError("Ingresa un correo electrónico válido.");
        return;
        }

        if (form.password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.");
        return;
        }

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500));

        const usuarios = JSON.parse(localStorage.getItem("usuarios_registrados") || "[]");
        const usuario = usuarios.find(
        (u: { correo: string; password: string }) =>
            u.correo === form.email && u.password === form.password
        );

        setLoading(false);

        if (!usuario) {
        setError("Correo o contraseña incorrectos.");
        return;
        }

        login({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        edad: usuario.edad,
        correo: usuario.correo,
        });

        localStorage.setItem("userToken", "logged");
        navigate("/taskhome");
    };

    return (
        <div className="login-page">
        <div className="login-glow" />

        <div className="card">
            <div className="card-header">
            <img src="/logo.png" alt="MyTask Logo" className="card-logo" />
            <h1 className="card-title">
                Bienvenido <span className="highlight">de vuelta</span>
            </h1>
            <p className="card-subtitle">
                Inicia sesión para continuar en tu cuenta.
            </p>
            </div>

            <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="field">
                <label htmlFor="email">Correo electrónico</label>
                <div className="input-wrap">
                <span className="input-icon">✉</span>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tucorreo@email.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                />
                </div>
            </div>

            <div className="field">
                <label htmlFor="password">Contraseña</label>
                <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                />
                </div>
                <div className="field-extras">
                <label className="show-pass-label">
                    <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    />
                    Mostrar contraseña
                </label>
                <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>
                </div>
            </div>

            {error && <p className="error-msg">⚠ {error}</p>}

            <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? (
                <>
                    <span className="spinner" />
                    Verificando...
                </>
                ) : (
                "Iniciar sesión →"
                )}
            </button>

            <div className="divider">
                <div className="divider-line" />
                <span>o</span>
                <div className="divider-line" />
            </div>

            <p className="register-link">
                ¿No tienes cuenta?{" "}
                <a href="#" onClick={e => { e.preventDefault(); navigate('/register'); }}>Regístrate gratis</a>
            </p>
            </form>
        </div>
        </div>
    );
    }