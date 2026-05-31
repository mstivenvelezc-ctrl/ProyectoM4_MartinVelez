
import { useEffect } from "react";
import { useTareas } from "./useTareas";
import { useAuth } from "./Routes/UseAuth";
import TaskCalendar from "./TaskCalendar";
import UserCard from "./UserCard";
import EmailResumenBtn from "./EmailResumenBtn";
import WhatsAppAlertBtn from "./Whatsappalertbtn";
import './styles/TaskHome.css';


function TaskHome() {
  const { user } = useAuth();
  const { tareas } = useTareas(user?.correo ?? "");

  useEffect(() => {
    document.title =  user ? `MyTask - ${user.nombre}` : "MyTask - Dashboard";
  }, [user]);

  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <h1>My<span>Task</span></h1>
          <h2>Panel de <span className="highlight">Control</span></h2>
          <p className="hero-sub">
            Gestiona tus tareas de forma rápida y eficiente
          </p>
          <div className="hero-actions" />
          <EmailResumenBtn tareas={tareas} />
          <WhatsAppAlertBtn tareas={tareas} />
        </div>
      </section>

       {/* Card del usuario */}
      <div className="dashboard-grid">
        <div className="dashboard-col">
          <h2 className="section-title-dash">Mi <span className="highlight">Perfil</span></h2>
          <UserCard />
        </div>
        <div className="dashboard-col">
          <h2 className="section-title-dash">Calendario de <span className="highlight">Tareas</span></h2>
          <TaskCalendar tareas={tareas} />
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        Hecho con <span>♥</span> · Proyecto estudiantil · React + TypeScript
      </footer>
    </>
  );
}

export default TaskHome;
