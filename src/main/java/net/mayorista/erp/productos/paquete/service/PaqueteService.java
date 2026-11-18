package net.mayorista.erp.productos.paquete.service;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.destino.model.Destino;
import net.mayorista.erp.maestros.destino.repository.DestinoRepository;
import net.mayorista.erp.productos.paquete.dto.PaqueteRequest;
import net.mayorista.erp.productos.paquete.dto.PaqueteResponse;
import net.mayorista.erp.productos.paquete.model.Paquete;
import net.mayorista.erp.productos.paquete.repository.PaqueteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaqueteService {

    private final PaqueteRepository paqueteRepository;
    private final DestinoRepository destinoRepository;

    public List<PaqueteResponse> listarTodos() {
        return paqueteRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PaqueteResponse crear(PaqueteRequest request) {
        Destino destino = destinoRepository.findById(request.getDestinoId())
                .orElseThrow(() -> new RuntimeException("Destino no encontrado"));

        Paquete paquete = Paquete.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .destino(destino)
                .dias(request.getDias())
                .noches(request.getNoches())
                .precioSoles(request.getPrecioSoles())
                .precioDolares(request.getPrecioDolares())
                .precioEuros(request.getPrecioEuros())
                .incluye(request.getIncluye())
                .noIncluye(request.getNoIncluye())
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .build();

        return mapToResponse(paqueteRepository.save(paquete));
    }

    private PaqueteResponse mapToResponse(Paquete paquete) {
        return PaqueteResponse.builder()
                .id(paquete.getId())
                .nombre(paquete.getNombre())
                .descripcion(paquete.getDescripcion())
                .destinoId(paquete.getDestino().getId())
                .destinoNombre(paquete.getDestino().getNombre())
                .destinoPais(paquete.getDestino().getPais())
                .dias(paquete.getDias())
                .noches(paquete.getNoches())
                .precioSoles(paquete.getPrecioSoles())
                .precioDolares(paquete.getPrecioDolares())
                .precioEuros(paquete.getPrecioEuros())
                .incluye(paquete.getIncluye())
                .noIncluye(paquete.getNoIncluye())
                .estado(paquete.getEstado())
                .build();
    }
}