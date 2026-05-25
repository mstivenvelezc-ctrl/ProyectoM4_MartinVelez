// src/routes/AppRouter.tsx
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import App from '../App.tsx';
import Login from '../Login.tsx';
import About from '../about.tsx';
import TaskRouter from './TaskRouter.tsx';

    export default function AppRouter() {
    return (
        <div className="app">
        {/* NAV */}
        <nav>
            <div className="nav-inner">
            <div className="nav-logo">My<span>Task</span></div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
            </div>
        </nav>

        {/* ROUTES */}
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/taskhome/*" element={<TaskRouter />} />
            <Route path="/tareas/*" element={<TaskRouter />} />
        </Routes>
        </div>
    );
    }