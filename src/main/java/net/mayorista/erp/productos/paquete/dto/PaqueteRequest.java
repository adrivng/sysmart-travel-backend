package net.mayorista.erp.productos.paquete.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaqueteRequest {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El destino es obligatorio")
    private Long destinoId;

    @NotNull(message = "Los días son obligatorios")
    private Integer dias;

    @NotNull(message = "Las noches son obligatorias")
    private Integer noches;

    @NotNull(message = "El precio en soles es obligatorio")
    private BigDecimal precioSoles;

    @NotNull(message = "El precio en dólares es obligatorio")
    private BigDecimal precioDolares;

    @NotNull(message = "El precio en euros es obligatorio")
    private BigDecimal precioEuros;

    private String incluye;
    private String noIncluye;
    private Boolean estado;
}