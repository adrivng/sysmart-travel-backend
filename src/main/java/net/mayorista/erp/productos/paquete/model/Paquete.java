package net.mayorista.erp.productos.paquete.model;

import jakarta.persistence.*;
import lombok.*;
import net.mayorista.erp.maestros.destino.model.Destino;
import java.math.BigDecimal;

@Entity
@Table(name = "paquetes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paquete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destino_id", nullable = false)
    private Destino destino;

    @Column(nullable = false)
    private Integer dias;

    @Column(nullable = false)
    private Integer noches;

    @Column(name = "precio_soles", nullable = false)
    private BigDecimal precioSoles;

    @Column(name = "precio_dolares", nullable = false)
    private BigDecimal precioDolares;

    @Column(name = "precio_euros", nullable = false)
    private BigDecimal precioEuros;

    @Column(columnDefinition = "TEXT")
    private String incluye;

    @Column(name = "no_incluye", columnDefinition = "TEXT")
    private String noIncluye;

    private Boolean estado;
}