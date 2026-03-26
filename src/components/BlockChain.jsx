import { useState } from 'react'

function Block({ block, index }) {
  const [expanded, setExpanded] = useState(false)
  const isGenesis = block.index === 0

  return (
    <div className={`block ${isGenesis ? 'block-genesis' : ''}`}
         onClick={() => setExpanded(e => !e)}>
      <div className="block-header">
        <div className="block-index">#{block.index}</div>
        <div className="block-hash">{block.hashActual}</div>
        <div className="block-toggle">{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div className="block-body">
          <div className="block-field">
            <span className="bf-label">hash anterior</span>
            <span className="bf-value">{block.hashAnterior}</span>
          </div>
          <div className="block-field">
            <span className="bf-label">nonce</span>
            <span className="bf-value accent">{block.nonce}</span>
          </div>
          <div className="block-field">
            <span className="bf-label">timestamp</span>
            <span className="bf-value">
              {new Date(block.timestamp).toLocaleString()}
            </span>
          </div>
          {isGenesis ? (
            <div className="block-field">
              <span className="bf-label">datos</span>
              <span className="bf-value">{block.data?.mensaje}</span>
            </div>
          ) : (
            <>
              <div className="block-field">
                <span className="bf-label">minado por</span>
                <span className="bf-value accent">{block.data?.minadoPor}</span>
              </div>
              <div className="block-field">
                <span className="bf-label">transacciones</span>
                <span className="bf-value">
                  {block.data?.transacciones?.length || 0}
                </span>
              </div>
              {block.data?.transacciones?.map(tx => (
                <div key={tx.id} className="tx-item">
                  <div className="tx-titulo">{tx.tituloObtenido}</div>
                  <div className="tx-meta">
                    {tx.firmadoPor} · {tx.fechaFin}
                  </div>
                </div>
              ))}
            </>
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
          <Block key={block.hashActual} block={block} index={i} />
        ))}
      </div>
    </div>
  )
}
