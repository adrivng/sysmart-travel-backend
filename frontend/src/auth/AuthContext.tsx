import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, borrarToken, getToken, guardarToken } from '../api/client'
import type { LoginResponse, Usuario } from '../types'

interface AuthContexto {
  usuario: Usuario | null
  cargando: boolean
  iniciarSesion: (username: string, password: string) => Promise<void>
  cerrarSesion: () => void
}

const Contexto = createContext<AuthContexto | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      setCargando(false)
      return
    }

    api.get<Usuario>('/auth/me')
      .then(setUsuario)
      .catch(() => {
        borrarToken()
        setUsuario(null)
      })
      .finally(() => setCargando(false))
  }, [])

  async function iniciarSesion(username: string, password: string) {
    const respuesta = await api.post<LoginResponse>('/auth/login', { username, password })
    guardarToken(respuesta.token)
    const perfil = await api.get<Usuario>('/auth/me')
    setUsuario(perfil)
  }

  function cerrarSesion() {
    borrarToken()
    setUsuario(null)
  }

  return (
    <Contexto.Provider value={{ usuario, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </Contexto.Provider>
  )
}

export function useAuth(): AuthContexto {
  const contexto = useContext(Contexto)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return contexto
}
