import { useEffect } from 'react'

/** Sets the browser tab / screen-reader page title for the current screen. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} · Confidence Card`
  }, [title])
}
