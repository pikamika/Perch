import { LoadingStatus } from '../ui/LoadingStatus'
import { Skeleton } from '../ui/Skeleton'

export function SavedSkeleton() {
  return (
    <LoadingStatus label="Loading your saved places">
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-card bg-surface p-3 shadow-card">
            <Skeleton className="h-20 w-20 shrink-0 rounded-photo" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </LoadingStatus>
  )
}
