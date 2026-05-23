import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Login from "./Login.tsx";

function HomePage() {
  const features = [
    {
      icon: "⚡",
      title: "Rendimiento Optimizado",
      desc: "Construida con React y TypeScript para garantizar una experiencia rápida y fluida en todo momento.",
    },
    {
      icon: "🎨",
      title: "Diseño Moderno",
      desc: "Interfaz cuidadosamente diseñada con atención al detalle, tipografía y composición visual.",
    },
    {
      icon: "🔒",
      title: "Tipado Estático",
      desc: "TypeScript asegura que el código sea robusto, mantenible y libre de errores en tiempo de compilación.",
    },
    {
      icon: "📱",
      title: "Responsive",
      desc: "Adaptada para funcionar perfectamente en dispositivos móviles, tablets y escritorios.",
    },
    {
      icon: "🧩",
      title: "Componentes Reutilizables",
      desc: "Arquitectura basada en componentes que facilita la escalabilidad del proyecto.",
    },
    {
      icon: "🚀",
      title: "SPA Moderna",
      desc: "Single Page Application que ofrece navegación instantánea sin recargas de página.",
    },
  ];

  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => (c < 100 ? c + 1 : c));
    }, 18);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <h1>
            Bienvenido a{" "}
            <span className="highlight">Gestion de Tareas</span>
          </h1>
          <p className="hero-sub">
            Una aplicación web moderna construida con React y TypeScript.
            Rápida, accesible y lista para crecer.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("/login")}>Login</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stat">
          <div className="stat-number">{count}%</div>
          <div className="stat-label">TypeScript</div>
        </div>
        <div className="stat">
          <div className="stat-number">SPA</div>
          <div className="stat-label">Arquitectura</div>
        </div>
        <div className="stat">
          <div className="stat-number">React</div>
          <div className="stat-label">Libreria</div>
        </div>
        <div className="stat">
          <div className="stat-number">2026</div>
          <div className="stat-label">Proyecto</div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="features">
        <p className="section-label">Características</p>
        <h2 className="section-title">¿Qué incluye esta app?</h2>
        <div className="cards">
          {features.map((f, i) => (
            <div className="card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <span className="card-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ padding: "0 2rem" }}>
        <div className="cta-section">
          <h2>¿Listo para empezar?</h2>
          <button className="btn-primary" onClick={() => navigate("/login")}>Login →</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        Hecho con <span>♥</span> · Proyecto estudiantil · React + TypeScript
      </footer>
    </>
  );
}

function App() {
  // titulo pestaña
  useEffect(() => {
    document.title = "MyTask";
  }, []);

  return (
    <>
      <div className="app">
        {/* NAV */}
        <nav>
          <div className="nav-logo">My<span>Task</span></div>
          <ul className="nav-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><a href="#" className="nav-cta">Contacto</a></li>
          </ul>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}


export default App;
