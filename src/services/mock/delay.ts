/**
 * Fakes network latency so loading states are visible, and lets you force an
 * error to see error states. In the browser console run:
 *   localStorage.setItem('cc.simulateError', 'true')   // errors on
 *   localStorage.removeItem('cc.simulateError')        // errors off
 */
const ERROR_FLAG = 'cc.simulateError'

export function shouldSimulateError(): boolean {
  try {
    return window.localStorage.getItem(ERROR_FLAG) === 'true'
  } catch {
    return false
  }
}

export async function simulateNetwork(minMs = 300, maxMs = 600): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs)
  await new Promise<void>((resolve) => setTimeout(resolve, ms))
  if (shouldSimulateError()) {
    throw new Error('Simulated network error')
  }
}
