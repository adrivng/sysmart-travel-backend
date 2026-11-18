import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { HotelesPanel } from './maestros/HotelesPanel'
import { OperadoresPanel } from './maestros/OperadoresPanel'
import { UbigeoPanel } from './maestros/UbigeoPanel'

type Pestana = 'operadores' | 'hoteles' | 'ubigeo'

const PESTANAS: Array<{ id: Pestana; texto: string; icono: string }> = [
  { id: 'operadores', texto: 'Operadores', icono: 'bi-truck' },
  { id: 'hoteles', texto: 'Hoteles', icono: 'bi-building' },
  { id: 'ubigeo', texto: 'Ubigeo', icono: 'bi-geo-alt' },
]

export function MaestrosPage() {
  const [pestana, setPestana] = useState<Pestana>('operadores')

  return (
    <>
      <PageHeader titulo="Maestros" descripcion="Datos base del ERP: operadores, hoteles y ubigeo." />

      <ul className="nav nav-tabs mb-3">
        {PESTANAS.map((item) => (
          <li className="nav-item" key={item.id}>
            <button
              type="button"
              className={`nav-link ${pestana === item.id ? 'active' : ''}`}
              onClick={() => setPestana(item.id)}
            >
              <i className={`bi ${item.icono} me-1`} />
              {item.texto}
            </button>
          </li>
        ))}
      </ul>

      {pestana === 'operadores' && <OperadoresPanel />}
      {pestana === 'hoteles' && <HotelesPanel />}
      {pestana === 'ubigeo' && <UbigeoPanel />}
    </>
  )
}
