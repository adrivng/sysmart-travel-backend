package net.mayorista.erp.seguridad.repository;

import net.mayorista.erp.seguridad.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
    // Esto es lo que usaremos en AuthService para buscar el rol ADMIN
    Optional<Rol> findByNombre(String nombre);
}