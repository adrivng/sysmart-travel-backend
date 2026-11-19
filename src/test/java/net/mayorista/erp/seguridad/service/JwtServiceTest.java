package net.mayorista.erp.seguridad.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", "clave-de-prueba-super-secreta-para-jwt-123456");
        ReflectionTestUtils.setField(jwtService, "expirationMinutes", 60L);

        userDetails = User.withUsername("usuario.prueba")
                .password("password")
                .authorities(List.of())
                .build();
    }

    @Test
    void generaTokenYExtraeUsuario() {
        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
        assertFalse(token.isBlank());
        assertEquals("usuario.prueba", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    void tokenInvalidoParaOtroUsuario() {
        String token = jwtService.generateToken(userDetails);
        UserDetails otroUsuario = User.withUsername("otro.usuario")
                .password("password")
                .authorities(List.of())
                .build();

        assertFalse(jwtService.isTokenValid(token, otroUsuario));
    }
}
