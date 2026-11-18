import { Modal } from './Modal'

interface Props {
  abierto: boolean
  titulo?: string
  mensaje: string
  procesando?: boolean
  onCancelar: () => void
  onConfirmar: () => void
}

/** Confirmacion reutilizable para acciones destructivas. */
export function ConfirmModal({
  abierto,
  titulo = 'Confirmar',
  mensaje,
  procesando = false,
  onCancelar,
  onConfirmar,
}: Props) {
  return (
    <Modal
      abierto={abierto}
      titulo={titulo}
      onCerrar={onCancelar}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onCancelar} disabled={procesando}>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirmar} disabled={procesando}>
            {procesando ? 'Eliminando...' : 'Eliminar'}
          </button>
        </>
      }
    >
      <div className="modal-body">{mensaje}</div>
    </Modal>
  )
}
