package net.mayorista.erp.maestros.moneda.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MonedaRequest {
    @NotBlank(message = "El código es obligatorio")
    @Size(min = 3, max = 3, message = "El código debe tener exactamente 3 letras")
    private String codigo;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El símbolo es obligatorio")
    private String simbolo;

    private Boolean estado;
}