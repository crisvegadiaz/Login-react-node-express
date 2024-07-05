import UsersModel from "./conecSql.js";
import session from "express-session";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import https from "https";
import path from "path";
import fs from "fs";

// Cargar variables de entorno
dotenv.config();

// Definir __filename y __dirname en entorno ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Deshabilitar el header X-Powered-By: Express
app.disable("x-powered-by");

// Usar Helmet para cabeceras de seguridad
app.use(helmet());

// Middleware para analizar cuerpos JSON y bodies codificados en URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: true,
    rolling: true,
    unset: "destroy",
    cookie: {
      secure: process.env.NODE_ENV === "production", // solo transmitir cookies a través de HTTPS en producción
      httpOnly: true, // evita que JavaScript acceda a las cookies
      maxAge: 1000 * 60 * 15, // 15 minutos
    },
  })
);

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "..", "dist")));

// Ruta de inicio de sesión
app.post("/", async (req, res) => {
  try {
    const { user, password } = req.body;

    const userExists = await UsersModel.getUserExists({
      name: user,
      password: password,
    });

    if (userExists === 1) {
      req.session.authenticated = true;
      res.json({ success: true });
    } else {
      res.status(203).json({ success: false });
    }
  } catch (error) {
    console.error(`Error en la ruta de inicio de sesión: ${error.message}`);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
});

// Ruta de creación de usuario
app.post("/creandoUser", async (req, res) => {
  try {
    const { name, phoneNumber, email, password } = req.body;

    const create = await UsersModel.createUser({
      name,
      phoneNumber,
      email,
      password,
    });

    if (create) {
      res.json({ create: true });
    } else {
      res.status(203).json({ create: false });
    }
  } catch (error) {
    console.error(`Error en la ruta de creación de usuario: ${error.message}`);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
});

// Ruta para verificar autenticación
app.get("/check-auth", (req, res) => {
  if (req.session.authenticated) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

// Ruta comodín para servir index.html para cualquier otra ruta
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"), (err) => {
    if (err) {
      res.status(500).send("Hubo un error al enviar el archivo.");
    }
  });
});

// Configuración HTTPS
const options = {
  key: fs.readFileSync(path.join(__dirname, "openssl", "primary-key.pem")), //  Clave privada
  cert: fs.readFileSync(path.join(__dirname, "openssl", "certificado.pem")), // Certificado
};

// Inicia el servidor HTTPS
const PORT = process.env.PORT || 3000;
https.createServer(options, app).listen(PORT, () => {
  console.log(`Servidor HTTPS escuchando en https://localhost:${PORT}`);
});
