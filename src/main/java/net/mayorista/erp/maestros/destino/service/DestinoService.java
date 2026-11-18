package net.mayorista.erp.maestros.destino.service;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.destino.dto.DestinoRequest;
import net.mayorista.erp.maestros.destino.dto.DestinoResponse;
import net.mayorista.erp.maestros.destino.model.Destino;
import net.mayorista.erp.maestros.destino.repository.DestinoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DestinoService {

    private final DestinoRepository destinoRepository;

    public List<DestinoResponse> listarTodos() {
        return destinoRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DestinoResponse crear(DestinoRequest request) {
        Destino destino = Destino.builder()
                .nombre(request.getNombre())
                .pais(request.getPais())
                .codigoIata(request.getCodigoIata() != null ? request.getCodigoIata().toUpperCase() : null)
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .build();

        return mapToResponse(destinoRepository.save(destino));
    }

    private DestinoResponse mapToResponse(Destino destino) {
        return DestinoResponse.builder()
                .id(destino.getId())
                .nombre(destino.getNombre())
                .pais(destino.getPais())
                .codigoIata(destino.getCodigoIata())
                .estado(destino.getEstado())
                .build();
    }
}