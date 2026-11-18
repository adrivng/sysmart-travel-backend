package net.mayorista.erp.ventas.cotizacion.model;

import jakarta.persistence.*;
import lombok.*;
import net.mayorista.erp.maestros.agencia.model.Agencia;
import net.mayorista.erp.productos.paquete.model.Paquete;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cotizaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cotizacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String codigo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agencia_id", nullable = false)
    private Agencia agencia;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "paquete_id", nullable = false)
    private Paquete paquete;

    @Column(name = "cantidad_pasajeros", nullable = false)
    private Integer cantidadPasajeros;

    @Column(name = "fecha_viaje", nullable = false)
    private LocalDate fechaViaje;

    @Column(nullable = false)
    private BigDecimal subtotal;

    @Column(nullable = false)
    private BigDecimal igv;

    @Column(nullable = false)
    private BigDecimal total;

    private String estado;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
}