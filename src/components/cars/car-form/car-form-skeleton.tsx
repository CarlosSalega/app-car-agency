import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CarFormSkeleton() {
  return (
    <Card className="mx-auto max-w-[920px] py-6">
      <CardHeader>
        <div className="bg-muted h-8 w-48 animate-pulse rounded" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="bg-muted h-4 w-24 animate-pulse rounded" />
          <div className="bg-muted h-10 w-full animate-pulse rounded" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            <div className="bg-muted h-10 w-full animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            <div className="bg-muted h-4 w-24 animate-pulse rounded" />
            <div className="bg-muted h-10 w-full animate-pulse rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
            <div className="bg-muted h-10 w-full animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            <div className="bg-muted h-10 w-full animate-pulse rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="bg-muted h-4 w-12 animate-pulse rounded" />
            <div className="bg-muted h-10 w-full animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
            <div className="bg-muted h-10 w-full animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            <div className="bg-muted h-10 w-full animate-pulse rounded" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="bg-muted h-4 w-16 animate-pulse rounded" />
          <div className="bg-muted h-10 w-full animate-pulse rounded" />
        </div>

        <div className="space-y-2">
          <div className="bg-muted h-4 w-20 animate-pulse rounded" />
          <div className="bg-muted h-32 w-full animate-pulse rounded" />
        </div>

        <div className="space-y-2">
          <div className="bg-muted h-4 w-12 animate-pulse rounded" />
          <div className="bg-muted h-24 w-full animate-pulse rounded" />
        </div>

        <div className="space-y-2">
          <div className="bg-muted h-4 w-8 animate-pulse rounded" />
          <div className="bg-muted h-20 w-full animate-pulse rounded" />
        </div>

        <div className="flex gap-4">
          <div className="bg-muted h-10 w-32 animate-pulse rounded" />
          <div className="bg-muted h-10 w-24 animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
