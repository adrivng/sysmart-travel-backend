package net.mayorista.erp.ventas.cotizacion.service;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.maestros.agencia.model.Agencia;
import net.mayorista.erp.maestros.agencia.repository.AgenciaRepository;
import net.mayorista.erp.productos.paquete.model.Paquete;
import net.mayorista.erp.productos.paquete.repository.PaqueteRepository;
import net.mayorista.erp.ventas.cotizacion.dto.CotizacionRequest;
import net.mayorista.erp.ventas.cotizacion.dto.CotizacionResponse;
import net.mayorista.erp.ventas.cotizacion.model.Cotizacion;
import net.mayorista.erp.ventas.cotizacion.repository.CotizacionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CotizacionService {

    private final CotizacionRepository cotizacionRepository;
    private final AgenciaRepository agenciaRepository;
    private final PaqueteRepository paqueteRepository;

    public List<CotizacionResponse> listarTodas() {
        return cotizacionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CotizacionResponse crear(CotizacionRequest request) {
        Agencia agencia = agenciaRepository.findById(request.getAgenciaId())
                .orElseThrow(() -> new RuntimeException("Agencia no encontrada"));

        Paquete paquete = paqueteRepository.findById(request.getPaqueteId())
                .orElseThrow(() -> new RuntimeException("Paquete no encontrado"));

        BigDecimal precioUnitario = paquete.getPrecioSoles();
        BigDecimal cantidad = new BigDecimal(request.getCantidadPasajeros());

        BigDecimal subtotal = precioUnitario.multiply(cantidad);
        BigDecimal igv = subtotal.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(igv);

        String codigo = "COT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Cotizacion cotizacion = Cotizacion.builder()
                .codigo(codigo)
                .agencia(agencia)
                .paquete(paquete)
                .cantidadPasajeros(request.getCantidadPasajeros())
                .fechaViaje(request.getFechaViaje())
                .subtotal(subtotal)
                .igv(igv)
                .total(total)
                .estado("PENDIENTE")
                .fechaCreacion(LocalDateTime.now())
                .build();

        return mapToResponse(cotizacionRepository.save(cotizacion));
    }

    private CotizacionResponse mapToResponse(Cotizacion cotizacion) {
        return CotizacionResponse.builder()
                .id(cotizacion.getId())
                .codigo(cotizacion.getCodigo())
                .agenciaNombre(cotizacion.getAgencia().getRazonSocial())
                .paqueteNombre(cotizacion.getPaquete().getNombre())
                .cantidadPasajeros(cotizacion.getCantidadPasajeros())
                .fechaViaje(cotizacion.getFechaViaje())
                .subtotal(cotizacion.getSubtotal())
                .igv(cotizacion.getIgv())
                .total(cotizacion.getTotal())
                .estado(cotizacion.getEstado())
                .fechaCreacion(cotizacion.getFechaCreacion())
                .build();
    }
}