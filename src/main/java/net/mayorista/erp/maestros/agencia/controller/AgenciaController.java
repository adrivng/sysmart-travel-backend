package net.mayorista.erp.maestros.agencia.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.agencia.dto.AgenciaRequest;
import net.mayorista.erp.maestros.agencia.dto.AgenciaResponse;
import net.mayorista.erp.maestros.agencia.service.AgenciaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maestros/agencias")
@RequiredArgsConstructor
public class AgenciaController {

    private final AgenciaService agenciaService;

    @GetMapping
    public ResponseEntity<List<AgenciaResponse>> listar() {
        return ResponseEntity.ok(agenciaService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<AgenciaResponse> crear(@Valid @RequestBody AgenciaRequest request) {
        return new ResponseEntity<>(agenciaService.crear(request), HttpStatus.CREATED);
    }
}