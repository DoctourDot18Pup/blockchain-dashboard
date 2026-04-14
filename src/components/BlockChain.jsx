import { useState } from 'react'

function Block({ block, index }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`block`} onClick={() => setExpanded(e => !e)}>
      <div className="block-header">
        <div className="block-index">#{block.bloque_index ?? index}</div>
        <div className="block-hash">{block.hash_actual}</div>
        <div className="block-toggle">{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div className="block-body">
          <div className="block-field">
            <span className="bf-label">hash anterior</span>
            <span className="bf-value">{block.hash_anterior}</span>
          </div>
          <div className="block-field">
            <span className="bf-label">nonce</span>
            <span className="bf-value accent">{block.nonce}</span>
          </div>
          <div className="block-field">
            <span className="bf-label">timestamp</span>
            <span className="bf-value">
              {block.creado_en
                ? new Date(block.creado_en).toLocaleString()
                : '—'}
            </span>
          </div>
          <div className="block-field">
            <span className="bf-label">minado por</span>
            <span className="bf-value accent">{block.nodo_origen || block.firmado_por || '—'}</span>
          </div>
          {block.titulo_obtenido && (
            <div className="tx-item">
              <div className="tx-titulo">{block.titulo_obtenido}</div>
              <div className="tx-meta">
                {block.firmado_por} · {block.fecha_fin}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function BlockChain({ chain }) {
  return (
    <div className="card card-full">
      <div className="card-header">
        <span className="label">Cadena de bloques</span>
        <span className="badge badge-info">{chain.length} bloque(s)</span>
      </div>
      <div className="chain-list">
        {[...chain].reverse().map((block, i) => (
          <Block key={block.hash_actual} block={block} index={chain.length - 1 - i} />
        ))}
      </div>
    </div>
  )
}
