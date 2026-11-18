CREATE TABLE agencias (
                          id BIGSERIAL PRIMARY KEY,
                          ruc VARCHAR(11) UNIQUE NOT NULL,
                          razon_social VARCHAR(200) NOT NULL,
                          direccion VARCHAR(255),
                          telefono VARCHAR(20),
                          email VARCHAR(100),
                          linea_credito NUMERIC(12, 2) DEFAULT 0.00,
                          dias_credito INTEGER DEFAULT 0,
                          estado BOOLEAN DEFAULT TRUE
);