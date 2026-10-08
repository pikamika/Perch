const STORAGE_KEY = 'cc.deviceId'

let memoryId: string | undefined

/**
 * A random id that identifies this browser. Saved places are tied to it so
 * people can use the prototype without logging in.
 */
export function getDeviceId(): string {
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY)
    if (existing) return existing
    const created = crypto.randomUUID()
    window.localStorage.setItem(STORAGE_KEY, created)
    return created
  } catch {
    // Storage blocked (private mode, etc.): keep one id for this page load.
    memoryId ??= crypto.randomUUID()
    return memoryId
  }
}
