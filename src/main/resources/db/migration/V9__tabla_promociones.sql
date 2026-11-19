CREATE TABLE promociones (
                             id BIGINT PRIMARY KEY,
                             titulo VARCHAR(255) NOT NULL,
                             subtitulo VARCHAR(255),
                             duracion VARCHAR(100),
                             precio NUMERIC(10, 2),
                             moneda VARCHAR(10),
                             aerolinea VARCHAR(100),
                             tipo_programa VARCHAR(50),
                             plantilla VARCHAR(50),
                             palabra_clave VARCHAR(255),
                             imagen_pr VARCHAR(255),
                             activo BOOLEAN DEFAULT TRUE
);