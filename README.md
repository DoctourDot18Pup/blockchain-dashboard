# Blockchain Dashboard

Panel de control visual para interactuar con los nodos de la red blockchain distribuida de grados académicos. Desarrollado en React con Vite, consume la API REST de cualquier nodo Express del equipo y permite operar todas las funcionalidades de la red desde una interfaz gráfica.

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Cómo usarlo](#cómo-usarlo)
- [Conexión con el nodo Express](#conexión-con-el-nodo-express)
- [Relación con el proyecto principal](#relación-con-el-proyecto-principal)

---

## Descripción general

El dashboard se conecta a un nodo de la red blockchain via HTTP y expone todas las operaciones disponibles en la API REST a través de una interfaz visual. Se actualiza automáticamente cada 5 segundos para reflejar el estado real de la red en tiempo real.

Está diseñado para funcionar con cualquier nodo del equipo — solo se cambia la variable de entorno `VITE_NODE_URL` para apuntar al nodo deseado.

---

## Tecnologías utilizadas

| Capa | Tecnología |
|---|---|
| Framework | React 18 + Vite |
| HTTP | Axios |
| Estilos | CSS puro con variables (dark mode) |
| Tipografía | JetBrains Mono + Syne (Google Fonts) |
| Comunicación | API REST del nodo Express |

---

## Requisitos previos

- Node.js v18 o superior
- El nodo Express corriendo y accesible (ver [blockchain-node-express](https://github.com/DoctourDot18Pup/blockchain-node-express))
- CORS habilitado en el nodo Express (`npm install cors` + `app.use(cors())`)

---

## Instalación y configuración

```bash
# Clonar el repositorio
git clone https://github.com/DoctourDot18Pup/blockchain-dashboard.git
cd blockchain-dashboard

# Instalar dependencias
npm install

# Crear archivo de entorno
cp .env.example .env
```

Editar `.env` con la URL del nodo al que se quiere conectar:

```bash
nano .env
```

Levantar el servidor de desarrollo:

```bash
npm run dev
# Disponible en: http://localhost:5173
```

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_NODE_URL` | URL base del nodo Express a consumir | `http://localhost:8001` |

Para conectarse a un nodo diferente (compañero de equipo, servidor remoto) basta con cambiar esta variable:

```env
# Nodo local
VITE_NODE_URL=http://localhost:8001

# Nodo remoto de un compañero (Railway, ngrok, etc.)
VITE_NODE_URL=https://blockchain-nodo2.railway.app
```

---

## Estructura del proyecto

```
blockchain-dashboard/
├── src/
│   ├── services/
│   │   └── api.js              # Todas las llamadas HTTP al nodo Express
│   ├── hooks/
│   │   └── useBlockchain.js    # Estado global — health, chain, nodes con auto-refresh
│   ├── components/
│   │   ├── NodeStatus.jsx      # Tarjeta de estado del nodo (bloques, pendientes, peers)
│   │   ├── TransactionForm.jsx # Formulario para registrar un grado académico
│   │   ├── MineButton.jsx      # Botón de minado con resultado en tiempo real
│   │   ├── ResolveButton.jsx   # Botón de consenso /nodes/resolve
│   │   ├── PeersPanel.jsx      # Lista de peers y registro de nuevos nodos
│   │   └── BlockChain.jsx      # Visualización expandible de la cadena completa
│   ├── pages/
│   │   └── Dashboard.jsx       # Layout principal — ensambla todos los componentes
│   ├── App.jsx
│   └── index.css               # Sistema de diseño completo (dark mode, variables CSS)
├── .env.example
└── package.json
```

---

## Funcionalidades

### Estado del nodo
Muestra en tiempo real el `NODE_ID`, puerto, número de bloques en la cadena, transacciones pendientes de minar y la hora de la última actualización. Se refresca automáticamente cada 5 segundos.

### Nueva transacción
Formulario completo para registrar un grado académico con todos los campos requeridos por la API: persona, institución, programa, título obtenido, fecha de graduación, número de cédula y nodo firmante. Al enviarse, la transacción se agrega a los pendientes del nodo y se propaga automáticamente a todos los peers.

### Minado
Botón que ejecuta `POST /mine` en el nodo conectado. Muestra el resultado del minado incluyendo el índice del bloque generado, el hash resultante, el nonce encontrado por Proof of Work y los peers a los que se propagó. El botón se deshabilita automáticamente cuando no hay transacciones pendientes.

### Consenso
Botón que ejecuta `GET /nodes/resolve`. El nodo consulta las cadenas de todos sus peers y adopta la válida más larga si supera a la local. El resultado indica si la cadena fue reemplazada y la longitud final.

### Peers registrados
Lista todos los nodos peers conocidos con indicador de estado activo. Incluye un campo para registrar nuevos peers ingresando sus URLs separadas por coma.

### Cadena de bloques
Visualización completa de todos los bloques de la cadena en orden descendente (el más reciente primero). Cada bloque es expandible y muestra su hash actual, hash anterior, nonce, timestamp y las transacciones académicas que contiene con su título y fecha de graduación.

---

## Cómo usarlo

### Flujo básico de operación

**1. Verificar conexión al nodo**

Al cargar el dashboard, la tarjeta de estado debe mostrar `EN LÍNEA` con los datos del nodo. Si no conecta, verificar que el nodo Express esté corriendo y que `VITE_NODE_URL` en `.env` apunte a la URL correcta.

**2. Registrar peers (si aplica)**

En la sección `Peers registrados`, ingresar las URLs de los otros nodos del equipo y hacer clic en `Registrar`. Los peers se persisten en Supabase y sobreviven reinicios del nodo.

**3. Crear una transacción**

Llenar el formulario de `Nueva transacción` con los datos del grado académico. Los campos `Persona ID`, `Institución ID` y `Programa ID` deben ser UUIDs que existan en la base de datos Supabase del nodo. Al enviar, el contador de `Pendientes` en el estado del nodo incrementará en 1.

**4. Minar el bloque**

Una vez que hay transacciones pendientes, el botón de minado se activa. Al hacer clic, el nodo ejecuta Proof of Work (puede tardar algunos segundos según la dificultad configurada) y genera un nuevo bloque que aparecerá en la cadena de bloques.

**5. Verificar sincronización**

Si hay otros nodos en la red, el bloque minado se habrá propagado automáticamente. Para resolver cualquier conflicto de cadenas divergentes, usar el botón `Ejecutar /nodes/resolve`.

---

## Conexión con el nodo Express

El dashboard consume los siguientes endpoints del nodo:

| Endpoint | Componente que lo usa |
|---|---|
| `GET /health` | NodeStatus — estado y contadores |
| `GET /chain` | BlockChain — visualización de bloques |
| `GET /nodes` | PeersPanel — lista de peers activos |
| `POST /transactions` | TransactionForm — registro de grados |
| `POST /mine` | MineButton — minado de bloques |
| `GET /nodes/resolve` | ResolveButton — algoritmo de consenso |
| `POST /nodes/register` | PeersPanel — registro de nuevos peers |

Para que el dashboard pueda consumir el nodo Express sin errores de CORS, el nodo debe tener habilitado el middleware `cors`:

```javascript
// En src/app.js del nodo Express
const cors = require('cors')
app.use(cors())
```

---

## Relación con el proyecto principal

Este dashboard es el frontend del proyecto [blockchain-node-express](https://github.com/DoctourDot18Pup/blockchain-node-express). Ambos repositorios son independientes — el dashboard no requiere estar en la misma máquina que el nodo, solo necesita acceso HTTP a su URL.

Para conectar el dashboard a un nodo remoto (compañero de equipo desplegado en Railway, ngrok u otro servicio), basta con actualizar `VITE_NODE_URL` en el archivo `.env` y reiniciar el servidor de desarrollo.
