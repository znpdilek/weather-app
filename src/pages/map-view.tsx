import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

const MapExplorer = lazy(() => import("@/components/map-explorer"));

export function MapViewPage() {
  return (
    <div className="flex flex-1 flex-col bg-secondary/15 p-2 md:p-4">
 
      <Suspense
        fallback={
          <div className="flex min-h-[min(720px,calc(100dvh-4.5rem))] flex-1 flex-col items-center justify-center rounded-lg border border-border/50 bg-secondary/25">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Harita bilesenleri yukleniyor...</p>
          </div>
        }
      >
        <MapExplorer />
      </Suspense>
    </div>
  );
}
