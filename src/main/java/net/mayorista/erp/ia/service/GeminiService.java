package net.mayorista.erp.ia.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import net.mayorista.erp.productos.paquete.model.Paquete;
import net.mayorista.erp.productos.paquete.repository.PaqueteRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    private final PaqueteRepository paqueteRepository;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestClient restClient = RestClient.create();
    private final ObjectMapper mapper = new ObjectMapper();

    public String preguntar(String pregunta) {

        List<Paquete> paquetes = paqueteRepository.findAll();
        StringBuilder contexto = new StringBuilder("Estos son los paquetes disponibles en la agencia:\n");

        for (Paquete p : paquetes) {
            contexto.append("- Paquete: ").append(p.getNombre())
                    .append(", Destino: ").append(p.getDestino().getNombre())
                    .append(", Días: ").append(p.getDias())
                    .append(", Precio Soles: ").append(p.getPrecioSoles())
                    .append(", Incluye: ").append(p.getIncluye()).append("\n");
        }


        String promptFinal = "Eres un agente de viajes de SysMart. Usa esta información real de la base de datos para responder al cliente:\n"
                + contexto.toString()
                + "\nPregunta del cliente: " + pregunta;

        try {
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", promptFinal)
                            ))
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
            return "Error: " + e.getMessage();
        }
    }
}