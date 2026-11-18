// ---------------------------------------------------------
// Maestros: operadores, hoteles y ubigeo
// ---------------------------------------------------------

const token = localStorage.getItem("erp_token");

if (!token) {
    window.location.href = "/index.html";
}

function cerrarSesion() {
    localStorage.removeItem("erp_token");
    localStorage.removeItem("erp_usuario");
    window.location.href = "/index.html";
}

document.getElementById("btn-logout").addEventListener("click", cerrarSesion);

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

// =========================================================
// OPERADORES
// =========================================================

const tablaOperadores = document.getElementById("tabla-operadores");
const formOperador = document.getElementById("form-operador");
const mensajeOperador = document.getElementById("operador-mensaje");
const buscarOperador = document.getElementById("buscar-operador");

let operadoresCargados = [];
let hotelesCargados = [];

async function cargarOperadores(texto = "") {
    try {
        const q = texto ? "?q=" + encodeURIComponent(texto) : "";
        const operadores = await api("/operadores" + q);
        if (!operadores) return;

        operadoresCargados = operadores;
        tablaOperadores.innerHTML = "";

        if (operadores.length === 0) {
            tablaOperadores.innerHTML = '<tr><td colspan="7" class="muted">No hay operadores registrados.</td></tr>';
            return;
        }

        operadores.forEach((operador) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${operador.id}</td>
                <td><strong>${escapar(operador.nombre)}</strong></td>
                <td>${escapar(operador.telefono)}</td>
                <td>${escapar(operador.correo)}</td>
                <td>${operador.mayorista ? "Mayorista" : "Minorista"}</td>
                <td>
                    <span class="badge ${operador.activo ? "badge-activo" : "badge-inactivo"}">
                        ${operador.activo ? "Activo" : "Inactivo"}
                    </span>
                </td>
                <td>
                    <div class="acciones-tabla">
                        <button type="button" data-editar-operador="${operador.id}">Editar</button>
                        <button type="button" class="peligro" data-eliminar-operador="${operador.id}">Eliminar</button>
                    </div>
                </td>
            `;
            tablaOperadores.appendChild(fila);
        });
    } catch (error) {
        tablaOperadores.innerHTML = `<tr><td colspan="7" class="mensaje">${escapar(error.message)}</td></tr>`;
    }
}

function mostrarFormOperador(operador) {
    formOperador.classList.remove("oculto");
    mensajeOperador.textContent = "";

    document.getElementById("operador-id").value = operador ? operador.id : "";
    document.getElementById("op-nombre").value = operador ? operador.nombre : "";
    document.getElementById("op-telefono").value = operador ? (operador.telefono || "") : "";
    document.getElementById("op-correo").value = operador ? (operador.correo || "") : "";
    document.getElementById("op-direccion").value = operador ? (operador.direccion || "") : "";
    document.getElementById("op-observacion").value = operador ? (operador.observacion || "") : "";
    document.getElementById("op-mayorista").checked = operador ? operador.mayorista : false;
    document.getElementById("op-activo").checked = operador ? operador.activo : true;

    document.getElementById("op-nombre").focus();
}

document.getElementById("btn-nuevo-operador").addEventListener("click", () => mostrarFormOperador(null));
document.getElementById("btn-cancelar-operador").addEventListener("click", () => formOperador.classList.add("oculto"));

formOperador.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensajeOperador.textContent = "";

    const id = document.getElementById("operador-id").value;
    const cuerpo = {
        nombre: document.getElementById("op-nombre").value.trim(),
        telefono: document.getElementById("op-telefono").value.trim(),
        correo: document.getElementById("op-correo").value.trim(),
        direccion: document.getElementById("op-direccion").value.trim(),
        observacion: document.getElementById("op-observacion").value.trim(),
        mayorista: document.getElementById("op-mayorista").checked,
        activo: document.getElementById("op-activo").checked
    };

    try {
        if (id) {
            await api("/operadores/" + id, { method: "PUT", body: JSON.stringify(cuerpo) });
        } else {
            await api("/operadores", { method: "POST", body: JSON.stringify(cuerpo) });
        }
        formOperador.classList.add("oculto");
        await cargarOperadores(buscarOperador.value);
        await cargarOpcionesOperador();
    } catch (error) {
        mensajeOperador.textContent = error.message;
    }
});

tablaOperadores.addEventListener("click", async (evento) => {
    const editar = evento.target.closest("[data-editar-operador]");
    const eliminar = evento.target.closest("[data-eliminar-operador]");

    if (editar) {
        const operador = operadoresCargados.find((o) => o.id === Number(editar.dataset.editarOperador));
        if (operador) mostrarFormOperador(operador);
    }

    if (eliminar) {
        const id = Number(eliminar.dataset.eliminarOperador);
        const operador = operadoresCargados.find((o) => o.id === id);
        const nombre = operador ? operador.nombre : "este operador";

        if (!confirm(`¿Eliminar a "${nombre}"?`)) return;

        try {
            await api("/operadores/" + id, { method: "DELETE" });
            await cargarOperadores(buscarOperador.value);
            await cargarOpcionesOperador();
        } catch (error) {
            alert(error.message);
        }
    }
});

let temporizadorOperador;
buscarOperador.addEventListener("input", () => {
    clearTimeout(temporizadorOperador);
    temporizadorOperador = setTimeout(() => cargarOperadores(buscarOperador.value), 300);
});

// =========================================================
// HOTELES
// =========================================================

const tablaHoteles = document.getElementById("tabla-hoteles");
const formHotel = document.getElementById("form-hotel");
const mensajeHotel = document.getElementById("hotel-mensaje");
const buscarHotel = document.getElementById("buscar-hotel");
const selectOperadorHotel = document.getElementById("ho-operador");

async function cargarOpcionesOperador() {
    try {
        const operadores = await api("/operadores");
        if (!operadores) return;

        selectOperadorHotel.innerHTML = '<option value="">Sin operador</option>';
        operadores.forEach((operador) => {
            const opcion = document.createElement("option");
            opcion.value = operador.id;
            opcion.textContent = operador.nombre;
            selectOperadorHotel.appendChild(opcion);
        });
    } catch (error) {
        // Si falla, el hotel se puede guardar sin operador.
    }
}

async function cargarHoteles(texto = "") {
    try {
        const q = texto ? "?q=" + encodeURIComponent(texto) : "";
        const hoteles = await api("/hoteles" + q);
        if (!hoteles) return;

        hotelesCargados = hoteles;
        tablaHoteles.innerHTML = "";

        if (hoteles.length === 0) {
            tablaHoteles.innerHTML = '<tr><td colspan="7" class="muted">No hay hoteles registrados.</td></tr>';
            return;
        }

        hoteles.forEach((hotel) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${hotel.id}</td>
                <td><strong>${escapar(hotel.nombre)}</strong></td>
                <td>${escapar(hotel.direccion)}</td>
                <td>${escapar(hotel.telefono)}</td>
                <td>${escapar(hotel.operadorNombre) || "-"}</td>
                <td>
                    <span class="badge ${hotel.activo ? "badge-activo" : "badge-inactivo"}">
                        ${hotel.activo ? "Activo" : "Inactivo"}
                    </span>
                </td>
                <td>
                    <div class="acciones-tabla">
                        <button type="button" data-editar-hotel="${hotel.id}">Editar</button>
                        <button type="button" class="peligro" data-eliminar-hotel="${hotel.id}">Eliminar</button>
                    </div>
                </td>
            `;
            tablaHoteles.appendChild(fila);
        });
    } catch (error) {
        tablaHoteles.innerHTML = `<tr><td colspan="7" class="mensaje">${escapar(error.message)}</td></tr>`;
    }
}

