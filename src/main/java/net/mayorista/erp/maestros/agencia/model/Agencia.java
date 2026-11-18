package net.mayorista.erp.maestros.agencia.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "agencias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 11)
    private String ruc;

    @Column(name = "razon_social", nullable = false, length = 200)
    private String razonSocial;

    private String direccion;
    private String telefono;
    private String email;

    @Column(name = "linea_credito")
    private BigDecimal lineaCredito;

    @Column(name = "dias_credito")
    private Integer diasCredito;

    private Boolean estado;
}