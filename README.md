# Sistema de Autenticación Seguro

---

## Descripción del Proyecto
Este proyecto es un sistema de autenticación seguro que permite a los usuarios iniciar sesión utilizando credenciales almacenadas en una base de datos MySQL. La aplicación utiliza Express.js para el backend y React para el frontend, y está protegida con Helmet y HTTPS para mejorar la seguridad.

---

## Objetivos del Proyecto
- Proporcionar un sistema seguro de autenticación de usuarios.
- Asegurar la comunicación entre el cliente y el servidor utilizando HTTPS.
- Proteger las sesiones de usuario con configuraciones seguras de cookies.

---

## Requisitos del Sistema
- Node.js (versión 14 o superior)
- Docker y Docker Compose
- Certificado SSL para HTTPS

---

## Tecnologías Utilizadas
- **Backend:** Node.js, Express.js
- **Frontend:** React, React Router
- **Base de Datos:** MySQL (usando Docker)
- **Seguridad:** Helmet, HTTPS, Express-session

---

# Documentación del Backend

Este documento describe el backend de una aplicación web. Está construido utilizando Node.js con Express y MySQL. A continuación se detalla el funcionamiento y las configuraciones del código.

## Estructura de Archivos

- **app.js**: Archivo principal que configura y arranca el servidor Express.
- **conecSql.js**: Módulo encargado de la conexión a la base de datos MySQL.
- **openssl/**: Carpeta que contiene la clave privada y el certificado SSL.

## Dependencias

El backend utiliza las siguientes dependencias:
- `express`: Framework web para Node.js.
- `express-session`: Middleware para manejar sesiones.
- `dotenv`: Cargar variables de entorno desde un archivo `.env`.
- `helmet`: Middleware para asegurar las cabeceras HTTP.
- `https`: Módulo para crear un servidor HTTPS.
- `path`: Módulo para manejar rutas y directorios.
- `fs`: Módulo para trabajar con el sistema de archivos.
- `mysql2/promise`: Conector de MySQL con soporte para promesas.

## Configuración de Variables de Entorno

Las variables de entorno son cargadas desde un archivo `.env` usando `dotenv.config()`. Estas variables incluyen:
- `SESSION_SECRET`: Secreto para las sesiones.
- `NODE_ENV`: Entorno de ejecución (`production` o `development`).
- `PORT`: Puerto en el que se ejecuta el servidor.
- `DB_HOST`: Host de la base de datos.
- `DB_USER`: Usuario de la base de datos.
- `DB_PASSWORD`: Contraseña de la base de datos.
- `DB_PORT`: Puerto de la base de datos.
- `DB_NAME`: Nombre de la base de datos.

## Configuración y Arranque del Servidor

El servidor es configurado y arrancado de la siguiente manera:

1. **Inicialización de Express**:
    ```javascript
    const app = express();
    ```

2. **Deshabilitar cabecera "X-Powered-By"**:
    ```javascript
    app.disable("x-powered-by");
    ```

3. **Usar Helmet para seguridad**:
    ```javascript
    app.use(helmet());
    ```

4. **Middlewares para parsear JSON y URL-encoded**:
    ```javascript
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    ```

5. **Manejo de sesiones**:
    ```javascript
    app.use(session({
        secret: process.env.SESSION_SECRET || "default-secret",
        resave: false,
        saveUninitialized: true,
        rolling: true,
        unset: "destroy",
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 1000 * 60 * 15,
        },
    }));
    ```

6. **Servir archivos estáticos**:
    ```javascript
    app.use(express.static(path.join(__dirname, "..", "dist")));
    ```

7. **Definición de rutas**:
    - **Inicio de sesión**:
        ```javascript
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
                res.status(500).json({ success: false, error: "Error interno del servidor" });
            }
        });
        ```

    - **Crear usuario**:
        ```javascript
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
                res.status(500).json({ success: false, error: "Error interno del servidor" });
            }
        });
        ```

    - **Verificar autenticación**:
        ```javascript
        app.get("/check-auth", (req, res) => {
            if (req.session.authenticated) {
                res.json({ authenticated: true });
            } else {
                res.json({ authenticated: false });
            }
        });
        ```

    - **Ruta comodín**:
        ```javascript
        app.get("*", (_, res) => {
            res.sendFile(path.join(__dirname, "..", "dist", "index.html"), (err) => {
                if (err) {
                    res.status(500).send("Hubo un error al enviar el archivo.");
                }
            });
        });
        ```

8. **Configuración HTTPS**:
    ```javascript
    const options = {
        key: fs.readFileSync(path.join(__dirname, "openssl", "primary-key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "openssl", "certificado.pem")),
    };
    ```

9. **Iniciar el servidor**:
    ```javascript
    const PORT = process.env.PORT || 3000;
    https.createServer(options, app).listen(PORT, () => {
        console.log(`Servidor HTTPS escuchando en https://localhost:${PORT}`);
    });
    ```

## Modelo de Usuario (conecSql.js)

El archivo `conecSql.js` gestiona la conexión a la base de datos y define el modelo de usuario.

### Inicialización de la Conexión

La conexión a la base de datos se establece usando `mysql.createPool()`:
```javascript
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
let connection;

async function initializeConnection() {
    try {
        connection = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        console.log("Conectado con éxito a la base de datos");
    } catch (error) {
        console.error("Error al crear el grupo de conexiones:", error);
        process.exit(1); // Exit process with failure
    }
}

initializeConnection();
```

### Métodos del Modelo de Usuario

- **getUserExists**: Verifica si un usuario existe en la base de datos.
    ```javascript
    static async getUserExists({ name, password }) {
        try {
            if (!connection) {
                throw new Error("No se ha establecido la conexión con la base de datos");
            }

            const [rows] = await connection.query(
                `SELECT EXISTS(SELECT 1 FROM users WHERE user_name = ? AND password = SHA2(?, 256)) AS user_exists;`,
                [name, password]
            );
            return rows[0].user_exists;
        } catch (error) {
            console.error(`Error en la consulta getUserExists: ${error.message}`);
            throw new Error(`Error en la consulta getUserExists: ${error.message}`);
        }
    }
    ```

- **createUser**: Crea un nuevo usuario en la base de datos.
    ```javascript
    static async createUser({ name, phoneNumber, email, password }) {
        try {
            if (!connection) {
                throw new Error("No se ha establecido la conexión con la base de datos");
            }

            const [result] = await connection.query(
                `INSERT INTO users (user_name, phoneNumber, email, password) VALUES (?, ?, ?, SHA2(?, 256))`,
                [name, phoneNumber, email, password]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error en la consulta createUser: ${error.message}`);
            return false;
        }
    }
    ```

## Conexión a la Base de Datos

La conexión a la base de datos se maneja en el archivo `conecSql.js`:

1. **Configurar conexión con MySQL**:
    ```javascript
    import mysql from "mysql2/promise";
    import dotenv from "dotenv";

    dotenv.config();
    let connection;

    async function initializeConnection() {
        try {
            connection = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            });
            console.log("Conectado con éxito a la base de datos");
        } catch (error) {
            console.error("Error al crear el grupo de conexiones:", error);
            process.exit(1);
        }
    }

    initializeConnection();
    ```

2. **Definición del modelo de usuario**:
    ```javascript
    class UsersModel {
        static async getUserExists({ name, password }) {
            try {
                if (!connection) {
                    throw new Error("No se ha establecido la conexión con la base de datos");
                }

                const [rows] = await connection.query(
                    `SELECT 
                    EXISTS(
                        SELECT 
                            1 
                        FROM 
                            users 
                        WHERE 
                            user_name = ?
                            AND password = SHA2(?, 256)
                    ) AS user_exists;`,
                    [name, password]
                );
                return rows[0].user_exists;
            } catch (error) {
                console.error(`Error en la consulta getUserExists: ${error.message}`);
                throw new Error(`Error en la consulta getUserExists: ${error.message}`);
            }
        }
    }

    export default UsersModel;
    ```

# Documentación de la Base de Datos

Esta sección describe la configuración de la base de datos de la aplicación. Utiliza MySQL y está configurada para ejecutarse dentro de un contenedor Docker. La configuración incluye la creación de la base de datos y una tabla de usuarios, así como la inserción de datos de prueba.

## Estructura de Archivos

- **docker-compose.yaml**: Archivo de configuración para Docker Compose.
- **init.sql**: Script SQL para inicializar la base de datos.

## `docker-compose.yaml`

Este archivo define un servicio MySQL que se ejecuta en un contenedor Docker. A continuación se detalla el contenido y la configuración:

```yaml
services:
  mysql:
    image: mysql:8.0.35
    container_name: mysql-login
    environment:
      MYSQL_ROOT_PASSWORD: 12345
      MYSQL_USER: cristian
      MYSQL_PASSWORD: 12345
    ports:
      - "3306:3306"
    volumes:
      - ./mysql-data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```

### Descripción de los parámetros

- **services**: Define los servicios que Docker Compose va a crear.
- **mysql**: Nombre del servicio que utiliza la imagen `mysql:8.0.35`.
  - **container_name**: Nombre del contenedor Docker.
  - **environment**: Variables de entorno para la configuración de MySQL.
    - `MYSQL_ROOT_PASSWORD`: Contraseña para el usuario root.
    - `MYSQL_USER`: Nombre de usuario no root.
    - `MYSQL_PASSWORD`: Contraseña para el usuario no root.
  - **ports**: Mapeo de puertos del contenedor al host.
    - `"3306:3306"`: Mapea el puerto 3306 del contenedor al puerto 3306 del host.
  - **volumes**: Define volúmenes para persistencia de datos y ejecución de scripts de inicialización.
    - `./mysql-data:/var/lib/mysql`: Persiste los datos de MySQL en el directorio `./mysql-data`.
    - `./init.sql:/docker-entrypoint-initdb.d/init.sql`: Monta el script de inicialización SQL.

## `init.sql`

Este archivo contiene las instrucciones SQL para inicializar la base de datos. A continuación se describe su contenido:

```sql
-- creación de la base de datos
CREATE DATABASE IF NOT EXISTS users_db;

-- usar la base de datos correcta
USE users_db;

-- crear la tabla users
CREATE TABLE IF NOT EXISTS users (
  id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  user_name VARCHAR(50) COLLATE utf8_bin NOT NULL CHECK (user_name REGEXP '^[a-zA-Z ]+$'),
  phoneNumber VARCHAR(15) COLLATE utf8_bin NOT NULL CHECK (phoneNumber REGEXP '^[0-9]{8,15}$'),
  email VARCHAR(100) COLLATE utf8_bin NOT NULL CHECK (
    email REGEXP '[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}'
  ),
  password VARCHAR(64) COLLATE utf8_bin NOT NULL,
  UNIQUE (user_name, password)
);

-- ingreso de datos de prueba a tabla users
INSERT INTO
  users (user_name, phoneNumber, email, password)
VALUES
  (
    'Juan Perez',
    '1234567890',
    'juan.perez@example.com',
    SHA2('123', 256)
  ),
  (
    'Maria Garcia',
    '0987654321',
    'maria.garcia@example.com',
    SHA2('abc', 256)
  ),
  (
    'Pedro Martinez',
    '1112223333',
    'pedro.martinez@example.com',
    SHA2('123abc', 256)
  ),
  (
    'Ana Lopez',
    '2223334444',
    'ana.lopez@example.com',
    SHA2('password', 256)
  ),
  (
    'Luis Rodriguez',
    '3334445555',
    'luis.rodriguez@example.com',
    SHA2('password123', 256)
  );
```

### Descripción de las instrucciones SQL

- **CREATE DATABASE IF NOT EXISTS users_db**: Crea la base de datos `users_db` si no existe.
- **USE users_db**: Selecciona la base de datos `users_db` para usarla.
- **CREATE TABLE IF NOT EXISTS users**: Crea la tabla `users` con las siguientes columnas:
  - `id`: Identificador único (UUID).
  - `user_name`: Nombre de usuario (debe contener solo letras y espacios).
  - `phoneNumber`: Número de teléfono (debe contener entre 8 y 15 dígitos).
  - `email`: Dirección de correo electrónico (con una estructura válida).
  - `password`: Contraseña (almacenada como hash SHA-256).
  - Define una restricción única en `user_name` y `password`.
- **INSERT INTO users (user_name, phoneNumber, email, password) VALUES**: Inserta datos de prueba en la tabla `users`. Las contraseñas se almacenan como hashes SHA-256.

## Cómo Ejecutar

1. **Iniciar los servicios Docker**:
    ```sh
    docker-compose up -d
    ```

2. **Verificar que el contenedor MySQL esté corriendo**:
    ```sh
    docker ps
    ```

3. **Acceder a la base de datos MySQL dentro del contenedor**:
    ```sh
    docker exec -it mysql-login mysql -u cristian -p
    ```
    Ingresar la contraseña configurada (`12345`).

4. **Verificar que la base de datos y la tabla se hayan creado**:
    ```sql
    USE users_db;
    SHOW TABLES;
    SELECT * FROM users;
    ```
