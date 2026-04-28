import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function UserMenu() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/70 px-3 py-2 backdrop-blur">
      <div className="flex flex-col text-right text-xs">
        <span className="text-muted-foreground">Giris yapildi</span>
        <span className="max-w-[200px] truncate text-foreground" title={user?.email ?? ""}>
          {user?.email ?? "Bilinmeyen"}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut()}
        aria-label="Cikis yap"
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Cikis
      </Button>
    </div>
  );
}
