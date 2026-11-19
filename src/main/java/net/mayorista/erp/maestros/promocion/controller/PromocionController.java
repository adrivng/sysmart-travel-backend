package net.mayorista.erp.maestros.promocion.controller;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.promocion.service.PromocionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maestros/promociones")
@RequiredArgsConstructor
public class PromocionController {

    private final PromocionService promocionService;

    @PostMapping("/migrar-desde-php")
    public ResponseEntity<String> migrarDesdePhp() {
        return ResponseEntity.ok(promocionService.migrarDesdePhp());
    }
}