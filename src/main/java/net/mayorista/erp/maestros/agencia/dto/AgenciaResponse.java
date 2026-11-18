package net.mayorista.erp.maestros.agencia.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class AgenciaResponse {
    private Long id;
    private String ruc;
    private String razonSocial;
    private String direccion;
    private String telefono;
    private String email;
    private BigDecimal lineaCredito;
    private Integer diasCredito;
    private Boolean estado;
}