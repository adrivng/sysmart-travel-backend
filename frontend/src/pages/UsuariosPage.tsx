import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { api, mensajeDeError } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Alert } from '../components/Alert'
import { Campo } from '../components/Campo'
import { ConfirmModal } from '../components/ConfirmModal'
import { EstadoBadge } from '../components/EstadoBadge'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { TablaVacia } from '../components/TablaVacia'
import type { Rol, Usuario, UsuarioRequest } from '../types'

const FORM_VACIO: UsuarioRequest = {
  username: '',
  password: '',
  nombre: '',
  apellido: '',
  email: '',
  celular: '',
  cargo: '',
  rol: 'VENDEDOR',
  estado: true,
}

export function UsuariosPage() {
  const { usuario: sesion } = useAuth()
  const esAdmin = sesion?.rol === 'ADMIN'

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Usuario | null>(null)
  const [form, setForm] = useState<UsuarioRequest>(FORM_VACIO)
  const [errorForm, setErrorForm] = useState('')
  const [guardando, setGuardando] = useState(false)

  const [porEliminar, setPorEliminar] = useState<Usuario | null>(null)
  const [eliminando, setEliminando] = useState(false)

  async function cargarUsuarios() {
    setCargando(true)
    try {
      setUsuarios(await api.get<Usuario[]>('/usuarios'))
      setError('')
    } catch (e) {
      setError(mensajeDeError(e))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarUsuarios()
    api.get<Rol[]>('/usuarios/roles').then(setRoles).catch(() => setRoles([]))
  }, [])

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return usuarios

    return usuarios.filter((u) =>
      [u.username, u.nombre, u.apellido, u.email, u.rol]
        .join(' ')
        .toLowerCase()
        .includes(texto),
    )
  }, [usuarios, busqueda])

  function abrirCrear() {
    setEditando(null)
    setForm(FORM_VACIO)
    setErrorForm('')
    setModalAbierto(true)
  }

  function abrirEditar(usuario: Usuario) {
    setEditando(usuario)
    setForm({
      username: usuario.username,
      password: '',
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      celular: usuario.celular ?? '',
      cargo: usuario.cargo ?? '',
      rol: usuario.rol,
      estado: usuario.estado,
    })
    setErrorForm('')
    setModalAbierto(true)
  }

  function cambiar<K extends keyof UsuarioRequest>(campo: K, valor: UsuarioRequest[K]) {
    setForm((actual) => ({ ...actual, [campo]: valor }))
  }

  async function guardar(evento: FormEvent) {
    evento.preventDefault()
    setErrorForm('')
    setGuardando(true)

    try {
      if (editando) {
        await api.put<Usuario>('/usuarios/' + editando.id, form)
        setAviso('Usuario actualizado correctamente')
      } else {
        await api.post<Usuario>('/usuarios', form)
        setAviso('Usuario creado correctamente')
      }
      setModalAbierto(false)
      await cargarUsuarios()
    } catch (e) {
      setErrorForm(mensajeDeError(e))
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar() {
    if (!porEliminar) return
    setEliminando(true)

    try {
      await api.delete('/usuarios/' + porEliminar.id)
      setAviso('Usuario eliminado correctamente')
      setPorEliminar(null)
      await cargarUsuarios()
    } catch (e) {
      setError(mensajeDeError(e))
      setPorEliminar(null)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <>
      <PageHeader titulo="Usuarios" descripcion="Cuentas del sistema y rol asignado.">
        {esAdmin && (
          <button type="button" className="btn btn-primary" onClick={abrirCrear}>
            <i className="bi bi-person-plus me-1" />
            Nuevo usuario
          </button>
        )}
      </PageHeader>

      <Alert>{error}</Alert>
      <Alert tipo="success" onCerrar={() => setAviso('')}>
        {aviso}
      </Alert>

      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span className="fw-semibold">
            {usuariosFiltrados.length} de {usuarios.length} usuarios
          </span>
          <div className="input-group input-group-sm buscador">
            <span className="input-group-text">
              <i className="bi bi-search" />
            </span>
            <input
              className="form-control"
              placeholder="Buscar por nombre, usuario o correo..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                {esAdmin && <th className="text-end">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {cargando && <TablaVacia colspan={esAdmin ? 7 : 6}>Cargando usuarios...</TablaVacia>}

              {!cargando && usuariosFiltrados.length === 0 && (
                <TablaVacia colspan={esAdmin ? 7 : 6}>No hay usuarios para mostrar.</TablaVacia>
              )}

              {!cargando &&
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td className="fw-semibold">{usuario.username}</td>
                    <td>
                      {usuario.nombre} {usuario.apellido}
                    </td>
                    <td>{usuario.email}</td>
                    <td>
                      <span className="badge text-bg-primary">{usuario.rol}</span>
                    </td>
                    <td>
                      <EstadoBadge activo={usuario.estado} />
                    </td>
                    {esAdmin && (
                      <td className="text-end text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => abrirEditar(usuario)}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setPorEliminar(usuario)}
                          disabled={usuario.id === sesion?.id}
                          title={
                            usuario.id === sesion?.id
                              ? 'No puedes eliminar tu propio usuario'
                              : 'Eliminar usuario'
                          }
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        abierto={modalAbierto}
        titulo={editando ? 'Editar usuario' : 'Nuevo usuario'}
        onCerrar={() => setModalAbierto(false)}
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalAbierto(false)}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button type="submit" form="form-usuario" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="form-usuario" className="modal-body" onSubmit={guardar}>
          <Alert>{errorForm}</Alert>

          <div className="row">
            <div className="col-md-6">
              <Campo label="Usuario" htmlFor="u-username">
                <input
                  id="u-username"
                  className="form-control"
                  maxLength={50}
                  value={form.username}
                  onChange={(evento) => cambiar('username', evento.target.value)}
                  required
                />
              </Campo>
            </div>

            <div className="col-md-6">
              <Campo
                label={editando ? 'Contrasena (opcional)' : 'Contrasena'}
                htmlFor="u-password"
              >
                <input
                  id="u-password"
                  type="password"
                  className="form-control"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(evento) => cambiar('password', evento.target.value)}
                  required={!editando}
                  placeholder={editando ? 'Dejar vacio para mantener la actual' : ''}
                />
              </Campo>
            </div>

            <div className="col-md-6">
              <Campo label="Nombre" htmlFor="u-nombre">
                <input
                  id="u-nombre"
                  className="form-control"
                  maxLength={100}
                  value={form.nombre}
                  onChange={(evento) => cambiar('nombre', evento.target.value)}
                  required
                />
              </Campo>
            </div>

            <div className="col-md-6">
              <Campo label="Apellido" htmlFor="u-apellido">
                <input
                  id="u-apellido"
                  className="form-control"
                  maxLength={100}
                  value={form.apellido}
                  onChange={(evento) => cambiar('apellido', evento.target.value)}
                  required
                />
              </Campo>
            </div>

            <div className="col-md-6">
              <Campo label="Correo" htmlFor="u-email">
                <input
                  id="u-email"
                  type="email"
                  className="form-control"
                  maxLength={150}
                  value={form.email}
                  onChange={(evento) => cambiar('email', evento.target.value)}
                  required
                />
              </Campo>
            </div>

            <div className="col-md-6">
              <Campo label="Celular" htmlFor="u-celular">
                <input
                  id="u-celular"
                  className="form-control"
                  maxLength={30}
                  value={form.celular}
                  onChange={(evento) => cambiar('celular', evento.target.value)}
                />
              </Campo>
            </div>

            <div className="col-md-6">
              <Campo label="Cargo" htmlFor="u-cargo">
                <input
                  id="u-cargo"
                  className="form-control"
                  maxLength={100}
                  value={form.cargo}
                  onChange={(evento) => cambiar('cargo', evento.target.value)}
                />
              </Campo>
            </div>

            <div className="col-md-6">
              <Campo label="Rol" htmlFor="u-rol">
                <select
                  id="u-rol"
                  className="form-select"
                  value={form.rol}
                  onChange={(evento) => cambiar('rol', evento.target.value)}
                  required
                >
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.nombre}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
          </div>

          <div className="form-check form-switch">
            <input
              id="u-estado"
              type="checkbox"
              className="form-check-input"
              checked={form.estado}
              onChange={(evento) => cambiar('estado', evento.target.checked)}
            />
            <label className="form-check-label" htmlFor="u-estado">
              Usuario activo
            </label>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        abierto={porEliminar !== null}
        titulo="Eliminar usuario"
        mensaje={`¿Seguro que deseas eliminar a "${porEliminar?.username ?? ''}"? Esta accion no se puede deshacer.`}
        procesando={eliminando}
        onCancelar={() => setPorEliminar(null)}
        onConfirmar={eliminar}
      />
    </>
  )
}
