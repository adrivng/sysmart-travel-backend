package net.mayorista.erp.maestros.destino.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DestinoRequest {
    @NotBlank(message = "El nombre del destino es obligatorio")
    private String nombre;

    @NotBlank(message = "El país es obligatorio")
    private String pais;

    @Size(min = 3, max = 3, message = "El código IATA debe tener 3 letras")
    private String codigoIata;

    private Boolean estado;
}