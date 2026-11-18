import type { ReactNode } from 'react'

interface Props {
  colspan: number
  children: ReactNode
}

/** Fila que se muestra cuando una tabla no tiene datos. */
export function TablaVacia({ colspan, children }: Props) {
  return (
    <tr>
      <td colSpan={colspan} className="text-center text-secondary py-4">
        {children}
      </td>
    </tr>
  )
}
