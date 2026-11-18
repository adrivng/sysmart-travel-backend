package net.mayorista.erp.maestros.moneda.service;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.moneda.dto.MonedaRequest;
import net.mayorista.erp.maestros.moneda.dto.MonedaResponse;
import net.mayorista.erp.maestros.moneda.model.Moneda;
import net.mayorista.erp.maestros.moneda.repository.MonedaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MonedaService {

    private final MonedaRepository monedaRepository;

    public List<MonedaResponse> listarTodas() {
        return monedaRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MonedaResponse crear(MonedaRequest request) {
        Moneda moneda = Moneda.builder()
                .codigo(request.getCodigo().toUpperCase())
                .nombre(request.getNombre())
                .simbolo(request.getSimbolo())
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .build();
        return mapToResponse(monedaRepository.save(moneda));
    }

    private MonedaResponse mapToResponse(Moneda moneda) {
        return MonedaResponse.builder()
                .id(moneda.getId())
                .codigo(moneda.getCodigo())
                .nombre(moneda.getNombre())
                .simbolo(moneda.getSimbolo())
                .estado(moneda.getEstado())
                .build();
    }
}