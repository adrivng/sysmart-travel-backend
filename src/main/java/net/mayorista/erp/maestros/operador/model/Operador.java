package net.mayorista.erp.maestros.operador.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "operadores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Operador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 11)
    private String ruc;

    @Column(name = "razon_social", nullable = false, length = 200)
    private String razonSocial;

    @Column(name = "tipo_operador", nullable = false, length = 50)
    private String tipoOperador;

    private String contacto;
    private String telefono;
    private String email;
    private String direccion;

    private Boolean estado;
}