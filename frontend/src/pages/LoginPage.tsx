import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { mensajeDeError } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Alert } from '../components/Alert'

export function LoginPage() {
  const { usuario, cargando, iniciarSesion } = useAuth()
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const desde = (ubicacion.state as { desde?: string } | null)?.desde ?? '/usuarios'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (usuario) {
    return <Navigate to={desde} replace />
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    setError('')
    setEnviando(true)

    try {
      await iniciarSesion(username.trim(), password)
      navegar(desde, { replace: true })
    } catch (e) {
      setError(mensajeDeError(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login-fondo d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow login-card">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <span className="brand-mark brand-mark-lg mb-3">E</span>
            <h1 className="h4 mb-1">ERP Turistico</h1>
            <p className="text-secondary mb-0">Ingresa con tu cuenta</p>
          </div>

          <Alert>{error}</Alert>

          <form onSubmit={enviar}>
            <div className="mb-3">
              <label className="form-label" htmlFor="username">
                Usuario
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person" />
                </span>
                <input
                  id="username"
                  className="form-control"
                  autoComplete="username"
                  value={username}
                  onChange={(evento) => setUsername(evento.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Contrasena
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock" />
                </span>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  autoComplete="current-password"
                  value={password}
                  onChange={(evento) => setPassword(evento.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={enviando}>
              {enviando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-secondary small mt-4 mb-0">
            Demo: <strong>admin</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
