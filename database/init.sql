-- creación de la base de datos
CREATE DATABASE IF NOT EXISTS users_db;

-- usar la base de datos correcta
USE users_db;

-- crear la tabla users
CREATE TABLE IF NOT EXISTS users (
  id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  user_name VARCHAR(30) COLLATE utf8_bin NOT NULL CHECK (user_name REGEXP '^[a-zA-Z]+$'),
  password VARCHAR(64) COLLATE utf8_bin NOT NULL,
  UNIQUE (user_name, password)
);

-- ingreso de datos de prueba a tabla users
INSERT INTO
  users (user_name, password)
VALUES
  ('Juan', SHA2('123', 256)),
  ('Maria', SHA2('abc', 256)),
  ('maria', SHA2('abc', 256)),
  ('Pedro', SHA2('123abc', 256)),
  ('Pedro', SHA2('123Abc', 256));
