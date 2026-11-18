package net.mayorista.erp.seguridad.service;

import lombok.RequiredArgsConstructor;
import net.mayorista.erp.seguridad.dto.LoginRequest;
import net.mayorista.erp.seguridad.dto.LoginResponse;
import net.mayorista.erp.seguridad.dto.RegisterRequest;
import net.mayorista.erp.seguridad.model.Rol;
import net.mayorista.erp.seguridad.model.Usuario;
import net.mayorista.erp.seguridad.repository.RolRepository;
import net.mayorista.erp.seguridad.repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    public String registrar(RegisterRequest request) {

        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }


        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());

        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setNombres(request.getNombres());
        usuario.setApellidos(request.getApellidos());
        usuario.setEmail(request.getEmail());
        usuario.setEstado(true);


        Rol rolAdmin = rolRepository.findByNombre("ADMIN")
                .orElseGet(() -> {
                    Rol nuevoRol = new Rol();
                    nuevoRol.setNombre("ADMIN");
                    return rolRepository.save(nuevoRol);
                });
        usuario.setRoles(Set.of(rolAdmin));

        usuarioRepository.save(usuario);
        return "Usuario registrado exitosamente";
    }


    public LoginResponse login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Usuario usuario = (Usuario) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(usuario);

        return LoginResponse.builder()
                .token(jwtToken)
                .username(usuario.getUsername())
                .nombres(usuario.getNombres())
                .roles(usuario.getRoles().stream().map(Rol::getNombre).collect(Collectors.toList()))
                .build();
    }
}