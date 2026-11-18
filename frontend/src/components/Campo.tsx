import type { ReactNode } from 'react'

interface Props {
  label: string
  htmlFor: string
  children: ReactNode
}

/** Label + control con el espaciado de Bootstrap. */
export function Campo({ label, htmlFor, children }: Props) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  )
}
