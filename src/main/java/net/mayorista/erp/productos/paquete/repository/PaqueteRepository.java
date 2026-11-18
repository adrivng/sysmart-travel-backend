package net.mayorista.erp.productos.paquete.repository;

import net.mayorista.erp.productos.paquete.model.Paquete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaqueteRepository extends JpaRepository<Paquete, Long> {
    List<Paquete> findByDestinoId(Long destinoId);
}