import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import New from './pages/New';
import Edit from './pages/Edit';
import Preview from './pages/Preview';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Let init our dnd provider with help of react-dnd
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="new" element={<New />} />
      <Route path="edit" element={<Edit />} />
      <Route path="preview" element={<Preview />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
