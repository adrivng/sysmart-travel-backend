package net.mayorista.erp.maestros.operador.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OperadorRequest {
    @NotBlank(message = "El RUC es obligatorio")
    @Size(min = 11, max = 11, message = "El RUC debe tener 11 dígitos")
    private String ruc;

    @NotBlank(message = "La razón social es obligatoria")
    private String razonSocial;

    @NotBlank(message = "El tipo de operador es obligatorio (HOTEL, AEROLINEA, TOUR_OPERADOR)")
    private String tipoOperador;

    private String contacto;
    private String telefono;
    private String email;
    private String direccion;
    private Boolean estado;
}