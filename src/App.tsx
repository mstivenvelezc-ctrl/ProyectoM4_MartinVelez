import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './styles/App.css';

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "MyTask";
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <img src="/logo.png" alt="MyTask Logo" className="card-logo" />
          <h1>My<span>Task</span></h1>
          <h2>
            Bienvenido a{" "}
            <span className="highlight">Gestion de Tareas</span>
          </h2>
          <p className="hero-sub">
            Una aplicación web moderna construida con React y TypeScript.
            Rápida, accesible y lista para crecer.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("/login")}>Login</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        Hecho con <span>♥</span> · Proyecto estudiantil · React + TypeScript
      </footer>
    </>
  );
}

export default App;
