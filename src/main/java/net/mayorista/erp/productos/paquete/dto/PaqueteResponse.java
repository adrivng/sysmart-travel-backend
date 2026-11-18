package net.mayorista.erp.productos.paquete.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class PaqueteResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private Long destinoId;
    private String destinoNombre;
    private String destinoPais;
    private Integer dias;
    private Integer noches;
    private BigDecimal precioSoles;
    private BigDecimal precioDolares;
    private BigDecimal precioEuros;
    private String incluye;
    private String noIncluye;
    private Boolean estado;
}