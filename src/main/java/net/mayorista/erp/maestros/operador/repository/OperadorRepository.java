package net.mayorista.erp.maestros.operador.repository;

import net.mayorista.erp.maestros.operador.model.Operador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OperadorRepository extends JpaRepository<Operador, Long> {
    Optional<Operador> findByRuc(String ruc);
}