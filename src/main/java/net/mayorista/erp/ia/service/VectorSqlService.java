package net.mayorista.erp.ia.service;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.promocion.model.Promocion;
import net.mayorista.erp.maestros.promocion.repository.PromocionRepository;
import net.mayorista.erp.productos.paquete.model.Paquete;
import net.mayorista.erp.productos.paquete.repository.PaqueteRepository;
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
    private final PaqueteRepository paqueteRepository;

    public String indexarContenido() {
        List<DocumentoVector> documentos = recopilarDocumentos();

        List<float[]> embeddings = embeddingService.getEmbeddings(
                documentos.stream().map(DocumentoVector::contenido).toList());
        validarEmbeddings(embeddings, documentos.size());

        List<VectorRegistro> filas = new ArrayList<>(documentos.size());
        for (int i = 0; i < documentos.size(); i++) {
            filas.add(new VectorRegistro(documentos.get(i).contenido(), Arrays.toString(embeddings.get(i))));
        }

        reemplazarIndice(filas);

        long promociones = documentos.stream().filter(d -> "PROMOCION".equals(d.tipo())).count();
        long paquetes = documentos.size() - promociones;
        return "Se indexaron " + documentos.size() + " documentos (" + promociones + " promociones, " + paquetes + " paquetes).";
    }

    public String buscarContexto(String pregunta) {
        if (pregunta == null || pregunta.isBlank()) {
            return "";
        }

        float[] embedding = embeddingService.getEmbedding(pregunta);
        validarDimension(embedding);

        List<String> resultados = jdbcTemplate.queryForList(
                "SELECT content FROM vector_store ORDER BY embedding <-> ?::vector LIMIT " + LIMITE_RESULTADOS,
                String.class,
                Arrays.toString(embedding)
        );

        return String.join("\n---\n", resultados);
    }

    @Transactional
    protected void reemplazarIndice(List<VectorRegistro> filas) {
        jdbcTemplate.execute("TRUNCATE TABLE vector_store");
        if (filas.isEmpty()) {
            return;
        }
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

    private List<DocumentoVector> recopilarDocumentos() {
        List<DocumentoVector> documentos = new ArrayList<>();

        for (Promocion promocion : promocionRepository.findAll()) {
            documentos.add(new DocumentoVector("PROMOCION", construirContenido(promocion)));
        }
        for (Paquete paquete : paqueteRepository.findAll()) {
            documentos.add(new DocumentoVector("PAQUETE", construirContenido(paquete)));
        }

        return documentos;
    }

    private String construirContenido(Promocion promocion) {
        return "Promoción: " + valor(promocion.getTitulo())
                + ". Duración: " + valor(promocion.getDuracion())
                + ". Precio: " + valor(promocion.getPrecio()) + " " + valor(promocion.getMoneda())
                + ". Aerolínea: " + valor(promocion.getAerolinea())
                + ". Tipo: " + valor(promocion.getTipoPrograma());
    }

    private String construirContenido(Paquete paquete) {
        String destino = paquete.getDestino() != null ? paquete.getDestino().getNombre() : "No especificado";
        return "Paquete: " + valor(paquete.getNombre())
                + ". Destino: " + valor(destino)
                + ". Duración: " + valor(paquete.getDias()) + " días / " + valor(paquete.getNoches()) + " noches"
                + ". Precio: " + valor(paquete.getPrecioSoles()) + " PEN, "
                + valor(paquete.getPrecioDolares()) + " USD, "
                + valor(paquete.getPrecioEuros()) + " EUR"
                + ". Incluye: " + valor(paquete.getIncluye())
                + ". No incluye: " + valor(paquete.getNoIncluye());
    }

    private void validarEmbeddings(List<float[]> embeddings, int cantidadEsperada) {
        if (embeddings.size() != cantidadEsperada) {
            throw new IllegalStateException("La cantidad de embeddings generados no coincide con los documentos a indexar");
        }
        for (float[] embedding : embeddings) {
            validarDimension(embedding);
        }
    }

    private void validarDimension(float[] embedding) {
        if (embedding.length != DIMENSION) {
            throw new IllegalStateException(
                    "El embedding tiene " + embedding.length + " dimensiones, se esperaban " + DIMENSION);
        }
    }

    private String valor(Object valor) {
        return valor == null ? "No especificado" : String.valueOf(valor);
    }

    private record DocumentoVector(String tipo, String contenido) {
    }

    private record VectorRegistro(String contenido, String vector) {
    }
}
