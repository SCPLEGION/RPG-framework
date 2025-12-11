import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Navbar, { NavbarProvider } from "./addons/navbar.jsx";

function Root() {
  return (
    <BrowserRouter>
      <NavbarProvider>
        <Navbar>
          <App />
        </Navbar>
      </NavbarProvider>
    </BrowserRouter>
  );
}

const isProduction = import.meta.env.MODE === 'production';

createRoot(document.getElementById('root')).render(
  isProduction ? <Root /> : <StrictMode><Root /></StrictMode>,
);
