import { LoadingStatus } from '../ui/LoadingStatus'
import { Skeleton } from '../ui/Skeleton'

export function CafeSkeleton() {
  return (
    <LoadingStatus label="Loading cafe">
      <div className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-8">
        <Skeleton className="aspect-[4/3] w-full rounded-card" />
        <div className="mt-5 space-y-4 lg:mt-0">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </LoadingStatus>
  )
}
