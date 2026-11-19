package net.mayorista.erp.maestros.promocion.repository;

import net.mayorista.erp.maestros.promocion.model.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Long> {
}