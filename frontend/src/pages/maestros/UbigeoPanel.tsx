import { useEffect, useState } from 'react'
import { api, mensajeDeError } from '../../api/client'
import { Alert } from '../../components/Alert'
import { Campo } from '../../components/Campo'
import type { Departamento, Distrito, Provincia } from '../../types'

export function UbigeoPanel() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [distritos, setDistritos] = useState<Distrito[]>([])

  const [departamentoId, setDepartamentoId] = useState('')
  const [provinciaId, setProvinciaId] = useState('')
  const [distritoId, setDistritoId] = useState('')

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<Departamento[]>('/ubigeo/departamentos')
      .then(setDepartamentos)
      .catch((e) => setError(mensajeDeError(e)))
      .finally(() => setCargando(false))
  }, [])

  async function cambiarDepartamento(valor: string) {
    setDepartamentoId(valor)
    setProvinciaId('')
    setDistritoId('')
    setProvincias([])
    setDistritos([])

    if (!valor) return

    try {
      setProvincias(await api.get<Provincia[]>(`/ubigeo/departamentos/${valor}/provincias`))
      setError('')
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }

  async function cambiarProvincia(valor: string) {
    setProvinciaId(valor)
    setDistritoId('')
    setDistritos([])

    if (!valor) return

    try {
      setDistritos(await api.get<Distrito[]>(`/ubigeo/provincias/${valor}/distritos`))
      setError('')
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }

  const departamento = departamentos.find((d) => String(d.id) === departamentoId)
  const provincia = provincias.find((p) => String(p.id) === provinciaId)
  const distrito = distritos.find((d) => String(d.id) === distritoId)

  return (
    <>
      <Alert>{error}</Alert>

      <div className="card shadow-sm">
        <div className="card-header bg-white fw-semibold">
          Ubigeo INEI: departamento, provincia y distrito
        </div>

        <div className="card-body">
          {cargando ? (
            <div className="d-flex align-items-center gap-2 text-secondary">
              <span className="spinner-border spinner-border-sm" />
              Cargando departamentos...
            </div>
          ) : (
            <>
              <div className="row">
                <div className="col-md-4">
                  <Campo label="Departamento" htmlFor="ub-departamento">
                    <select
                      id="ub-departamento"
                      className="form-select"
                      value={departamentoId}
                      onChange={(evento) => cambiarDepartamento(evento.target.value)}
                    >
                      <option value="">Selecciona un departamento</option>
                      {departamentos.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nombre}
                        </option>
                      ))}
                    </select>
                  </Campo>
                </div>

                <div className="col-md-4">
                  <Campo label="Provincia" htmlFor="ub-provincia">
                    <select
                      id="ub-provincia"
                      className="form-select"
                      value={provinciaId}
                      onChange={(evento) => cambiarProvincia(evento.target.value)}
                      disabled={!departamentoId || provincias.length === 0}
                    >
                      <option value="">Selecciona una provincia</option>
                      {provincias.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nombre}
                        </option>
                      ))}
                    </select>
                  </Campo>
                </div>

                <div className="col-md-4">
                  <Campo label="Distrito" htmlFor="ub-distrito">
                    <select
                      id="ub-distrito"
                      className="form-select"
                      value={distritoId}
                      onChange={(evento) => setDistritoId(evento.target.value)}
                      disabled={!provinciaId || distritos.length === 0}
                    >
                      <option value="">Selecciona un distrito</option>
                      {distritos.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nombre}
                        </option>
                      ))}
                    </select>
                  </Campo>
                </div>
              </div>

              <div className="bg-light rounded p-3 mb-0">
                {distrito ? (
                  <span>
                    <i className="bi bi-geo-alt-fill text-danger me-2" />
                    <strong>{departamento?.nombre}</strong> / {provincia?.nombre} / {distrito.nombre}
                  </span>
                ) : (
                  <span className="text-secondary">
                    <i className="bi bi-info-circle me-2" />
                    {departamentos.length} departamentos cargados. Selecciona uno para navegar.
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
