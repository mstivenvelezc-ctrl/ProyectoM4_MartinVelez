    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import "./Login.css";

    interface LoginForm {
    email: string;
    password: string;
    }

    export default function Login() {
    const navigate = useNavigate();
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

        // Validación de email: debe tener @, dominio después del @ y terminar en .com
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!form.email.includes("@") || !emailRegex.test(form.email)) {
            setError("Ingresa un correo electrónico válido con dominio y .com");
            return;
        }
        if (!form.email.endsWith('.com')) {
            setError("El correo debe terminar en .com");
            return;
        }

        if (form.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setLoading(true);

        // Simula llamada a API
        await new Promise((r) => setTimeout(r, 1500));

        setLoading(false);
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

                {/* Email */}
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

                {/* Password */}
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
                <a href="#">Regístrate gratis</a>
                </p>

            </form>
        </div>
        </div>
    );
    }