package net.mayorista.erp.seguridad.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.mayorista.erp.seguridad.dto.LoginRequest;
import net.mayorista.erp.seguridad.dto.LoginResponse;
import net.mayorista.erp.seguridad.dto.RegisterRequest;
import net.mayorista.erp.seguridad.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}