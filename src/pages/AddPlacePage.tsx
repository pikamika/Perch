import { useState } from 'react'
import { AddPlaceForm } from '../components/add/AddPlaceForm'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, ButtonLink } from '../components/ui/Button'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function AddPlacePage() {
  useDocumentTitle('Add a place')
  const [savedName, setSavedName] = useState<string | null>(null)

  return (
    <div className="md:mx-auto md:max-w-lg">
      <PageHeader title="Add a place" subtitle="Found something on your feed? Save it before it disappears." />

      {savedName ? (
        <div role="status" className="rounded-card bg-surface p-6 text-center shadow-card">
          <p aria-hidden="true" className="text-4xl">
            🎉
          </p>
          <h2 className="mt-2 font-display text-title">Saved!</h2>
          <p className="mt-1 text-ink-muted">{savedName} is on your list.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/saved">View saved</ButtonLink>
            <Button variant="secondary" onClick={() => setSavedName(null)}>
              Add another
            </Button>
          </div>
        </div>
      ) : (
        <AddPlaceForm onSaved={setSavedName} />
      )}
    </div>
  )
}