function mostrarFormHotel(hotel) {
    formHotel.classList.remove("oculto");
    mensajeHotel.textContent = "";

    document.getElementById("hotel-id").value = hotel ? hotel.id : "";
    document.getElementById("ho-nombre").value = hotel ? hotel.nombre : "";
    document.getElementById("ho-direccion").value = hotel ? (hotel.direccion || "") : "";
    document.getElementById("ho-telefono").value = hotel ? (hotel.telefono || "") : "";
    selectOperadorHotel.value = hotel && hotel.operadorId ? String(hotel.operadorId) : "";
    document.getElementById("ho-activo").checked = hotel ? hotel.activo : true;

    document.getElementById("ho-nombre").focus();
}

document.getElementById("btn-nuevo-hotel").addEventListener("click", () => mostrarFormHotel(null));
document.getElementById("btn-cancelar-hotel").addEventListener("click", () => formHotel.classList.add("oculto"));

formHotel.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensajeHotel.textContent = "";

    const id = document.getElementById("hotel-id").value;
    const operadorId = selectOperadorHotel.value;
    const cuerpo = {
        nombre: document.getElementById("ho-nombre").value.trim(),
        direccion: document.getElementById("ho-direccion").value.trim(),
        telefono: document.getElementById("ho-telefono").value.trim(),
        operadorId: operadorId ? Number(operadorId) : null,
        activo: document.getElementById("ho-activo").checked
    };

    try {
        if (id) {
            await api("/hoteles/" + id, { method: "PUT", body: JSON.stringify(cuerpo) });
        } else {
            await api("/hoteles", { method: "POST", body: JSON.stringify(cuerpo) });
        }
        formHotel.classList.add("oculto");
        await cargarHoteles(buscarHotel.value);
    } catch (error) {
        mensajeHotel.textContent = error.message;
    }
});

