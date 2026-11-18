package net.mayorista.erp.maestros.destino.repository;

import net.mayorista.erp.maestros.destino.model.Destino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinoRepository extends JpaRepository<Destino, Long> {
    // Búsqueda por país (útil para filtros)
    List<Destino> findByPaisContainingIgnoreCase(String pais);
}