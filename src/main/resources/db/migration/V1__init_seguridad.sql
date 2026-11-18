-- V1__init_seguridad.sql

CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE usuarios (
                          id BIGSERIAL PRIMARY KEY,
                          username VARCHAR(50) UNIQUE NOT NULL,
                          password VARCHAR(255) NOT NULL,
                          nombres VARCHAR(100),
                          apellidos VARCHAR(100),
                          email VARCHAR(100) UNIQUE,
                          estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE usuarios_roles (
                                usuario_id BIGINT NOT NULL,
                                rol_id BIGINT NOT NULL,
                                PRIMARY KEY (usuario_id, rol_id),
                                CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
                                CONSTRAINT fk_rol FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Insertamos un Rol de prueba
INSERT INTO roles (nombre) VALUES ('ADMIN');

-- Insertamos un Usuario de prueba (La contraseña es '123456' encriptada con BCrypt)
INSERT INTO usuarios (username, password, nombres, apellidos, email, estado)
VALUES ('admin', '$2a$10$wE9z1vXn.C4V3xO.5B3v.Oq6Kz3l4Q.8T3y3y3y3y3y3y3y3y3y3y', 'Administrador', 'Sistema', 'admin@erp.com', TRUE);

-- Asignamos el rol ADMIN al usuario admin (asumiendo que el usuario tiene ID 1 y el rol ID 1)
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (1, 1);