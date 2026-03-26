import { useState } from 'react'
import { mine } from '../services/api'

export default function MineButton({ onSuccess, pendientes }) {
  const [mining,  setMining]  = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)

  async function handleMine() {
    setMining(true)
    setResult(null)
    setError(null)
    try {
      const res = await mine()
      setResult(res.data)
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al minar')
    } finally {
      setMining(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="label">Minado</span>
        {pendientes > 0 && (
          <span className="badge badge-warn">{pendientes} pendiente(s)</span>
        )}
      </div>

      <p className="card-desc">
        Empaqueta todas las transacciones pendientes, ejecuta Proof of Work
        y propaga el bloque a los peers registrados.
      </p>

      <button
        className={`btn-mine ${mining ? 'mining' : ''}`}
        onClick={handleMine}
        disabled={mining || pendientes === 0}
      >
        {mining ? (
          <><span className="spinner" /> Ejecutando PoW...</>
        ) : pendientes === 0 ? (
          'Sin transacciones pendientes'
        ) : (
          `Minar ${pendientes} transacción(es)`
        )}
      </button>

      {result && (
        <div className="result success">
          <div className="result-title">Bloque #{result.bloque?.index} minado</div>
          <div className="hash-line">
            <span className="hash-label">hash</span>
            <span className="hash-value">{result.bloque?.hashActual}</span>
          </div>
          <div className="hash-line">
            <span className="hash-label">nonce</span>
            <span className="hash-value">{result.bloque?.nonce}</span>
          </div>
          <div className="hash-line">
            <span className="hash-label">propagado a</span>
            <span className="hash-value">
              {result.propagadoA?.length > 0
                ? result.propagadoA.join(', ')
                : 'sin peers'}
            </span>
          </div>
        </div>
      )}

      {error && <div className="result error">{error}</div>}
    </div>
  )
}
