    // src/NotFound.tsx
    import { useNavigate } from "react-router-dom";
    import "./styles/NotFound.css";

    export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
        <div className="notfound-glitch-wrap">
            <span className="notfound-code" aria-hidden="true">404</span>
            <span className="notfound-code glitch" data-text="404">404</span>
            <span className="notfound-code glitch2" aria-hidden="true">404</span>
        </div>

        <h1 className="notfound-title">Página no encontrada</h1>
        <p className="notfound-sub">
            La ruta que buscas no existe o fue movida.
        </p>

        <div className="notfound-actions">
            <button className="notfound-btn-primary" onClick={() => navigate("/")}>
            Ir al inicio
            </button>
            <button className="notfound-btn-secondary" onClick={() => navigate(-1)}>
            ← Volver
            </button>
        </div>
        </div>
    );
    }