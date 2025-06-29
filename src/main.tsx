import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import "@fontsource/inter";
import Suite from "./components/opener/landingpage.tsx";
import { RegisterForm } from "./components/auth/RegisterForm.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import LoginForm from "./components/auth/LoginForm.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Suite />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/app" element={<App />} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
