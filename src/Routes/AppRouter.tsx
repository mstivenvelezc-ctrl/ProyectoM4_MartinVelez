import { Link, Routes, Route, Navigate } from 'react-router-dom';

import App from '../App';
import Login from '../Login';
import About from '../about';
import TaskRouter from './TaskRouter';
import Register from '../Register';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthProvider';
import NotFound from '../NotFound';
import '../styles/App.css';

export default function AppRouter() {
  return (
    <AuthProvider>
      <div className="app">
        <nav>
          <div className="nav-inner">
            <Link to="/" className="nav-logo">My<span>Task</span></Link>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
        </nav>

        <Routes>
          {/* Rutas públicas */}
          <Route path="/"         element={<App />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/about"    element={<About />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas privadas: solo accesibles con sesión activa */}
          <Route element={<PrivateRoute />}>
            <Route path="/taskhome/*" element={<TaskRouter />} />
          </Route>

          {/* 404 */}
          <Route path="/404"  element={<NotFound />} />
          <Route path="*"     element={<Navigate to="/404" replace />} />

        </Routes>
      </div>
    </AuthProvider>
  );
}