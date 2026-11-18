import { useEffect, useState } from 'react'

/**
 * Retrasa el valor de un input para no llamar a la API en cada tecla.
 */
export function useDebounce<T>(valor: T, milisegundos = 300): T {
  const [valorRetrasado, setValorRetrasado] = useState(valor)

  useEffect(() => {
    const temporizador = setTimeout(() => setValorRetrasado(valor), milisegundos)
    return () => clearTimeout(temporizador)
  }, [valor, milisegundos])

  return valorRetrasado
}
