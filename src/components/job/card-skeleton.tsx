import { Skeleton } from "@/components/ui/skeleton";

export const JobCardSkeleton = () => (
  <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex gap-4 mt-3">
        <Skeleton className="h-16 w-16 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>

    <div className="flex gap-2 ml-20 mb-3">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>

   
  </div>
);
