package net.mayorista.erp.ia.controller;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.ia.dto.ChatRequest;
import net.mayorista.erp.ia.service.VectorSqlService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ia/vectores")
@RequiredArgsConstructor
public class VectorController {

    private final VectorSqlService vectorSqlService;

    @PostMapping("/indexar")
    public ResponseEntity<String> indexar() {
        return ResponseEntity.ok(vectorSqlService.indexarPromociones());
    }

    @PostMapping("/buscar")
    public ResponseEntity<String> buscar(@RequestBody ChatRequest request) {
        return ResponseEntity.ok(vectorSqlService.buscarContexto(request.getPregunta()));
    }
}
