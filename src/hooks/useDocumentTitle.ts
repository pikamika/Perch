import { useEffect } from 'react'
import { APP_NAME } from '../lib/brand'

/** Sets the browser tab / screen-reader page title for the current screen. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} · ${APP_NAME}`
  }, [title])
}
