import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-10">
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((key) => (
          <Card key={key} className="p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <Skeleton className="mt-6 h-8 w-3/4" />
            <Skeleton className="mt-4 h-10 w-full" />
            <Skeleton className="mt-4 h-4 w-full" />
          </Card>
        ))}
      </div>
      <TransactionsSkeleton />
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-11 w-full rounded-xl" />
      {[0, 1, 2, 3].map((key) => (
        <Skeleton key={key} className="h-[4.5rem] w-full rounded-2xl" />
      ))}
    </div>
  );
}
