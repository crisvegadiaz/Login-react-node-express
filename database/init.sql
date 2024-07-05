-- creación de la base de datos
CREATE DATABASE IF NOT EXISTS users_db;

-- usar la base de datos correcta
USE users_db;

-- crear la tabla users con los campos nuevos
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