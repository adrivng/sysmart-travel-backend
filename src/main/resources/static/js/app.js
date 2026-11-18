    // ---------------------------------------------------------
// Panel del ERP: lista, crea, edita y elimina usuarios
// ---------------------------------------------------------

const token = localStorage.getItem("erp_token");

if (!token) {
    window.location.href = "/index.html";
}

const tabla = document.getElementById("tabla-usuarios");
const form = document.getElementById("form-usuario");
const formMensaje = document.getElementById("form-mensaje");
const btnNuevo = document.getElementById("btn-nuevo");
const btnCancelar = document.getElementById("btn-cancelar");
const statUsuarios = document.getElementById("stat-usuarios");

function cerrarSesion() {
    localStorage.removeItem("erp_token");
    localStorage.removeItem("erp_usuario");
    window.location.href = "/index.html";
}

document.getElementById("btn-logout").addEventListener("click", cerrarSesion);

// Petición a la API con el token JWT
async function api(ruta, opciones = {}) {
    const respuesta = await fetch("/api" + ruta, {
        ...opciones,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            ...(opciones.headers || {})
        }
    });

    if (respuesta.status === 401) {
        cerrarSesion();
        return null;
    }

    if (respuesta.status === 204) {
        return null;
    }

    const datos = await respuesta.json().catch(() => null);
    if (!respuesta.ok) {
        const detalle = datos && datos.campos
            ? Object.values(datos.campos).join(" / ")
            : null;
        throw new Error(detalle || (datos && datos.mensaje) || "Error en la solicitud");
    }
    return datos;
}

function escapar(texto) {
    return String(texto ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function pintarUsuario(usuario) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${usuario.id}</td>
        <td><strong>${escapar(usuario.username)}</strong></td>
        <td>${escapar(usuario.nombre)} ${escapar(usuario.apellido)}</td>
        <td>${escapar(usuario.email)}</td>
        <td>${escapar(usuario.rol)}</td>
        <td>
            <span class="badge ${usuario.estado ? "badge-activo" : "badge-inactivo"}">
                ${usuario.estado ? "Activo" : "Inactivo"}
            </span>
        </td>
        <td>
            <div class="acciones-tabla">
                <button type="button" data-editar="${usuario.id}">Editar</button>
                <button type="button" class="peligro" data-eliminar="${usuario.id}">Eliminar</button>
            </div>
        </td>
    `;
    return fila;
}

async function cargarUsuarios() {
    try {
        const usuarios = await api("/usuarios");
        if (!usuarios) return;

        tabla.innerHTML = "";
        if (usuarios.length === 0) {
            tabla.innerHTML = '<tr><td colspan="7" class="muted">No hay usuarios registrados.</td></tr>';
        } else {
            usuarios.forEach((usuario) => tabla.appendChild(pintarUsuario(usuario)));
        }

        statUsuarios.textContent = usuarios.length;
        window.usuariosCargados = usuarios;
    } catch (error) {
        tabla.innerHTML = `<tr><td colspan="7" class="mensaje">${escapar(error.message)}</td></tr>`;
    }
}

function mostrarFormulario(usuario) {
    form.classList.remove("oculto");
    formMensaje.textContent = "";
    formMensaje.classList.remove("ok");

    document.getElementById("usuario-id").value = usuario ? usuario.id : "";
    document.getElementById("f-username").value = usuario ? usuario.username : "";
    document.getElementById("f-password").value = "";
    document.getElementById("f-nombre").value = usuario ? usuario.nombre : "";
    document.getElementById("f-apellido").value = usuario ? usuario.apellido : "";
    document.getElementById("f-email").value = usuario ? usuario.email : "";
    document.getElementById("f-celular").value = usuario ? (usuario.celular || "") : "";
    document.getElementById("f-cargo").value = usuario ? (usuario.cargo || "") : "";
    document.getElementById("f-rol").value = usuario ? usuario.rol : "VENDEDOR";
    document.getElementById("f-estado").checked = usuario ? usuario.estado : true;

    document.getElementById("f-username").focus();
}

btnNuevo.addEventListener("click", () => mostrarFormulario(null));

btnCancelar.addEventListener("click", () => {
    form.classList.add("oculto");
});

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    formMensaje.textContent = "";

    const id = document.getElementById("usuario-id").value;

    const cuerpo = {
        username: document.getElementById("f-username").value.trim(),
        password: document.getElementById("f-password").value,
        nombre: document.getElementById("f-nombre").value.trim(),
        apellido: document.getElementById("f-apellido").value.trim(),
        email: document.getElementById("f-email").value.trim(),
        celular: document.getElementById("f-celular").value.trim(),
        cargo: document.getElementById("f-cargo").value.trim(),
        rol: document.getElementById("f-rol").value,
        estado: document.getElementById("f-estado").checked
    };

    try {
        if (id) {
            await api("/usuarios/" + id, { method: "PUT", body: JSON.stringify(cuerpo) });
        } else {
            await api("/usuarios", { method: "POST", body: JSON.stringify(cuerpo) });
        }

        form.classList.add("oculto");
        await cargarUsuarios();
    } catch (error) {
        formMensaje.textContent = error.message;
    }
});

tabla.addEventListener("click", async (evento) => {
    const botonEditar = evento.target.closest("[data-editar]");
    const botonEliminar = evento.target.closest("[data-eliminar]");

    if (botonEditar) {
        const usuario = (window.usuariosCargados || [])
            .find((u) => u.id === Number(botonEditar.dataset.editar));
        if (usuario) mostrarFormulario(usuario);
    }

    if (botonEliminar) {
        const id = Number(botonEliminar.dataset.eliminar);
        const usuario = (window.usuariosCargados || []).find((u) => u.id === id);
        const nombre = usuario ? usuario.username : "este usuario";

        if (!confirm(`¿Eliminar a "${nombre}"?`)) {
            return;
        }

        try {
            await api("/usuarios/" + id, { method: "DELETE" });
            await cargarUsuarios();
        } catch (error) {
            alert(error.message);
        }
    }
});

// Mostrar el usuario autenticado
(async function mostrarSesion() {
    try {
        const usuario = await api("/auth/me");
        if (usuario) {
            document.getElementById("usuario-info").textContent =
                `${usuario.nombre} ${usuario.apellido} · ${usuario.rol}`;
        }
    } catch (error) {
        // Si falla, el login sigue siendo válido; no bloqueamos el panel.
    }
})();

cargarUsuarios();
