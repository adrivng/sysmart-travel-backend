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
import type { Hotel, HotelRequest, Operador } from '../../types'

const FORM_VACIO: HotelRequest = {
  nombre: '',
  direccion: '',
  telefono: '',
  operadorId: null,
  activo: true,
}

export function HotelesPanel() {
  const { usuario } = useAuth()
  const puedeEscribir = usuario?.rol === 'ADMIN' || usuario?.rol === 'OPERADOR'

  const [hoteles, setHoteles] = useState<Hotel[]>([])
  const [operadores, setOperadores] = useState<Operador[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const busquedaRetrasada = useDebounce(busqueda)

  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Hotel | null>(null)
  const [form, setForm] = useState<HotelRequest>(FORM_VACIO)
  const [errorForm, setErrorForm] = useState('')
  const [guardando, setGuardando] = useState(false)

  const [porEliminar, setPorEliminar] = useState<Hotel | null>(null)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    api.get<Operador[]>('/operadores').then(setOperadores).catch(() => setOperadores([]))
  }, [])

  useEffect(() => {
    let vigente = true
    setCargando(true)

    const consulta = busquedaRetrasada.trim()
    const ruta = consulta ? '/hoteles?q=' + encodeURIComponent(consulta) : '/hoteles'

    api
      .get<Hotel[]>(ruta)
      .then((datos) => {
        if (!vigente) return
        setHoteles(datos)
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

  function abrirEditar(hotel: Hotel) {
    setEditando(hotel)
    setForm({
      nombre: hotel.nombre,
      direccion: hotel.direccion ?? '',
      telefono: hotel.telefono ?? '',
      operadorId: hotel.operadorId,
      activo: hotel.activo,
    })
    setErrorForm('')
    setModalAbierto(true)
  }

  function cambiar<K extends keyof HotelRequest>(campo: K, valor: HotelRequest[K]) {
    setForm((actual) => ({ ...actual, [campo]: valor }))
  }

  async function recargar() {
    setHoteles(await api.get<Hotel[]>('/hoteles'))
  }

  async function guardar(evento: FormEvent) {
    evento.preventDefault()
    setErrorForm('')
    setGuardando(true)

    try {
      if (editando) {
        await api.put<Hotel>('/hoteles/' + editando.id, form)
        setAviso('Hotel actualizado correctamente')
      } else {
        await api.post<Hotel>('/hoteles', form)
        setAviso('Hotel creado correctamente')
      }
      setModalAbierto(false)
      await recargar()
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
      await api.delete('/hoteles/' + porEliminar.id)
      setAviso('Hotel eliminado correctamente')
      setPorEliminar(null)
      await recargar()
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
          <span className="fw-semibold">Alojamientos asociados a un operador</span>

          <div className="d-flex gap-2">
            <div className="input-group input-group-sm buscador">
              <span className="input-group-text">
                <i className="bi bi-search" />
              </span>
              <input
                className="form-control"
                placeholder="Buscar hotel..."
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
                <th>Direccion</th>
                <th>Telefono</th>
                <th>Operador</th>
                <th>Estado</th>
                {puedeEscribir && <th className="text-end">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {cargando && <TablaVacia colspan={puedeEscribir ? 7 : 6}>Cargando hoteles...</TablaVacia>}

              {!cargando && hoteles.length === 0 && (
                <TablaVacia colspan={puedeEscribir ? 7 : 6}>No hay hoteles registrados.</TablaVacia>
              )}

              {!cargando &&
                hoteles.map((hotel) => (
                  <tr key={hotel.id}>
                    <td>{hotel.id}</td>
                    <td className="fw-semibold">{hotel.nombre}</td>
                    <td>{hotel.direccion || '-'}</td>
                    <td>{hotel.telefono || '-'}</td>
                    <td>{hotel.operadorNombre || '-'}</td>
                    <td>
                      <EstadoBadge activo={hotel.activo} />
                    </td>
                    {puedeEscribir && (
                      <td className="text-end text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => abrirEditar(hotel)}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setPorEliminar(hotel)}
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
        titulo={editando ? 'Editar hotel' : 'Nuevo hotel'}
        onCerrar={() => setModalAbierto(false)}
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
            <button type="submit" form="form-hotel" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="form-hotel" className="modal-body" onSubmit={guardar}>
          <Alert>{errorForm}</Alert>

          <Campo label="Nombre" htmlFor="ho-nombre">
            <input
              id="ho-nombre"
              className="form-control"
              maxLength={255}
              value={form.nombre}
              onChange={(evento) => cambiar('nombre', evento.target.value)}
              required
            />
          </Campo>

          <Campo label="Direccion" htmlFor="ho-direccion">
            <input
              id="ho-direccion"
              className="form-control"
              maxLength={255}
              value={form.direccion}
              onChange={(evento) => cambiar('direccion', evento.target.value)}
            />
          </Campo>

          <div className="row">
            <div className="col-md-6">
              <Campo label="Telefono" htmlFor="ho-telefono">
                <input
                  id="ho-telefono"
                  className="form-control"
                  maxLength={255}
                  value={form.telefono}
                  onChange={(evento) => cambiar('telefono', evento.target.value)}
                />
              </Campo>
            </div>

            <div className="col-md-6">
              <Campo label="Operador" htmlFor="ho-operador">
                <select
                  id="ho-operador"
                  className="form-select"
                  value={form.operadorId ?? ''}
                  onChange={(evento) =>
                    cambiar('operadorId', evento.target.value ? Number(evento.target.value) : null)
                  }
                >
                  <option value="">Sin operador</option>
                  {operadores.map((operador) => (
                    <option key={operador.id} value={operador.id}>
                      {operador.nombre}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
          </div>

          <div className="form-check form-switch">
            <input
              id="ho-activo"
              type="checkbox"
              className="form-check-input"
              checked={form.activo}
              onChange={(evento) => cambiar('activo', evento.target.checked)}
            />
            <label className="form-check-label" htmlFor="ho-activo">
              Hotel activo
            </label>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        abierto={porEliminar !== null}
        titulo="Eliminar hotel"
        mensaje={`¿Seguro que deseas eliminar "${porEliminar?.nombre ?? ''}"?`}
        procesando={eliminando}
        onCancelar={() => setPorEliminar(null)}
        onConfirmar={eliminar}
      />
    </>
  )
}
