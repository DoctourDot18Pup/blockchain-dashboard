import { useState, useEffect, useCallback } from 'react'
import { getHealth, getChain, getNodes } from '../services/api'

export function useBlockchain() {
  const [health,    setHealth]    = useState(null)
  const [chain,     setChain]     = useState([])
  const [nodes,     setNodes]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const [h, c, n] = await Promise.all([getHealth(), getChain(), getNodes()])
      setHealth(h.data)
      setChain(c.data.chain)
      setNodes(n.data.nodos)
      setLastUpdate(new Date())
    } catch (err) {
      console.error('[Dashboard] Error al obtener datos:', err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 5000)
    return () => clearInterval(interval)
  }, [refresh])

  return { health, chain, nodes, loading, lastUpdate, refresh }
}
