package net.mayorista.erp.maestros.destino.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DestinoResponse {
    private Long id;
    private String nombre;
    private String pais;
    private String codigoIata;
    private Boolean estado;
}