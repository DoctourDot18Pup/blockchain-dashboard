import { useBlockchain } from '../hooks/useBlockchain'
import NodeStatus      from '../components/NodeStatus'
import BlockChain      from '../components/BlockChain'
import TransactionForm from '../components/TransactionForm'
import MineButton      from '../components/MineButton'
import PeersPanel      from '../components/PeersPanel'
import ResolveButton   from '../components/ResolveButton'

export default function Dashboard() {
  const { health, chain, nodes, loading, lastUpdate, refresh } = useBlockchain()

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-logo">⬡</div>
      <div className="loading-text">Conectando a la red blockchain...</div>
    </div>
  )

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">Blockchain Node</span>
          <span className="logo-sub">Grados Académicos</span>
        </div>
        <div className="dash-meta">
          <span className="node-tag">{health?.nodeId}</span>
          <span className="port-tag">:{health?.port}</span>
        </div>
      </header>

      <main className="dash-grid">
        <section className="col-left">
          <NodeStatus health={health} lastUpdate={lastUpdate} />
          <MineButton
            pendientes={health?.pendientes || 0}
            onSuccess={refresh}
          />
          <ResolveButton onSuccess={refresh} />
          <PeersPanel nodes={nodes} onSuccess={refresh} />
        </section>

        <section className="col-center">
          <TransactionForm onSuccess={refresh} />
        </section>

        <section className="col-right">
          <BlockChain chain={chain} />
        </section>
      </main>
    </div>
  )
}
