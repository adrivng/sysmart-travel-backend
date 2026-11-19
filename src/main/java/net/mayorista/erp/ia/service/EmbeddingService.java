package net.mayorista.erp.ia.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EmbeddingService {

    private static final String MODEL = "models/gemini-embedding-001";
    private static final String EMBED_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=";
    private static final String BATCH_EMBED_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents?key=";
    private static final int OUTPUT_DIMENSIONALITY = 768;
    private static final int BATCH_SIZE = 50;
    private static final int MAX_RETRIES = 4;
    private static final long INITIAL_BACKOFF_MS = 35_000L;

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();
    private final ObjectMapper mapper = new ObjectMapper();

    public float[] getEmbedding(String texto) {
        List<float[]> resultados = getEmbeddings(List.of(texto));
        if (resultados.isEmpty()) {
            throw new IllegalStateException("Gemini no devolvió valores de embedding");
        }
        return resultados.get(0);
    }

    public List<float[]> getEmbeddings(List<String> textos) {
        if (textos == null || textos.isEmpty()) {
            return List.of();
        }

        List<float[]> todos = new ArrayList<>(textos.size());
        for (int i = 0; i < textos.size(); i += BATCH_SIZE) {
            int fin = Math.min(i + BATCH_SIZE, textos.size());
            List<String> lote = textos.subList(i, fin);
            todos.addAll(obtenerLote(lote));
        }
        return todos;
    }

    private List<float[]> obtenerLote(List<String> textos) {
        Map<String, Object> body = Map.of("requests", construirSolicitudes(textos));

        for (int intento = 1; intento <= MAX_RETRIES; intento++) {
            try {
                String response = restClient.post()
                        .uri(BATCH_EMBED_URL + apiKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(body)
                        .retrieve()
                        .body(String.class);

                return parsearEmbeddings(response, textos.size());
            } catch (RestClientResponseException e) {
                if (e.getStatusCode().value() == 429 && intento < MAX_RETRIES) {
                    esperar(INITIAL_BACKOFF_MS * intento);
                    continue;
                }
                throw new IllegalStateException(
                        "Error obteniendo embeddings desde Gemini: " + e.getStatusCode() + " " + e.getResponseBodyAsString(), e);
            } catch (Exception e) {
                if (intento < MAX_RETRIES) {
                    esperar(2_000L * intento);
                    continue;
                }
                throw new IllegalStateException("Error obteniendo embeddings desde Gemini: " + e.getMessage(), e);
            }
        }

        throw new IllegalStateException("No se pudieron obtener embeddings después de varios intentos");
    }

    private List<Map<String, Object>> construirSolicitudes(List<String> textos) {
        List<Map<String, Object>> solicitudes = new ArrayList<>(textos.size());
        for (String texto : textos) {
            solicitudes.add(Map.of(
                    "model", MODEL,
                    "content", Map.of("parts", List.of(Map.of("text", texto == null ? "" : texto))),
                    "outputDimensionality", OUTPUT_DIMENSIONALITY
            ));
        }
        return solicitudes;
    }

    private List<float[]> parsearEmbeddings(String response, int cantidadEsperada) {
        try {
            JsonNode embeddings = mapper.readTree(response).path("embeddings");
            if (!embeddings.isArray() || embeddings.size() != cantidadEsperada) {
                throw new IllegalStateException("Gemini devolvió una cantidad inesperada de embeddings");
            }

            List<float[]> resultado = new ArrayList<>(embeddings.size());
            for (JsonNode embeddingNode : embeddings) {
                JsonNode values = embeddingNode.path("values");
                if (values.isEmpty()) {
                    throw new IllegalStateException("Gemini no devolvió valores de embedding");
                }
                float[] vector = new float[values.size()];
                for (int i = 0; i < values.size(); i++) {
                    vector[i] = (float) values.get(i).asDouble();
                }
                resultado.add(vector);
            }
            return resultado;
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException("Error procesando la respuesta de embeddings de Gemini", e);
        }
    }

    private void esperar(long milisegundos) {
        try {
            Thread.sleep(milisegundos);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("La generación de embeddings fue interrumpida", e);
        }
    }
}
