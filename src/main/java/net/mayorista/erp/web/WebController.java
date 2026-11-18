package net.mayorista.erp.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Rutas de la interfaz React.
 * Spring Boot devuelve el index.html y React Router maneja la navegacion.
 */
@Controller
public class WebController {

    @GetMapping({"/login", "/usuarios", "/maestros"})
    public String interfaz() {
        return "forward:/index.html";
    }
}
