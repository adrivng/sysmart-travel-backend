interface Props {
  activo: boolean
}

/** Etiqueta verde/gris para el estado de un registro. */
export function EstadoBadge({ activo }: Props) {
  return (
    <span className={`badge ${activo ? 'text-bg-success' : 'text-bg-secondary'}`}>
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  )
}
