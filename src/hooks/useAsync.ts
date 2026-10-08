import { useCallback, useEffect, useRef, useState } from 'react'

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }

type Outcome<T> = { requestKey: string; result: { ok: true; data: T } | { ok: false; error: Error } }

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error('Something went wrong')
}

/**
 * Runs an async loader and exposes loading / error / success.
 * `key` identifies the request: when it changes, the loader runs again.
 */
export function useAsync<T>(key: string, load: () => Promise<T>) {
  const [attempt, setAttempt] = useState(0)
  const [outcome, setOutcome] = useState<Outcome<T> | null>(null)
  const requestKey = `${key}#${attempt}`

  const loadRef = useRef(load)
  useEffect(() => {
    loadRef.current = load
  })

  useEffect(() => {
    let cancelled = false
    loadRef.current().then(
      (data) => {
        if (!cancelled) setOutcome({ requestKey, result: { ok: true, data } })
      },
      (error: unknown) => {
        if (!cancelled) setOutcome({ requestKey, result: { ok: false, error: toError(error) } })
      },
    )
    return () => {
      cancelled = true
    }
  }, [requestKey])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  /** Update loaded data locally (e.g. after saving) without showing a loading state. */
  const setData = useCallback(
    (update: (previous: T) => T) => {
      setOutcome((current) => {
        if (!current || !current.result.ok) return current
        return { requestKey: current.requestKey, result: { ok: true, data: update(current.result.data) } }
      })
    },
    [],
  )

  let state: AsyncState<T> = { status: 'loading' }
  if (outcome && outcome.requestKey === requestKey) {
    state = outcome.result.ok
      ? { status: 'success', data: outcome.result.data }
      : { status: 'error', error: outcome.result.error }
  }

  return { state, reload, setData }
}
