import type { PropsWithChildren } from "react";
import { getWeatherImage } from "@/lib/weather";

interface BackgroundShellProps extends PropsWithChildren {
  condition?: string;
}

export function BackgroundShell({ condition, children }: BackgroundShellProps) {
  const imageUrl = getWeatherImage(condition);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <img
        key={imageUrl}
        src={imageUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full animate-bg-fade object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950/85" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center px-4 py-10 sm:py-16">
        {children}
      </div>
    </div>
  );
}
