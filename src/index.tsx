import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, HashRouter, Navigate } from 'react-router-dom'
import App from './App';
import { ElevatorContainer } from './components/ElevatorContainer';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/floors/0" />} />
        <Route path="floors" element={<App />}> 
          <Route path=":floor" element={<ElevatorContainer />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
