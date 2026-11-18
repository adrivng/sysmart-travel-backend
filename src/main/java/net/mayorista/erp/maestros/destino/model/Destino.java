package net.mayorista.erp.maestros.destino.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "destinos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destino {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String pais;

    @Column(name = "codigo_iata", length = 3)
    private String codigoIata;

    private Boolean estado;
}