tablaHoteles.addEventListener("click", async (evento) => {
    const editar = evento.target.closest("[data-editar-hotel]");
    const eliminar = evento.target.closest("[data-eliminar-hotel]");

    if (editar) {
        const hotel = hotelesCargados.find((h) => h.id === Number(editar.dataset.editarHotel));
        if (hotel) mostrarFormHotel(hotel);
    }

    if (eliminar) {
        const id = Number(eliminar.dataset.eliminarHotel);
        const hotel = hotelesCargados.find((h) => h.id === id);
        const nombre = hotel ? hotel.nombre : "este hotel";

        if (!confirm(`¿Eliminar "${nombre}"?`)) return;

        try {
            await api("/hoteles/" + id, { method: "DELETE" });
            await cargarHoteles(buscarHotel.value);
        } catch (error) {
            alert(error.message);
        }
    }
});

let temporizadorHotel;
buscarHotel.addEventListener("input", () => {
    clearTimeout(temporizadorHotel);
    temporizadorHotel = setTimeout(() => cargarHoteles(buscarHotel.value), 300);
});

// =========================================================
// UBIGEO
// =========================================================

const selDepartamento = document.getElementById("sel-departamento");
const selProvincia = document.getElementById("sel-provincia");
const selDistrito = document.getElementById("sel-distrito");
const ubigeoInfo = document.getElementById("ubigeo-info");

async function cargarDepartamentos() {
    const departamentos = await api("/ubigeo/departamentos");
    if (!departamentos) return;

    selDepartamento.innerHTML = '<option value="">Selecciona un departamento</option>';
    departamentos.forEach((departamento) => {
        const opcion = document.createElement("option");
        opcion.value = departamento.id;
        opcion.textContent = departamento.nombre;
        selDepartamento.appendChild(opcion);
    });
}

selDepartamento.addEventListener("change", async () => {
    selProvincia.innerHTML = '<option value="">Selecciona una provincia</option>';
    selDistrito.innerHTML = '<option value="">Selecciona un distrito</option>';
    selProvincia.disabled = true;
    selDistrito.disabled = true;

    if (!selDepartamento.value) {
        ubigeoInfo.textContent = "Selecciona un departamento para comenzar.";
        return;
    }

    const provincias = await api(`/ubigeo/departamentos/${selDepartamento.value}/provincias`);
    if (!provincias) return;

    provincias.forEach((provincia) => {
        const opcion = document.createElement("option");
        opcion.value = provincia.id;
        opcion.textContent = provincia.nombre;
        selProvincia.appendChild(opcion);
    });

    selProvincia.disabled = false;
    ubigeoInfo.textContent = `Departamento: ${selDepartamento.options[selDepartamento.selectedIndex].text} · ${provincias.length} provincias`;
});

selProvincia.addEventListener("change", async () => {
    selDistrito.innerHTML = '<option value="">Selecciona un distrito</option>';
    selDistrito.disabled = true;

    if (!selProvincia.value) {
        ubigeoInfo.textContent = "Selecciona una provincia.";
        return;
    }

    const distritos = await api(`/ubigeo/provincias/${selProvincia.value}/distritos`);
    if (!distritos) return;

    distritos.forEach((distrito) => {
        const opcion = document.createElement("option");
        opcion.value = distrito.id;
        opcion.textContent = distrito.nombre;
        selDistrito.appendChild(opcion);
    });

    selDistrito.disabled = false;
    ubigeoInfo.textContent = `Departamento: ${selDepartamento.options[selDepartamento.selectedIndex].text} · Provincia: ${selProvincia.options[selProvincia.selectedIndex].text} · ${distritos.length} distritos`;
});

selDistrito.addEventListener("change", () => {
    if (!selDistrito.value) return;

    const departamento = selDepartamento.options[selDepartamento.selectedIndex].text;
    const provincia = selProvincia.options[selProvincia.selectedIndex].text;
    const distrito = selDistrito.options[selDistrito.selectedIndex].text;

    ubigeoInfo.textContent = `${departamento} / ${provincia} / ${distrito}`;
});

// =========================================================
// INICIO
// =========================================================

(async function mostrarSesion() {
    try {
        const usuario = await api("/auth/me");
        if (usuario) {
            document.getElementById("usuario-info").textContent =
                `${usuario.nombre} ${usuario.apellido} · ${usuario.rol}`;
        }
    } catch (error) {
        // No bloquea el panel.
    }
})();

cargarOperadores();
cargarHoteles();
cargarOpcionesOperador();
cargarDepartamentos();
