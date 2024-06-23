import { Button, CircularProgress } from "@mui/material";
import AvatarLogin from "../components/AvatarLogin";
import InputLogin from "../components/InputLogin";
import { useAuth } from "../context/AuthContext";
import EastIcon from "@mui/icons-material/East";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/login.css";

function Login() {
  const [hasErrorUser, setHasErrorUser] = useState(false);
  const [hasErrorPass, setHasErrorPass] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, password }),
      });

      if (!response.ok) throw new Error("La respuesta de la red no estuvo bien ok");
      const data = await response.json();

      if (data.success) {
        login(); // Actualizar el estado de autenticación en el contexto
        navigate("/mensaje");
      } else {
        alert("El usuario o la clave está equivocados");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en la conexión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
      setPassword("");
      setUser("");
    }
  };

  useEffect(() => {
    if (
      !hasErrorPass &&
      !hasErrorUser &&
      user.length > 0 &&
      password.length > 0
    ) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [hasErrorPass, hasErrorUser, password, user]);

  return (
    <div className="containedLogin">
      <form onSubmit={handleLoginSubmit}>
        <AvatarLogin
          useAva={
            user.length >= 2 ? `${user[0]}${user[1]}`.toUpperCase() : "US"
          }
        />
        <InputLogin
          user={user}
          setUser={setUser}
          password={password}
          setPassword={setPassword}
          hasErrorUser={hasErrorUser}
          setHasErrorUser={setHasErrorUser}
          hasErrorPass={hasErrorPass}
          setHasErrorPass={setHasErrorPass}
        />
        <Button
          disabled={disableBtn || isLoading}
          variant="contained"
          size="large"
          type="submit"
          startIcon={isLoading ? <CircularProgress size={24} /> : <EastIcon />}
          sx={{
            width: "100%",
            backgroundColor: "#9BCCE0",
            ":hover": {
              backgroundColor: "#96C4D8",
            },
          }}
        >
          {isLoading ? "Cargando..." : "Login"}
        </Button>
      </form>
    </div>
  );
}

export default Login;
