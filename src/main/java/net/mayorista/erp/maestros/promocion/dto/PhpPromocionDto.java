package net.mayorista.erp.maestros.promocion.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PhpPromocionDto {
    private String id;
    private String titulo;
    private String subtitulo;
    private String duracion;

    @JsonProperty("fecha_limite")
    private String fechaLimite;

    private BigDecimal precio;
    private String moneda;
    private String aerolinea;

    @JsonProperty("tipo_programa")
    private String tipoPrograma;

    private String plantilla;

    @JsonProperty("palabra_clave")
    private String palabraClave;

    @JsonProperty("imagen_pr")
    private String imagenPr;
}