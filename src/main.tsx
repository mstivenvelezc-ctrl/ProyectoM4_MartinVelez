import ReactDOM  from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import AppRouter from './Routes/AppRouter.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
);