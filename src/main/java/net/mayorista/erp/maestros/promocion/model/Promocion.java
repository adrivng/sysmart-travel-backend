package net.mayorista.erp.maestros.promocion.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "promociones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promocion {
    @Id
    private Long id; // Usamos el mismo ID del PHP para no duplicar

    private String titulo;
    private String subtitulo;
    private String duracion;
    private BigDecimal precio;
    private String moneda;
    private String aerolinea;
    private String tipoPrograma;
    private String plantilla;
    private String palabraClave;
    private String imagenPr;
    private Boolean activo;
}