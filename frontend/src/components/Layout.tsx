import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

/**
 * Marco comun de la aplicacion: barra superior + contenido.
 * Se reutiliza en todas las paginas protegidas.
 */
export function Layout() {
  const { usuario, cerrarSesion } = useAuth()
  const navegar = useNavigate()

  function salir() {
    cerrarSesion()
    navegar('/login', { replace: true })
  }

  const claseEnlace = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link active fw-semibold' : 'nav-link'

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark shadow-sm">
        <div className="container">
          <span className="navbar-brand d-flex align-items-center gap-2">
            <span className="brand-mark">E</span>
            <strong>ERP Turistico</strong>
          </span>

          <div className="navbar-nav me-auto">
            <NavLink to="/usuarios" className={claseEnlace}>
              <i className="bi bi-people me-1" />
              Usuarios
            </NavLink>
            <NavLink to="/maestros" className={claseEnlace}>
              <i className="bi bi-database me-1" />
              Maestros
            </NavLink>
          </div>

          <div className="d-flex align-items-center gap-3">
            <a
              className="text-white-50 small text-decoration-none d-none d-lg-inline"
              href="/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-braces me-1" />
              API
            </a>

            {usuario && (
              <span className="text-white-50 small d-none d-md-inline">
                {usuario.nombre} {usuario.apellido}
                <span className="badge text-bg-secondary ms-2">{usuario.rol}</span>
              </span>
            )}

            <button type="button" className="btn btn-outline-light btn-sm" onClick={salir}>
              <i className="bi bi-box-arrow-right me-1" />
              Salir
            </button>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>
    </>
  )
}
