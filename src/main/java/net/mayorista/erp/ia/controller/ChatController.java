package net.mayorista.erp.ia.controller;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.ia.dto.ChatRequest;
import net.mayorista.erp.ia.dto.ChatResponse;
import net.mayorista.erp.ia.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ia")
@RequiredArgsConstructor
public class ChatController {

    private final GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String respuesta = geminiService.preguntar(request.getPregunta());
        return ResponseEntity.ok(new ChatResponse(respuesta));
    }
}