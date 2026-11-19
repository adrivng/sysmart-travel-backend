package net.mayorista.erp.ia.service;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.promocion.model.Promocion;
import net.mayorista.erp.maestros.promocion.repository.PromocionRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VectorSqlService {

    private static final int DIMENSION = 768;
    private static final int LIMITE_RESULTADOS = 3;

    private final JdbcTemplate jdbcTemplate;
    private final EmbeddingService embeddingService;
    private final PromocionRepository promocionRepository;

    @Transactional
    public String indexarPromociones() {
        List<Promocion> promociones = promocionRepository.findAll();
        List<VectorPromocion> filas = new ArrayList<>();

        for (Promocion promocion : promociones) {
            String contenido = construirContenido(promocion);
            float[] embedding = embeddingService.getEmbedding(contenido);
            validarDimension(embedding);
            filas.add(new VectorPromocion(contenido, Arrays.toString(embedding)));
        }

        jdbcTemplate.execute("TRUNCATE TABLE vector_store");
        if (!filas.isEmpty()) {
            jdbcTemplate.batchUpdate(
                    "INSERT INTO vector_store (content, embedding) VALUES (?, ?::vector)",
                    filas,
                    filas.size(),
                    (statement, fila) -> {
                        statement.setString(1, fila.contenido());
                        statement.setString(2, fila.vector());
                    }
            );
        }

        return "Se indexaron " + filas.size() + " promociones.";
    }

    public String buscarContexto(String pregunta) {
        float[] embedding = embeddingService.getEmbedding(pregunta);
        validarDimension(embedding);

        List<String> resultados = jdbcTemplate.queryForList(
                "SELECT content FROM vector_store ORDER BY embedding <-> ?::vector LIMIT " + LIMITE_RESULTADOS,
                String.class,
                Arrays.toString(embedding)
        );

        return String.join("\n---\n", resultados);
    }

    private String construirContenido(Promocion promocion) {
        return "Promoción: " + promocion.getTitulo()
                + ". Duración: " + promocion.getDuracion()
                + ". Precio: " + promocion.getPrecio() + " " + promocion.getMoneda()
                + ". Aerolínea: " + promocion.getAerolinea();
    }

    private void validarDimension(float[] embedding) {
        if (embedding.length != DIMENSION) {
            throw new IllegalStateException(
                    "El embedding tiene " + embedding.length + " dimensiones, se esperaban " + DIMENSION);
        }
    }

    private record VectorPromocion(String contenido, String vector) {
    }
}
