    import { useAuth } from "./Routes/UseAuth";
    import { useNavigate } from "react-router-dom";
    import './styles/UserCard.css';

    export default function UserCard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const initials = `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase();

    return (
        <div className="user-card">
        <div className="user-card-avatar">
            {user.foto ? (
            <img
                src={user.foto}
                alt={`${user.nombre} ${user.apellido}`}
                className="user-card-photo"
                referrerPolicy="no-referrer"
            />
            ) : (
            <span>{initials}</span>
            )}
        </div>

        <div className="user-card-info">
            <p className="user-card-name">{user.nombre} {user.apellido}</p>
            <p className="user-card-email">{user.correo}</p>
            {user.proveedor === "google" ? (
            <p className="user-card-provider">
                <span className="user-card-label">Google</span>
            </p>
            ) : (
            <p className="user-card-age">
            <span className="user-card-label">Edad</span>
            <span>{user.edad} años</span>
            </p>
            )}
        </div>

        <button
            className="user-card-btn"
            onClick={() => navigate("/taskhome/tareas")}
        >
            Ver mis tareas →
        </button>
        </div>
    );
    }