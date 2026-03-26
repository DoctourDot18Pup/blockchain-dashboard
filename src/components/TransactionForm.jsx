import { useState } from 'react'
import { postTransaction } from '../services/api'

const EMPTY = {
  personaId:      '',
  institucionId:  '',
  programaId:     '',
  tituloObtenido: '',
  fechaFin:       '',
  numeroCedula:   '',
  firmadoPor:     '',
}

export default function TransactionForm({ onSuccess }) {
  const [form,    setForm]    = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await postTransaction(form)
      setResult(res.data)
      setForm(EMPTY)
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear transacción')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="label">Nueva transacción</span>
        <span className="badge badge-info">Grado académico</span>
      </div>

      <form onSubmit={handleSubmit} className="tx-form">
        <div className="form-row">
          <label>Persona ID (UUID)</label>
          <input name="personaId" value={form.personaId}
            onChange={handleChange} placeholder="aaaaaaaa-aaaa-..." required />
        </div>
        <div className="form-row">
          <label>Institución ID (UUID)</label>
          <input name="institucionId" value={form.institucionId}
            onChange={handleChange} placeholder="11111111-1111-..." required />
        </div>
        <div className="form-row">
          <label>Programa ID (UUID)</label>
          <input name="programaId" value={form.programaId}
            onChange={handleChange} placeholder="33333333-3333-..." required />
        </div>
        <div className="form-row">
          <label>Título obtenido</label>
          <input name="tituloObtenido" value={form.tituloObtenido}
            onChange={handleChange} placeholder="Ingeniero en Sistemas..." required />
        </div>
        <div className="form-row-2">
          <div className="form-row">
            <label>Fecha de graduación</label>
            <input type="date" name="fechaFin" value={form.fechaFin}
              onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Número de cédula</label>
            <input name="numeroCedula" value={form.numeroCedula}
              onChange={handleChange} placeholder="12345678" />
          </div>
        </div>
        <div className="form-row">
          <label>Firmado por (nodo)</label>
          <input name="firmadoPor" value={form.firmadoPor}
            onChange={handleChange} placeholder="nodo-1" required />
        </div>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Enviando...</> : 'Registrar grado'}
        </button>
      </form>

      {result && (
        <div className="result success">
          <div className="result-title">Transacción registrada</div>
          <div className="hash-line">
            <span className="hash-label">id</span>
            <span className="hash-value">{result.transaccion?.id}</span>
          </div>
          <div className="hash-line">
            <span className="hash-label">propagada</span>
            <span className="hash-value">{result.propagada ? 'sí' : 'no'}</span>
          </div>
        </div>
      )}
      {error && <div className="result error">{error}</div>}
    </div>
  )
}
