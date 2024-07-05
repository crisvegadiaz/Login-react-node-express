import {
  Button,
  TextField,
  InputLabel,
  IconButton,
  FormControl,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FaceIcon from "@mui/icons-material/Face";
import { Link, useNavigate } from "react-router-dom";
import "../styles/createUser.css";
import { useState, useEffect } from "react";

function CreateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [hasErrorUser, setHasErrorUser] = useState(false);
  const [hasErrorEmail, setHasErrorEmail] = useState(false);
  const [hasErrorPassword, setHasErrorPassword] = useState(false);
  const [hasErrorPhoneNumber, setHasErrorPhoneNumber] = useState(false);
  const [labelUser, setLabelUser] = useState("Name");
  const [labelEmail, setLabelEmail] = useState("Email");
  const [labelPassword, setLabelPassword] = useState("Password");
  const [labelPhoneNumber, setLabelPhoneNumber] = useState("Phone Number");
  const [datos, setDatos] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/creandoUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok)
        throw new Error("La respuesta de la red no estuvo bien ok");
      const data = await response.json();

      if (data.create) {
        navigate("/");
      } else {
        alert("El usuario o la clave está equivocados");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en la conexión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
      setDatos({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
      });
    }
  };

  const handleErrorUse = (text) => {
    setDatos({ ...datos, name: text });
    let reg = /^[a-zA-Z ]+$/;

    if (reg.test(text) || text.length === 0) {
      setLabelUser("Name");
      setHasErrorUser(false);
    } else {
      setLabelUser("Error");
      setHasErrorUser(true);
    }
  };

  const handleErrorEmail = (text) => {
    setDatos({ ...datos, email: text });
    let reg =
      /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/;

    if (reg.test(text) || text.length === 0) {
      setLabelEmail("Email");
      setHasErrorEmail(false);
    } else {
      setLabelEmail("Error");
      setHasErrorEmail(true);
    }
  };

  const handleErrorPhoneNumber = (text) => {
    setDatos({ ...datos, phoneNumber: text });
    let reg =
      /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/;

    if (reg.test(text) || text.length === 0) {
      setLabelPhoneNumber("Phone Number");
      setHasErrorPhoneNumber(false);
    } else {
      setLabelPhoneNumber("Error");
      setHasErrorPhoneNumber(true);
    }
  };

  const handleErrorPass = (text) => {
    setDatos({ ...datos, password: text });
    if (text.length <= 10) {
      setLabelPassword("Password");
      setHasErrorPassword(false);
    } else {
      setLabelPassword("Error");
      setHasErrorPassword(true);
    }
  };

  useEffect(() => {
    const { name, phoneNumber, email, password } = datos;
    if (
      name &&
      phoneNumber &&
      email &&
      password &&
      !hasErrorUser &&
      !hasErrorEmail &&
      !hasErrorPhoneNumber &&
      !hasErrorPassword
    ) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [
    datos,
    hasErrorUser,
    hasErrorEmail,
    hasErrorPhoneNumber,
    hasErrorPassword,
  ]);

  return (
    <section className="containedCreateUser">
      <Link className="btnCreateUser" to="/">
        Home
      </Link>
      <form onSubmit={handleCreateUserSubmit}>
        <TextField
          id="name-field"
          label={labelUser}
          value={datos.name}
          variant="outlined"
          error={hasErrorUser}
          sx={{ width: "100%" }}
          onChange={(e) => handleErrorUse(e.target.value)}
          helperText={hasErrorUser ? "El user name solo debe tener letras" : ""}
        />
        <TextField
          variant="outlined"
          sx={{ width: "100%" }}
          id="phone-number-field"
          label={labelPhoneNumber}
          value={datos.phoneNumber}
          error={hasErrorPhoneNumber}
          onChange={(e) => handleErrorPhoneNumber(e.target.value)}
          helperText={
            hasErrorPhoneNumber ? "Ingrese el numero de teléfono" : ""
          }
        />
        <TextField
          id="email-field"
          variant="outlined"
          label={labelEmail}
          value={datos.email}
          sx={{ width: "100%" }}
          error={hasErrorEmail}
          onChange={(e) => handleErrorEmail(e.target.value)}
          helperText={hasErrorEmail ? "Coloque su email" : ""}
        />
        <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
          <InputLabel htmlFor="password-field" error={hasErrorPassword}>
            {labelPassword}
          </InputLabel>
          <OutlinedInput
            id="password-field"
            type={showPassword ? "text" : "password"}
            value={datos.password}
            error={hasErrorPassword}
            onChange={(e) => handleErrorPass(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={labelPassword}
          />
          <FormHelperText error={hasErrorPassword}>
            {hasErrorPassword ? "El password no es más de 10 caracteres" : ""}
          </FormHelperText>
        </FormControl>
        <Button
          size="large"
          type="submit"
          variant="contained"
          disabled={disableBtn || isLoading}
          startIcon={isLoading ? <CircularProgress size={24} /> : <FaceIcon />}
          sx={{
            width: "100%",
            backgroundColor: "#9BCCE0",
            ":hover": {
              backgroundColor: "#96C4D8",
            },
          }}
        >
          {isLoading ? "Cargando..." : "Crear"}
        </Button>
      </form>
    </section>
  );
}

export default CreateUser;
