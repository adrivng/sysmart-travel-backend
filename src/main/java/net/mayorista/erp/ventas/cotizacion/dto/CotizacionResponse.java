package net.mayorista.erp.ventas.cotizacion.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class CotizacionResponse {
    private Long id;
    private String codigo;
    private String agenciaNombre;
    private String paqueteNombre;
    private Integer cantidadPasajeros;
    private LocalDate fechaViaje;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private String estado;
    private LocalDateTime fechaCreacion;
}