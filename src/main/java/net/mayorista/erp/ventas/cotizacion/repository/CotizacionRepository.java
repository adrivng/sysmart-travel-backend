package net.mayorista.erp.ventas.cotizacion.repository;

import net.mayorista.erp.ventas.cotizacion.model.Cotizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CotizacionRepository extends JpaRepository<Cotizacion, Long> {
}