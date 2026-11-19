package net.mayorista.erp.maestros.promocion.service;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.promocion.dto.PhpPromocionDto;
import net.mayorista.erp.maestros.promocion.model.Promocion;
import net.mayorista.erp.maestros.promocion.repository.PromocionRepository;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromocionService {

    private final PromocionRepository promocionRepository;
    private final RestClient restClient = RestClient.create();

    public String migrarDesdePhp() {
        // 1. Consumimos tu API PHP
        String url = "https://programas-aut.vidatur.net/admin/api_promociones.php";

        Map response = restClient.get()
                .uri(url)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(Map.class);

        if (response == null || !response.containsKey("data")) {
            return "Error: No se recibieron datos del PHP.";
        }

        // 2. Convertimos el JSON a nuestra lista de DTOs
        List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");

        List<Promocion> listaParaGuardar = data.stream().map(map -> {
            Promocion p = new Promocion();
            p.setId(Long.valueOf(map.get("id").toString()));
            p.setTitulo((String) map.get("titulo"));
            p.setSubtitulo((String) map.get("subtitulo"));
            p.setDuracion((String) map.get("duracion"));
            p.setMoneda((String) map.get("moneda"));
            p.setAerolinea((String) map.get("aerolinea"));
            p.setTipoPrograma((String) map.get("tipo_programa"));
            p.setPlantilla((String) map.get("plantilla"));
            p.setPalabraClave((String) map.get("palabra_clave"));
            p.setImagenPr((String) map.get("imagen_pr"));
            p.setActivo(true);

            if (map.get("precio") != null) {
                p.setPrecio(new java.math.BigDecimal(map.get("precio").toString()));
            }
            return p;
        }).collect(Collectors.toList());

        // 3. Guardamos en PostgreSQL (Neon)
        promocionRepository.saveAll(listaParaGuardar);
        return "¡Éxito! Se migraron " + listaParaGuardar.size() + " promociones a PostgreSQL.";
    }
}