import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppRouter from './Routes/AppRouter.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root')!
);

root.render(
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
);