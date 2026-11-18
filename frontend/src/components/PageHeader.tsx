import type { ReactNode } from 'react'

interface Props {
  titulo: string
  descripcion?: string
  children?: ReactNode
}

/** Encabezado reutilizable de cada pagina. */
export function PageHeader({ titulo, descripcion, children }: Props) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
      <div>
        <h1 className="h3 mb-1">{titulo}</h1>
        {descripcion && <p className="text-secondary mb-0">{descripcion}</p>}
      </div>
      {children && <div className="d-flex gap-2">{children}</div>}
    </div>
  )
}
