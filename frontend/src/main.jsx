import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RutaProtegida } from "./context/AuthContext";
import CreateUser from "./pages/CreateUser";
import ReactDOM from "react-dom/client";
import Error404 from "./pages/Error404";
import Mensaje from "./pages/Mensaje";
import Login from "./pages/Login";
import React from "react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/creandoUser" element={<CreateUser/>} />
          <Route path="/mensaje" element={<RutaProtegida element={<Mensaje />} />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
