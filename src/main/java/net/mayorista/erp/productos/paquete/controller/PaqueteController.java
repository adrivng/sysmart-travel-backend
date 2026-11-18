package net.mayorista.erp.productos.paquete.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.mayorista.erp.productos.paquete.dto.PaqueteRequest;
import net.mayorista.erp.productos.paquete.dto.PaqueteResponse;
import net.mayorista.erp.productos.paquete.service.PaqueteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos/paquetes")
@RequiredArgsConstructor
public class PaqueteController {

    private final PaqueteService paqueteService;

    @GetMapping
    public ResponseEntity<List<PaqueteResponse>> listar() {
        return ResponseEntity.ok(paqueteService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<PaqueteResponse> crear(@Valid @RequestBody PaqueteRequest request) {
        return new ResponseEntity<>(paqueteService.crear(request), HttpStatus.CREATED);
    }
}