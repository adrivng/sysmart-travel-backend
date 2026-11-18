package net.mayorista.erp.maestros.operador.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.operador.dto.OperadorRequest;
import net.mayorista.erp.maestros.operador.dto.OperadorResponse;
import net.mayorista.erp.maestros.operador.service.OperadorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maestros/operadores")
@RequiredArgsConstructor
public class OperadorController {

    private final OperadorService operadorService;

    @GetMapping
    public ResponseEntity<List<OperadorResponse>> listar() {
        return ResponseEntity.ok(operadorService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<OperadorResponse> crear(@Valid @RequestBody OperadorRequest request) {
        return new ResponseEntity<>(operadorService.crear(request), HttpStatus.CREATED);
    }
}