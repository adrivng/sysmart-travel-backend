package net.mayorista.erp.maestros.operador.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OperadorResponse {
    private Long id;
    private String ruc;
    private String razonSocial;
    private String tipoOperador;
    private String contacto;
    private String telefono;
    private String email;
    private String direccion;
    private Boolean estado;
}