CREATE TABLE operadores (
                            id BIGSERIAL PRIMARY KEY,
                            ruc VARCHAR(11) UNIQUE NOT NULL,
                            razon_social VARCHAR(200) NOT NULL,
                            tipo_operador VARCHAR(50) NOT NULL,
                            contacto VARCHAR(100),
                            telefono VARCHAR(20),
                            email VARCHAR(100),
                            direccion VARCHAR(255),
                            estado BOOLEAN DEFAULT TRUE
);