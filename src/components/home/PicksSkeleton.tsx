import { LoadingStatus } from '../ui/LoadingStatus'
import { Skeleton } from '../ui/Skeleton'

export function PicksSkeleton() {
  return (
    <LoadingStatus label="Finding your picks">
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="overflow-hidden rounded-card bg-surface shadow-card">
            <Skeleton className="aspect-[16/9] w-full rounded-none md:aspect-[4/3]" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </LoadingStatus>
  )
}
