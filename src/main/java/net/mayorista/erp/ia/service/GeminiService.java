package net.mayorista.erp.ia.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    private final VectorSqlService vectorSqlService;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestClient restClient = RestClient.create();
    private final ObjectMapper mapper = new ObjectMapper();

    public String preguntar(String pregunta) {
        try {
            String promptFinal = construirPrompt(pregunta);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", promptFinal)))
                    )
            );

            String response = restClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            JsonNode root = mapper.readTree(response);
            return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        } catch (Exception e) {
            return "No se pudo generar la respuesta: " + e.getMessage();
        }
    }

    private String construirPrompt(String pregunta) {
        String contextoRecuperado = vectorSqlService.buscarContexto(pregunta);

        StringBuilder contexto = new StringBuilder(
                "Eres un asistente de viajes de SysMart. Responde de forma clara, útil y basándote solo en la información proporcionada.\n\n");
        contexto.append("INFORMACIÓN RELEVANTE (recuperada por similitud vectorial):\n");

        if (contextoRecuperado == null || contextoRecuperado.isBlank()) {
            contexto.append("No hay información indexada en este momento.\n");
        } else {
            contexto.append(contextoRecuperado).append("\n");
        }

        return contexto
                + "\nPregunta del cliente: " + pregunta
                + "\nSi la información no está en el contexto, indícalo claramente en lugar de inventar datos.";
    }
}
