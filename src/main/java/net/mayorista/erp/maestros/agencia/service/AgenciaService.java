package net.mayorista.erp.maestros.agencia.service;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.agencia.dto.AgenciaRequest;
import net.mayorista.erp.maestros.agencia.dto.AgenciaResponse;
import net.mayorista.erp.maestros.agencia.model.Agencia;
import net.mayorista.erp.maestros.agencia.repository.AgenciaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgenciaService {

    private final AgenciaRepository agenciaRepository;

    public List<AgenciaResponse> listarTodas() {
        return agenciaRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AgenciaResponse crear(AgenciaRequest request) {
        if (agenciaRepository.findByRuc(request.getRuc()).isPresent()) {
            throw new RuntimeException("Ya existe una agencia con ese RUC");
        }

        Agencia agencia = Agencia.builder()
                .ruc(request.getRuc())
                .razonSocial(request.getRazonSocial())
                .direccion(request.getDireccion())
                .telefono(request.getTelefono())
                .email(request.getEmail())
                .lineaCredito(request.getLineaCredito() != null ? request.getLineaCredito() : BigDecimal.ZERO)
                .diasCredito(request.getDiasCredito() != null ? request.getDiasCredito() : 0)
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .build();

        return mapToResponse(agenciaRepository.save(agencia));
    }

    private AgenciaResponse mapToResponse(Agencia agencia) {
        return AgenciaResponse.builder()
                .id(agencia.getId())
                .ruc(agencia.getRuc())
                .razonSocial(agencia.getRazonSocial())
                .direccion(agencia.getDireccion())
                .telefono(agencia.getTelefono())
                .email(agencia.getEmail())
                .lineaCredito(agencia.getLineaCredito())
                .diasCredito(agencia.getDiasCredito())
                .estado(agencia.getEstado())
                .build();
    }
}