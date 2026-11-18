package net.mayorista.erp.maestros.agencia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AgenciaRequest {
    @NotBlank(message = "El RUC es obligatorio")
    @Size(min = 11, max = 11, message = "El RUC debe tener 11 dígitos")
    private String ruc;

    @NotBlank(message = "La razón social es obligatoria")
    private String razonSocial;

    private String direccion;
    private String telefono;
    private String email;
    private BigDecimal lineaCredito;
    private Integer diasCredito;
    private Boolean estado;
}