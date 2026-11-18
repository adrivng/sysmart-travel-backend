const BASE = '/api'
const TOKEN_KEY = 'erp_token'

export class ApiError extends Error {
  status: number
  campos?: Record<string, string>

  constructor(mensaje: string, status: number, campos?: Record<string, string>) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.campos = campos
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function guardarToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function borrarToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function mensajeDeError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.campos) {
      return Object.values(error.campos).join(' · ')
    }
    return error.message
  }
  return 'Ocurrió un error inesperado'
}

async function request<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const headers = new Headers(opciones.headers)
  headers.set('Content-Type', 'application/json')

  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const respuesta = await fetch(BASE + ruta, { ...opciones, headers })

  // Token vencido o inválido: se cierra la sesión (salvo en el propio login)
  if (respuesta.status === 401 && ruta !== '/auth/login') {
    borrarToken()
    window.location.assign('/login')
    throw new ApiError('La sesión expiró', 401)
  }

  if (respuesta.status === 204) {
    return undefined as T
  }

  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    throw new ApiError(
      datos?.mensaje ?? 'Error en la solicitud',
      respuesta.status,
      datos?.campos,
    )
  }

  return datos as T
}

export const api = {
  get: <T>(ruta: string) => request<T>(ruta),
  post: <T>(ruta: string, cuerpo: unknown) =>
    request<T>(ruta, { method: 'POST', body: JSON.stringify(cuerpo) }),
  put: <T>(ruta: string, cuerpo: unknown) =>
    request<T>(ruta, { method: 'PUT', body: JSON.stringify(cuerpo) }),
  delete: (ruta: string) => request<void>(ruta, { method: 'DELETE' }),
}
