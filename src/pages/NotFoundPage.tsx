import { ButtonLink } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <EmptyState
      title="Page not found"
      description="That page does not exist. Head back and pick a spot."
      action={<ButtonLink to="/">Back to Discover</ButtonLink>}
    />
  )
}
