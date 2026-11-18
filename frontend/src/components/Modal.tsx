import { useEffect, type ReactNode } from 'react'

interface Props {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'lg' | 'xl'
}

/**
 * Modal controlado por React (sin la libreria JS de Bootstrap).
 * Se cierra con el boton X, con Escape o haciendo clic fuera.
 */
export function Modal({ abierto, titulo, onCerrar, children, footer, size }: Props) {
  useEffect(() => {
    if (!abierto) return

    function alPresionarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onCerrar()
    }

    document.addEventListener('keydown', alPresionarTecla)
    document.body.classList.add('modal-open')

    return () => {
      document.removeEventListener('keydown', alPresionarTecla)
      document.body.classList.remove('modal-open')
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <>
      <div
        className="modal d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        onMouseDown={(evento) => {
          if (evento.target === evento.currentTarget) onCerrar()
        }}
      >
        <div className={`modal-dialog modal-dialog-centered ${size ? 'modal-' + size : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{titulo}</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} />
            </div>
            {children}
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  )
}
