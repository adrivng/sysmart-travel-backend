CREATE TABLE monedas (
                         id BIGSERIAL PRIMARY KEY,
                         codigo VARCHAR(3) UNIQUE NOT NULL,
                         nombre VARCHAR(50) NOT NULL,
                         simbolo VARCHAR(5) NOT NULL,
                         estado BOOLEAN DEFAULT TRUE
);

INSERT INTO monedas (codigo, nombre, simbolo, estado) VALUES
                                                          ('PEN', 'Sol Peruano', 'S/', TRUE),
                                                          ('USD', 'Dólar Americano', '$', TRUE),
                                                          ('EUR', 'Euro', '€', TRUE);