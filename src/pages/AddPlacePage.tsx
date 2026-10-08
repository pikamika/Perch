import { PageHeader } from '../components/layout/PageHeader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function AddPlacePage() {
  useDocumentTitle('Add')
  return <PageHeader title="Add" subtitle="Coming in a later stage." />
}
