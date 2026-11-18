package net.mayorista.erp.ventas.cotizacion.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.mayorista.erp.ventas.cotizacion.dto.CotizacionRequest;
import net.mayorista.erp.ventas.cotizacion.dto.CotizacionResponse;
import net.mayorista.erp.ventas.cotizacion.service.CotizacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas/cotizaciones")
@RequiredArgsConstructor
public class CotizacionController {

    private final CotizacionService cotizacionService;

    @GetMapping
    public ResponseEntity<List<CotizacionResponse>> listar() {
        return ResponseEntity.ok(cotizacionService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<CotizacionResponse> crear(@Valid @RequestBody CotizacionRequest request) {
        return new ResponseEntity<>(cotizacionService.crear(request), HttpStatus.CREATED);
    }
}