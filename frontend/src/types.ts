export interface LoginResponse {
  token: string
  username: string
  nombreCompleto: string
  rol: string
}

export interface Usuario {
  id: number
  username: string
  nombre: string
  apellido: string
  email: string
  celular: string | null
  cargo: string | null
  rol: string
  estado: boolean
  creadoEn: string
}

export interface UsuarioRequest {
  username: string
  password: string
  nombre: string
  apellido: string
  email: string
  celular: string
  cargo: string
  rol: string
  estado: boolean
}

export interface Rol {
  id: number
  nombre: string
  descripcion: string | null
}

export interface Operador {
  id: number
  nombre: string
  telefono: string | null
  correo: string | null
  direccion: string | null
  observacion: string | null
  mayorista: boolean
  activo: boolean
  creadoEn: string
}

export interface OperadorRequest {
  nombre: string
  telefono: string
  correo: string
  direccion: string
  observacion: string
  mayorista: boolean
  activo: boolean
}

export interface Hotel {
  id: number
  nombre: string
  direccion: string | null
  telefono: string | null
  operadorId: number | null
  operadorNombre: string | null
  activo: boolean
  creadoEn: string
}

export interface HotelRequest {
  nombre: string
  direccion: string
  telefono: string
  operadorId: number | null
  activo: boolean
}

export interface Departamento {
  id: number
  nombre: string
}

export interface Provincia {
  id: number
  nombre: string
  departamentoId: number
  departamentoNombre: string
}

export interface Distrito {
  id: number
  nombre: string
  provinciaId: number
  provinciaNombre: string
}
