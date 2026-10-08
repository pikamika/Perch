import { PageHeader } from '../components/layout/PageHeader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function SavedPage() {
  useDocumentTitle('Saved')
  return <PageHeader title="Saved" subtitle="Coming in a later stage." />
}
