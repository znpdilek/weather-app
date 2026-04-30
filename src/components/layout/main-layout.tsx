import { ChevronLeft, ChevronRight, CloudSun, Map, Menu } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const base =
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary";
  const active = "bg-secondary text-primary";
  return (
    <SidebarGroup className="gap-1">
      <NavLink to="/" end onClick={onNavigate} className={({ isActive }) => cn(base, isActive && active)}>
        <CloudSun className="h-4 w-4" />
        Ana sayfa
      </NavLink>
      <NavLink to="/map" onClick={onNavigate} className={({ isActive }) => cn(base, isActive && active)}>
        <Map className="h-4 w-4" />
        Harita gorunumu
      </NavLink>
    </SidebarGroup>
  );
}

export function MainLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar
        className={cn(
          "hidden shrink-0 border-r border-border bg-card/95 backdrop-blur transition-[width,opacity,padding] duration-300 ease-out md:flex md:flex-col md:overflow-hidden md:border-r md:py-6",
          desktopSidebarOpen ? "md:w-[14.5rem] md:opacity-100" : "md:w-0 md:min-w-0 md:border-none md:p-0 md:opacity-0"
        )}
      >
        <SidebarHeader className={cn(!desktopSidebarOpen && "hidden")}>
          <div className="flex items-center gap-2 px-1">
            <div className="rounded-lg border border-border/70 bg-secondary/80 p-1.5">
              <CloudSun className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-semibold">Weather App</span>
          </div>
        </SidebarHeader>
        <Separator className={cn("my-3", !desktopSidebarOpen && "hidden")} />
        <SidebarContent className={cn(!desktopSidebarOpen && "hidden")}>
          <NavLinks />
        </SidebarContent>
      </Sidebar>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              aria-expanded={desktopSidebarOpen}
              aria-label={desktopSidebarOpen ? "Yan menuyu kapat" : "Yan menuyu ac"}
              onClick={() => setDesktopSidebarOpen((o) => !o)}
            >
              {desktopSidebarOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-6 pt-10">
                <div className="mb-4 flex items-center gap-2">
                  <CloudSun className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Weather App</span>
                </div>
                <Separator className="mb-4" />
                <NavLinks onNavigate={() => setMobileNavOpen(false)} />
              </SheetContent>
            </Sheet>
            <NavLink to="/" className="hidden font-semibold sm:inline md:hidden">
              Modern Weather App
            </NavLink>
          </div>
          <UserMenu />
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
