import { useState } from 'react'
import { registerNodes } from '../services/api'

export default function PeersPanel({ nodes, onSuccess }) {
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function handleRegister(e) {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    try {
      const lista = input.split(',').map(s => s.trim()).filter(Boolean)
      await registerNodes(lista)
      setInput('')
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar peer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="label">Peers registrados</span>
        <span className="badge badge-ok">{nodes.length} activo(s)</span>
      </div>

      <div className="peers-list">
        {nodes.length === 0 ? (
          <div className="empty-state">Sin peers registrados</div>
        ) : (
          nodes.map(n => (
            <div key={n} className="peer-item">
              <span className="peer-dot" />
              <span className="peer-url">{n}</span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleRegister} className="peer-form">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="http://localhost:8002, http://localhost:8003"
        />
        <button type="submit" className="btn-peer" disabled={loading}>
          {loading ? '...' : 'Registrar'}
        </button>
      </form>
      {error && <div className="result error">{error}</div>}
    </div>
  )
}
