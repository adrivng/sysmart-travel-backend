CREATE TABLE destinos (
                          id BIGSERIAL PRIMARY KEY,
                          nombre VARCHAR(100) NOT NULL,
                          pais VARCHAR(100) NOT NULL,
                          codigo_iata VARCHAR(3),
                          estado BOOLEAN DEFAULT TRUE
);