package net.mayorista.erp.ventas.cotizacion.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CotizacionRequest {
    @NotNull(message = "El ID de la agencia es obligatorio")
    private Long agenciaId;

    @NotNull(message = "El ID del paquete es obligatorio")
    private Long paqueteId;

    @NotNull(message = "La cantidad de pasajeros es obligatoria")
    private Integer cantidadPasajeros;

    @NotNull(message = "La fecha de viaje es obligatoria")
    private LocalDate fechaViaje;
}