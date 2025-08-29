// config.ts
import { createConfig, webSocket } from 'wagmi'
import { celoAlfajores } from 'viem/chains'
import { url } from 'inspector'

// Endpoint público de Celo Alfajores
const RPC_WS = 'wss://alfajores-forno.celo-testnet.org/ws'

// Pequeño wrapper para reconectar si Forno cierra
function resilientWebSocket(url: string) {
    return () => {
        const ws = new WebSocket(url)

        ws.onclose = () => {
            console.warn('⚠️ WS closed, trying to reconnect in 3s...')
            setTimeout(() => resilientWebSocket(url), 3000)
        }

        return ws
    }
}

export const configWss = createConfig({
    chains: [celoAlfajores],
    transports: {
        [celoAlfajores.id]: webSocket(RPC_WS, { reconnect: true, timeout: 3000 }) // resilientWebSocket(RPC_WS),
    },
})
