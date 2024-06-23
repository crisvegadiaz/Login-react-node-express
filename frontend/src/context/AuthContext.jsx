import React, { useState, useEffect, createContext, useContext } from "react";
import { Navigate } from "react-router-dom";
import Cargando from "../pages/Cargando";

// Crear un contexto para la autenticación
const AuthContext = createContext();

// Proveedor de autenticación
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/check-auth");
        if (!response.ok) throw new Error("La respuesta de la red no estuvo ok");
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
const useAuth = () => useContext(AuthContext);

// Componente para rutas protegidas
const RutaProtegida = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <Cargando />;
  }

  return isAuthenticated ? element : <Navigate to="/" />;
};

export { AuthProvider, useAuth, RutaProtegida };
