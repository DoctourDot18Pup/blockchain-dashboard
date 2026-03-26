import { useState } from 'react'
import { resolve } from '../services/api'

export default function ResolveButton({ onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)

  async function handleResolve() {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await resolve()
      setResult(res.data)
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al resolver')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="label">Consenso</span>
      </div>
      <p className="card-desc">
        Consulta la cadena de todos los peers y adopta la válida más larga
        si supera a la cadena local.
      </p>
      <button
        className="btn-resolve"
        onClick={handleResolve}
        disabled={loading}
      >
        {loading ? <><span className="spinner" /> Consultando peers...</> : 'Ejecutar /nodes/resolve'}
      </button>

      {result && (
        <div className={`result ${result.reemplazada ? 'success' : 'info'}`}>
          <div className="result-title">{result.mensaje}</div>
          {result.longitud && (
            <div className="hash-line">
              <span className="hash-label">longitud</span>
              <span className="hash-value">{result.longitud} bloques</span>
            </div>
          )}
        </div>
      )}
      {error && <div className="result error">{error}</div>}
    </div>
  )
}
