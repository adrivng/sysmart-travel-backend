package net.mayorista.erp.maestros.moneda.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MonedaResponse {
    private Long id;
    private String codigo;
    private String nombre;
    private String simbolo;
    private Boolean estado;
}