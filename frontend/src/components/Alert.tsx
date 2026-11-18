import type { ReactNode } from 'react'

type Tipo = 'danger' | 'success' | 'info' | 'warning'

interface Props {
  tipo?: Tipo
  children?: ReactNode
  onCerrar?: () => void
}

/** Mensaje de error o confirmacion, reutilizable en formularios y paginas. */
export function Alert({ tipo = 'danger', children, onCerrar }: Props) {
  if (!children) return null

  return (
    <div className={`alert alert-${tipo} py-2 d-flex justify-content-between align-items-center`} role="alert">
      <span>{children}</span>
      {onCerrar && (
        <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} />
      )}
    </div>
  )
}
