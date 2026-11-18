CREATE TABLE cotizaciones (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    agencia_id BIGINT NOT NULL,
    paquete_id BIGINT NOT NULL,
    cantidad_pasajeros INTEGER NOT NULL,
    fecha_viaje DATE NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    igv NUMERIC(12, 2) NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cotizacion_agencia FOREIGN KEY (agencia_id) REFERENCES agencias(id),
    CONSTRAINT fk_cotizacion_paquete FOREIGN KEY (paquete_id) REFERENCES paquetes(id)
);