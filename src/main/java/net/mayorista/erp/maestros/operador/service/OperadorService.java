package net.mayorista.erp.maestros.operador.service;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.operador.dto.OperadorRequest;
import net.mayorista.erp.maestros.operador.dto.OperadorResponse;
import net.mayorista.erp.maestros.operador.model.Operador;
import net.mayorista.erp.maestros.operador.repository.OperadorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OperadorService {

    private final OperadorRepository operadorRepository;

    public List<OperadorResponse> listarTodos() {
        return operadorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OperadorResponse crear(OperadorRequest request) {
        if (operadorRepository.findByRuc(request.getRuc()).isPresent()) {
            throw new RuntimeException("Ya existe un operador con ese RUC");
        }

        Operador operador = Operador.builder()
                .ruc(request.getRuc())
                .razonSocial(request.getRazonSocial())
                .tipoOperador(request.getTipoOperador().toUpperCase())
                .contacto(request.getContacto())
                .telefono(request.getTelefono())
                .email(request.getEmail())
                .direccion(request.getDireccion())
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .build();

        return mapToResponse(operadorRepository.save(operador));
    }

    private OperadorResponse mapToResponse(Operador operador) {
        return OperadorResponse.builder()
                .id(operador.getId())
                .ruc(operador.getRuc())
                .razonSocial(operador.getRazonSocial())
                .tipoOperador(operador.getTipoOperador())
                .contacto(operador.getContacto())
                .telefono(operador.getTelefono())
                .email(operador.getEmail())
                .direccion(operador.getDireccion())
                .estado(operador.getEstado())
                .build();
    }
}