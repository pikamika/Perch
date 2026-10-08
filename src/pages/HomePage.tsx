import { PageHeader } from '../components/layout/PageHeader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function HomePage() {
  useDocumentTitle('Home')
  return <PageHeader title="Home" subtitle="Coming in a later stage." />
}
