import { AlertTriangle, LoaderCircle, Search } from "lucide-react";

interface StatusStateProps {
  type: "idle" | "loading" | "error";
  message?: string;
}

export function StatusState({ type, message }: StatusStateProps) {
  if (type === "loading") {
    return (
      <div className="flex w-full max-w-xl items-center justify-center gap-3 rounded-xl border border-border/70 bg-card/80 p-8 text-muted-foreground">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        <span>Hava durumu verisi yukleniyor...</span>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-100">
        <AlertTriangle className="h-5 w-5" />
        <p>{message ?? "Bir hata olustu."}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-2 rounded-xl border border-border/70 bg-card/70 p-10 text-center">
      <Search className="h-8 w-8 text-muted-foreground" />
      <p className="text-muted-foreground">Baslamak icin bir sehir ara.</p>
    </div>
  );
}