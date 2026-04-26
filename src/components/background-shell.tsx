import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { getWeatherTheme } from "@/lib/weather";

interface BackgroundShellProps extends PropsWithChildren {
  condition?: string;
}

export function BackgroundShell({ condition, children }: BackgroundShellProps) {
  const gradient = getWeatherTheme(condition ?? "default");

  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-gradient-to-br", gradient)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_42%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center px-4 py-10 sm:py-16">
        {children}
      </div>
    </div>
  );
}