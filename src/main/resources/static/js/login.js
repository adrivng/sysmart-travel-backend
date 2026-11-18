const form = document.getElementById("login-form");
const mensaje = document.getElementById("mensaje");
const boton = document.getElementById("btn-login");

// Si ya hay una sesión guardada, ir directo al panel
if (localStorage.getItem("erp_token")) {
    window.location.href = "/app.html";
}

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensaje.textContent = "";
    mensaje.classList.remove("ok");
    boton.disabled = true;
    boton.textContent = "Ingresando...";

    try {
        const respuesta = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: document.getElementById("username").value.trim(),
                password: document.getElementById("password").value
            })
        });

        const datos = await respuesta.json().catch(() => null);

        if (!respuesta.ok) {
            throw new Error((datos && datos.mensaje) || "No se pudo iniciar sesión");
        }

        localStorage.setItem("erp_token", datos.token);
        localStorage.setItem("erp_usuario", JSON.stringify(datos));
        window.location.href = "/app.html";
    } catch (error) {
        mensaje.textContent = error.message;
    } finally {
        boton.disabled = false;
        boton.textContent = "Ingresar";
    }
});
