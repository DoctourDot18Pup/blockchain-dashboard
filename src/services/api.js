import axios from 'axios'

const BASE_URL = import.meta.env.VITE_NODE_URL || 'http://localhost:8001'

const api = axios.create({ baseURL: BASE_URL })

export const getHealth   = ()         => api.get('/health')
export const getChain    = ()         => api.get('/chain')
export const getNodes    = ()         => api.get('/nodes')
export const mine        = ()         => api.post('/mine')
export const resolve     = ()         => api.get('/nodes/resolve')

export const postTransaction = (data) => api.post('/transactions', data)
export const registerNodes   = (nodos) => api.post('/nodes/register', { nodos })

export default api
