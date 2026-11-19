package net.mayorista.erp.ia.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class EmbeddingService {

    private static final String EMBEDDING_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=";

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();
    private final ObjectMapper mapper = new ObjectMapper();

    public float[] getEmbedding(String texto) {
        Map<String, Object> body = Map.of(
                "model", "models/text-embedding-004",
                "content", Map.of("parts", List.of(Map.of("text", texto)))
        );

        try {
            String response = restClient.post()
                    .uri(EMBEDDING_URL + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            JsonNode values = mapper.readTree(response).path("embedding").path("values");
            if (values.isEmpty()) {
                throw new IllegalStateException("Gemini no devolvió valores de embedding");
            }

            float[] vector = new float[values.size()];
            for (int i = 0; i < values.size(); i++) {
                vector[i] = (float) values.get(i).asDouble();
            }
            return vector;

        } catch (Exception e) {
            throw new IllegalStateException("Error obteniendo embedding desde Gemini: " + e.getMessage(), e);
        }
    }
}
