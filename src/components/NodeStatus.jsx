export default function NodeStatus({ health, lastUpdate }) {
  if (!health) return (
    <div className="card">
      <div className="loading-pulse">Conectando al nodo...</div>
    </div>
  )

  return (
    <div className="card">
      <div className="card-header">
        <span className="label">Estado del nodo</span>
        <span className="badge badge-ok">EN LÍNEA</span>
      </div>
      <div className="stat-grid">
        <div className="stat">
          <span className="stat-label">NODE ID</span>
          <span className="stat-value accent">{health.node_id}</span>
        </div>
        <div className="stat">
          <span className="stat-label">PUERTO</span>
          <span className="stat-value">{health.port}</span>
        </div>
        <div className="stat">
          <span className="stat-label">BLOQUES</span>
          <span className="stat-value accent">{health.bloques}</span>
        </div>
        <div className="stat">
          <span className="stat-label">PENDIENTES</span>
          <span className="stat-value warn">{health.pendientes}</span>
        </div>
      </div>
      {lastUpdate && (
        <div className="last-update">
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}
