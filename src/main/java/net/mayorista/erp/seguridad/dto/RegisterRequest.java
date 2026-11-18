package net.mayorista.erp.seguridad.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

    private String nombres;
    private String apellidos;
    private String email;
}