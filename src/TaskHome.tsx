
import { useEffect } from "react";
import { useTareas } from "./useTareas";
import TaskCalendar from "./TaskCalendar";
import './TaskHome.css';


function TaskHome() {
  const { tareas } = useTareas();
  useEffect(() => {
    document.title = "MyTask - Dashboard";
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <img src="/logo.png" alt="MyTask Logo" className="card-logo" />
          <h1>My<span>Task</span></h1>
          <h2>
            Panel de <span className="highlight">Control</span>
          </h2>
          <p className="hero-sub">
            Gestiona tus tareas de forma rápida y eficiente
          </p>
          <div className="hero-actions" />
        </div>
      </section>

      <section className="calendar-section">
        <h2 className="calendar-title-main">Calendario de Tareas</h2>
        <TaskCalendar tareas={tareas} />
      </section>

      {/* FOOTER */}
      <footer>
        Hecho con <span>♥</span> · Proyecto estudiantil · React + TypeScript
      </footer>
    </>
  );
}

export default TaskHome;
