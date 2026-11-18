package net.mayorista.erp.seguridad.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class LoginResponse {
    private String token;
    private String username;
    private String nombres; // Opcional, si tu entidad Usuario tiene nombre
    private List<String> roles;
}