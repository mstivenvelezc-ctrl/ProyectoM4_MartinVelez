  import { Link, Routes, Route, useNavigate } from 'react-router-dom';
  import TaskHome from '../TaskHome';
  import Tareas from '../tareas';
  import { useAuth } from './UseAuth';

  export default function TaskRouter() {
    const navigate  = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
      logout();               // limpia contexto + localStorage
      navigate('/login');
    };

    return (
      <div className="app">
        <nav>
          <div className="nav-inner">
            <div className="nav-logo">My<span>Task</span></div>
            <ul className="nav-links">
              <li><Link to="/taskhome">Inicio</Link></li>
              <li><Link to="/taskhome/tareas">Tareas</Link></li>
              <li>
                <button
                  className="btn-logout"
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '1rem' }}
                >
                  Salir ↰
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route index          element={<TaskHome />} />
          <Route path="tareas"  element={<Tareas />} />
        </Routes>
      </div>
    );
  }