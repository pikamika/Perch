import { PageHeader } from '../components/layout/PageHeader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function RestaurantPage() {
  useDocumentTitle('Restaurant')
  return <PageHeader title="Restaurant" subtitle="Coming in a later stage." />
}
