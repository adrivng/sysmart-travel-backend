import { useEffect, useState, type FormEvent } from 'react'
import { api, mensajeDeError } from '../../api/client'
import { useAuth } from '../../auth/AuthContext'
import { Alert } from '../../components/Alert'
import { Campo } from '../../components/Campo'
import { ConfirmModal } from '../../components/ConfirmModal'
import { EstadoBadge } from '../../components/EstadoBadge'
import { Modal } from '../../components/Modal'
import { TablaVacia } from '../../components/TablaVacia'
import { useDebounce } from '../../hooks/useDebounce'
import type { Operador, OperadorRequest } from '../../types'

const FORM_VACIO: OperadorRequest = {
  nombre: '',
  telefono: '',
  correo: '',
  direccion: '',
  observacion: '',
  mayorista: false,
  activo: true,
}

export function OperadoresPanel() {
  const { usuario } = useAuth()
  const puedeEscribir = usuario?.rol === 'ADMIN' || usuario?.rol === 'OPERADOR'

  const [operadores, setOperadores] = useState<Operador[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const busquedaRetrasada = useDebounce(busqueda)

  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Operador | null>(null)
  const [form, setForm] = useState<OperadorRequest>(FORM_VACIO)
  const [errorForm, setErrorForm] = useState('')
  const [guardando, setGuardando] = useState(false)

  const [porEliminar, setPorEliminar] = useState<Operador | null>(null)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    let vigente = true
    setCargando(true)

    const consulta = busquedaRetrasada.trim()
    const ruta = consulta ? '/operadores?q=' + encodeURIComponent(consulta) : '/operadores'

    api
      .get<Operador[]>(ruta)
      .then((datos) => {
        if (!vigente) return
        setOperadores(datos)
        setError('')
      })
      .catch((e) => vigente && setError(mensajeDeError(e)))
      .finally(() => vigente && setCargando(false))

    return () => {
      vigente = false
    }
  }, [busquedaRetrasada])

  function abrirCrear() {
    setEditando(null)
    setForm(FORM_VACIO)
    setErrorForm('')
    setModalAbierto(true)
  }

  function abrirEditar(operador: Operador) {
    setEditando(operador)
    setForm({
      nombre: operador.nombre,
      telefono: operador.telefono ?? '',
      correo: operador.correo ?? '',
      direccion: operador.direccion ?? '',
      observacion: operador.observacion ?? '',
      mayorista: operador.mayorista,
      activo: operador.activo,
    })
    setErrorForm('')
    setModalAbierto(true)
  }

  function cambiar<K extends keyof OperadorRequest>(campo: K, valor: OperadorRequest[K]) {
    setForm((actual) => ({ ...actual, [campo]: valor }))
  }

  async function guardar(evento: FormEvent) {
    evento.preventDefault()
    setErrorForm('')
    setGuardando(true)

    try {
      if (editando) {
        await api.put<Operador>('/operadores/' + editando.id, form)
        setAviso('Operador actualizado correctamente')
      } else {
        await api.post<Operador>('/operadores', form)
        setAviso('Operador creado correctamente')
      }
      setModalAbierto(false)
      setOperadores(await api.get<Operador[]>('/operadores'))
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
      await api.delete('/operadores/' + porEliminar.id)
      setAviso('Operador eliminado correctamente')
      setPorEliminar(null)
      setOperadores(await api.get<Operador[]>('/operadores'))
    } catch (e) {
      setError(mensajeDeError(e))
      setPorEliminar(null)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <>
      <Alert>{error}</Alert>
      <Alert tipo="success" onCerrar={() => setAviso('')}>
        {aviso}
      </Alert>

      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span className="fw-semibold">Proveedores de servicios turisticos</span>

          <div className="d-flex gap-2">
            <div className="input-group input-group-sm buscador">
              <span className="input-group-text">
                <i className="bi bi-search" />
              </span>
              <input
                className="form-control"
                placeholder="Buscar operador..."
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />
            </div>

            {puedeEscribir && (
              <button type="button" className="btn btn-primary btn-sm text-nowrap" onClick={abrirCrear}>
                <i className="bi bi-plus-lg me-1" />
                Nuevo
              </button>
            )}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Correo</th>
                <th>Tipo</th>
                <th>Estado</th>
                {puedeEscribir && <th className="text-end">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {cargando && <TablaVacia colspan={puedeEscribir ? 7 : 6}>Cargando operadores...</TablaVacia>}

              {!cargando && operadores.length === 0 && (
                <TablaVacia colspan={puedeEscribir ? 7 : 6}>No hay operadores registrados.</TablaVacia>
              )}

              {!cargando &&
                operadores.map((operador) => (
                  <tr key={operador.id}>
                    <td>{operador.id}</td>
                    <td className="fw-semibold">{operador.nombre}</td>
                    <td>{operador.telefono || '-'}</td>
                    <td>{operador.correo || '-'}</td>
                    <td>
                      <span className={`badge ${operador.mayorista ? 'text-bg-info' : 'text-bg-light text-dark'}`}>
                        {operador.mayorista ? 'Mayorista' : 'Minorista'}
                      </span>
                    </td>
                    <td>
                      <EstadoBadge activo={operador.activo} />
                    </td>
                    {puedeEscribir && (
                      <td className="text-end text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => abrirEditar(operador)}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setPorEliminar(operador)}
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
        titulo={editando ? 'Editar operador' : 'Nuevo operador'}
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
            <button type="submit" form="form-operador" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="form-operador" className="modal-body" onSubmit={guardar}>
          <Alert>{errorForm}</Alert>

          <Campo label="Nombre" htmlFor="op-nombre">
            <input
              id="op-nombre"
              className="form-control"
              maxLength={100}
              value={form.nombre}
              onChange={(evento) => cambiar('nombre', evento.target.value)}
              required
            />
          </Campo>

          <div className="row">
            <div className="col-md-6">
              <Campo label="Telefono" htmlFor="op-telefono">
                <input
                  id="op-telefono"
                  className="form-control"
                  maxLength={50}
                  value={form.telefono}
                  onChange={(evento) => cambiar('telefono', evento.target.value)}
                />
              </Campo>
            </div>

            <div className="col-md-6">
              <Campo label="Correo" htmlFor="op-correo">
                <input
                  id="op-correo"
                  type="email"
                  className="form-control"
                  maxLength={255}
                  value={form.correo}
                  onChange={(evento) => cambiar('correo', evento.target.value)}
                />
              </Campo>
            </div>
          </div>

          <Campo label="Direccion" htmlFor="op-direccion">
            <input
              id="op-direccion"
              className="form-control"
              maxLength={255}
              value={form.direccion}
              onChange={(evento) => cambiar('direccion', evento.target.value)}
            />
          </Campo>

          <Campo label="Observacion" htmlFor="op-observacion">
            <textarea
              id="op-observacion"
              className="form-control"
              rows={3}
              maxLength={500}
              value={form.observacion}
              onChange={(evento) => cambiar('observacion', evento.target.value)}
            />
          </Campo>

          <div className="form-check form-switch mb-2">
            <input
              id="op-mayorista"
              type="checkbox"
              className="form-check-input"
              checked={form.mayorista}
              onChange={(evento) => cambiar('mayorista', evento.target.checked)}
            />
            <label className="form-check-label" htmlFor="op-mayorista">
              Es mayorista
            </label>
          </div>

          <div className="form-check form-switch">
            <input
              id="op-activo"
              type="checkbox"
              className="form-check-input"
              checked={form.activo}
              onChange={(evento) => cambiar('activo', evento.target.checked)}
            />
            <label className="form-check-label" htmlFor="op-activo">
              Operador activo
            </label>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        abierto={porEliminar !== null}
        titulo="Eliminar operador"
        mensaje={`¿Seguro que deseas eliminar a "${porEliminar?.nombre ?? ''}"?`}
        procesando={eliminando}
        onCancelar={() => setPorEliminar(null)}
        onConfirmar={eliminar}
      />
    </>
  )
}
