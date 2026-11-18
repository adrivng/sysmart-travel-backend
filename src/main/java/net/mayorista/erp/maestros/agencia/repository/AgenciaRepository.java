package net.mayorista.erp.maestros.agencia.repository;

import net.mayorista.erp.maestros.agencia.model.Agencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AgenciaRepository extends JpaRepository<Agencia, Long> {
    Optional<Agencia> findByRuc(String ruc);
}