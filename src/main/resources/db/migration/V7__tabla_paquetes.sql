CREATE TABLE paquetes (
                          id BIGSERIAL PRIMARY KEY,
                          nombre VARCHAR(150) NOT NULL,
                          descripcion TEXT,
                          destino_id BIGINT NOT NULL,
                          dias INTEGER NOT NULL,
                          noches INTEGER NOT NULL,
                          precio_soles NUMERIC(12, 2) NOT NULL,
                          precio_dolares NUMERIC(12, 2) NOT NULL,
                          precio_euros NUMERIC(12, 2) NOT NULL,
                          incluye TEXT,
                          no_incluye TEXT,
                          estado BOOLEAN DEFAULT TRUE,
                          CONSTRAINT fk_paquete_destino FOREIGN KEY (destino_id) REFERENCES destinos(id)
);