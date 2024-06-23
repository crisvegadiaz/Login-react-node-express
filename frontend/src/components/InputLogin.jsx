import { useState } from "react";
import {
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  TextField,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function InputLogin({
  user,
  setUser,
  password,
  setPassword,
  hasErrorUser,
  setHasErrorUser,
  hasErrorPass,
  setHasErrorPass,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [labelUser, setLabelUser] = useState("User Name");
  const [labelPass, setLabelPass] = useState("Password");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleErrorUse = (text) => {
    setUser(text);
    let reg = /^[a-zA-Z]+$/;

    if (reg.test(text) || text.length === 0) {
      setLabelUser("User Name");
      setHasErrorUser(false);
    } else {
      setLabelUser("Error");
      setHasErrorUser(true);
    }
  };

  const handleErrorPass = (text) => {
    setPassword(text);
    if (text.length <= 10) {
      setLabelPass("Password");
      setHasErrorPass(false);
    } else {
      setLabelPass("Error");
      setHasErrorPass(true);
    }
  };

  return (
    <>
      <TextField
        helperText={hasErrorUser ? "El user name solo debe tener letras" : ""}
        error={hasErrorUser}
        onChange={(e) => handleErrorUse(e.target.value)}
        label={labelUser}
        value={user}
        id="outlined-required"
        sx={{ width: "100%" }}
      />
      <FormControl sx={{ width: "100%" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password" error={hasErrorPass}>
          {labelPass}
        </InputLabel>
        <OutlinedInput
          onChange={(e) => handleErrorPass(e.target.value)}
          error={hasErrorPass}
          value={password}
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
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
          label={labelPass}
        />
        <FormHelperText error={hasErrorPass}>
          {hasErrorPass ? "El password no es mas 10 caracteres" : ""}
        </FormHelperText>
      </FormControl>
    </>
  );
}

export default InputLogin;
