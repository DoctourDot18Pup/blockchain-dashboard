import axios from 'axios'

const BASE_URL = import.meta.env.VITE_NODE_URL || 'http://localhost:8001'

const api = axios.create({ baseURL: BASE_URL })

export const getHealth   = ()          => api.get('/health')
export const getChain    = ()          => api.get('/chain')
export const getNodes    = ()          => api.get('/nodes')
export const mine        = ()          => api.post('/mine')
export const resolve     = ()          => api.get('/nodes/resolve')

export const postTransaction = (data) => api.post("/transactions", {
  persona_id:      data.personaId,
  institucion_id:  data.institucionId,
  programa_id:     data.programaId,
  titulo_obtenido: data.tituloObtenido,
  fecha_fin:       data.fechaFin,
  numero_cedula:   data.numeroCedula,
  firmado_por:     data.firmadoPor,
})
export const registerNodes   = (lista) =>
  Promise.all(lista.map(url => api.post('/nodes/register', { url })))

export default api
