package net.mayorista.erp.maestros.moneda.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.moneda.dto.MonedaRequest;
import net.mayorista.erp.maestros.moneda.dto.MonedaResponse;
import net.mayorista.erp.maestros.moneda.service.MonedaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maestros/monedas")
@RequiredArgsConstructor
public class MonedaController {

    private final MonedaService monedaService;

    @GetMapping
    public ResponseEntity<List<MonedaResponse>> listar() {
        return ResponseEntity.ok(monedaService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<MonedaResponse> crear(@Valid @RequestBody MonedaRequest request) {
        return new ResponseEntity<>(monedaService.crear(request), HttpStatus.CREATED);
    }
}