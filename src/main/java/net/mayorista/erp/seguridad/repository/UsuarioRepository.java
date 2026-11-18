package net.mayorista.erp.seguridad.repository;

import net.mayorista.erp.seguridad.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Spring Data JPA crea la consulta SQL automáticamente con este nombre
    Optional<Usuario> findByUsername(String username);
}