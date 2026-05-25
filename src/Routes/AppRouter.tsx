import { Link, Routes, Route } from 'react-router-dom';
import App from '../App';
import Login from '../Login';
import About from '../about';
import TaskRouter from './TaskRouter';
import '../App.css';

export default function AppRouter() {
  return (
    <div className="app">
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

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/taskhome/*" element={<TaskRouter />} />
      </Routes>
    </div>
  );
}
