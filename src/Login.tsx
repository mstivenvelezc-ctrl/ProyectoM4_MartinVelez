import { useState, useEffect } from "react";
    import { useNavigate, Link } from "react-router-dom";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { auth } from "./firebase";
    import { signInWithGoogle, getGoogleRedirectResult } from "./googleAuth";
    import { useAuth } from "./Routes/UseAuth";
    import "./styles/Login.css";
    import Swal from 'sweetalert2';

    export default function Login() {
    const { login }  = useAuth();
    const navigate   = useNavigate();

    const [correo, setCorreo]     = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError]       = useState("");
    const [loading, setLoading]   = useState(false);

    // ── Captura resultado del redirect de Google al volver ────────────────────
    useEffect(() => {
        getGoogleRedirectResult()
        .then((fbUser) => {
            if (!fbUser) return;
            login({
            nombre:    fbUser.displayName?.split(" ")[0] ?? "Usuario",
            apellido:  fbUser.displayName?.split(" ").slice(1).join(" ") ?? "",
            edad:      0,
            correo:    fbUser.email ?? "",
            foto:      fbUser.photoURL ?? undefined,
            proveedor: "google",
            });
            navigate("/taskhome");
        })
        .catch((e: unknown) => setError(getFirebaseError(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Email / Contraseña ────────────────────────────────────────────────────
    const handleEmailLogin = async () => {
        if (!correo || !password) {
        setError("Completa todos los campos.");
        return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
        setError("Ingresa un correo electrónico válido.");
        return;
        }

        if (password.length < 8) {
        setError("La contraseña debe tener mínimo 8 caracteres.");
        return;
        }

        setLoading(true);
        setError("");
        try {
        const result = await signInWithEmailAndPassword(auth, correo, password);
        const fbUser = result.user;

        login({
            nombre:    fbUser.displayName?.split(" ")[0] ?? "Usuario",
            apellido:  fbUser.displayName?.split(" ").slice(1).join(" ") ?? "",
            edad:      0,
            correo:    fbUser.email ?? correo,
            foto:      fbUser.photoURL ?? undefined,
            proveedor: "email",
        });
        navigate("/taskhome");
        } catch (e: unknown) {
        setError(getFirebaseError(e));
        } finally {
        setLoading(false);
        }
    };

    // ── Google ────────────────────────────────────────────────────────────────
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        try {
        const fbUser = await signInWithGoogle();

        // En producción fbUser es null (redirect) — el useEffect lo maneja al volver
        if (!fbUser) return;

        login({
            nombre:    fbUser.displayName?.split(" ")[0] ?? "Usuario",
            apellido:  fbUser.displayName?.split(" ").slice(1).join(" ") ?? "",
            edad:      0,
            correo:    fbUser.email ?? "",
            foto:      fbUser.photoURL ?? undefined,
            proveedor: "google",
        });

        Swal.fire({
            title: "Accediendo...",
            html: `
            <div style="display:flex; flex-direction:column; align-items:center; gap:1rem; padding:0.5rem 0">
                <div class="swal-spinner"></div>
                <p style="color:#7070a0; font-size:0.9rem; margin:0">Verificando tus credenciales</p>
            </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey:    false,
            timer: 1500,
            customClass: {
            popup: "swal-popup",
            title: "swal-title",
            },
        });

        await new Promise((r) => setTimeout(r, 1500));

        navigate("/taskhome");
        } catch (e: unknown) {
        setError(getFirebaseError(e));
        } finally {
        setLoading(false);
        }
    };

    const isLoginValid = correo.trim() !== "" && password.length >= 8;

    return (
        <div className="login-container">
        <div className="login-card">

            <div className="login-logo">
            <img src="/logo.png" alt="MyTask Logo" className="card-logo" />
            </div>

            <h1 className="login-title">Bienvenido <span>de vuelta</span></h1>
            <p className="login-subtitle">Inicia sesión para continuar en tu cuenta.</p>

            <div className="login-field">
            <label className="login-label">Correo Electrónico</label>
            <div className="login-input-wrap">
                <span className="login-icon">✉️</span>
                <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tucorreo@email.com"
                autoComplete="email"
                />
            </div>
            </div>

            <div className="login-field">
            <label className="login-label">Contraseña</label>
            <div className="login-input-wrap">
                <span className="login-icon">🔒</span>
                <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                />
                <button className="login-eye" onClick={() => setShowPass(!showPass)} type="button">
                {showPass ? "🙈" : "👁️"}
                </button>
            </div>
            </div>

            <div className="login-options">
            <label className="login-check">
                <input type="checkbox" onChange={(e) => setShowPass(e.target.checked)} />
                Mostrar contraseña
            </label>
            </div>

            {error && <p className="login-error">⚠ {error}</p>}

            <button className="login-btn" onClick={handleEmailLogin} disabled={loading || !isLoginValid}>
            {loading ? "Iniciando..." : "Iniciar sesión →"}
            </button>

            <div className="login-divider"><span>o</span></div>

            <button className="login-btn-google" onClick={handleGoogleLogin} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.36 3.1 29.45 1 24 1 14.82 1 7.07 6.48 3.64 14.18l7.17 5.57C12.6 13.36 17.85 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.96-2.2 5.47-4.67 7.15l7.17 5.57C43.36 37.7 46.5 31.5 46.5 24.5z"/>
                <path fill="#FBBC05" d="M10.81 28.25A14.6 14.6 0 0 1 9.5 24c0-1.48.26-2.9.71-4.25L3.04 14.18A23.94 23.94 0 0 0 .5 24c0 3.87.93 7.53 2.54 10.77l7.77-6.52z"/>
                <path fill="#34A853" d="M24 47c5.45 0 10.03-1.8 13.37-4.88l-7.17-5.57C28.4 38.3 26.3 39 24 39c-6.15 0-11.4-3.86-13.19-9.25l-7.77 6.52C6.07 42.52 14.55 47 24 47z"/>
            </svg>
            Continuar con Google
            </button>

            <div className="login-divider-line" />
            <p className="login-register">
            ¿No tienes cuenta? <Link to="/register">Regístrate aqui</Link>
            </p>
        </div>
        </div>
    );
    }

    function getFirebaseError(e: unknown): string {
    const code = (e as { code?: string })?.code ?? "";
    const map: Record<string, string> = {
        "auth/user-not-found":         "No existe una cuenta con ese correo.",
        "auth/wrong-password":         "Contraseña incorrecta.",
        "auth/invalid-email":          "El correo no es válido.",
        "auth/too-many-requests":      "Demasiados intentos. Intenta más tarde.",
        "auth/popup-closed-by-user":   "Cerraste el popup de Google.",
        "auth/network-request-failed": "Error de red. Verifica tu conexión.",
        "auth/invalid-credential":     "Correo o contraseña incorrectos.",
    };
    return map[code] ?? "Ocurrió un error. Intenta de nuevo.";
    }