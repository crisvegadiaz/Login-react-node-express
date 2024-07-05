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

class UsersModel {
  static async getUserExists({ name, password }) {
    try {
      if (!connection) {
        throw new Error(
          "No se ha establecido la conexión con la base de datos"
        );
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

  static async createUser({ name, phoneNumber, email, password }) {
    try {
      if (!connection) {
        throw new Error(
          "No se ha establecido la conexión con la base de datos"
        );
      }

      const [result] = await connection.query(
        `INSERT INTO
        users (user_name, phoneNumber, email, password)
        VALUES (?, ?, ?, SHA2(?, 256))`,
        [name, phoneNumber, email, password]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error en la consulta createUser: ${error.message}`);
      return false;
    }
  }
}

export default UsersModel;
