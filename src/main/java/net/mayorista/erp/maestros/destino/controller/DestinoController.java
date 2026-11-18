package net.mayorista.erp.maestros.destino.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.destino.dto.DestinoRequest;
import net.mayorista.erp.maestros.destino.dto.DestinoResponse;
import net.mayorista.erp.maestros.destino.service.DestinoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maestros/destinos")
@RequiredArgsConstructor
public class DestinoController {

    private final DestinoService destinoService;

    @GetMapping
    public ResponseEntity<List<DestinoResponse>> listar() {
        return ResponseEntity.ok(destinoService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<DestinoResponse> crear(@Valid @RequestBody DestinoRequest request) {
        return new ResponseEntity<>(destinoService.crear(request), HttpStatus.CREATED);
    }
}