package net.mayorista.erp.maestros.moneda.repository;

import net.mayorista.erp.maestros.moneda.model.Moneda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonedaRepository extends JpaRepository<Moneda, Long> {
}