import { LoadingStatus } from '../ui/LoadingStatus'
import { Skeleton } from '../ui/Skeleton'

export function RowSkeleton({ label = 'Loading picks' }: { label?: string }) {
  return (
    <LoadingStatus label={label}>
      <Skeleton className="mb-3 h-7 w-1/2" />
      <div className="-mx-gutter flex gap-4 overflow-hidden px-gutter">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-[15rem] shrink-0 md:w-[17rem]">
            <Skeleton className="aspect-[4/3] w-full rounded-photo" />
            <Skeleton className="mt-2 h-5 w-3/4" />
            <Skeleton className="mt-1 h-4 w-1/2" />
          </div>
        ))}
      </div>
    </LoadingStatus>
  )
}
