import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface WeatherAnimationProps {
  condition?: string;
}

export function WeatherAnimation({ condition }: WeatherAnimationProps) {
  const key = (condition ?? "").toLowerCase();

  if (key.includes("clear")) return <SunAnimation />;
  if (key.includes("rain") || key.includes("drizzle")) return <RainAnimation />;
  if (key.includes("cloud")) return <CloudsAnimation />;
  return null;
}

function SunAnimation() {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    return {
      x1: 100 + Math.cos(angle) * 60,
      y1: 100 + Math.sin(angle) * 60,
      x2: 100 + Math.cos(angle) * 92,
      y2: 100 + Math.sin(angle) * 92
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-[8%] top-[8%] h-56 w-56 sm:h-72 sm:w-72 md:h-80 md:w-80">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(253,224,71,0.55),rgba(253,186,116,0.25)_40%,transparent_70%)] animate-sun-pulse" />
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-sun-spin">
          <g stroke="rgba(253,224,71,0.7)" strokeWidth="3" strokeLinecap="round">
            {rays.map((r, i) => (
              <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
            ))}
          </g>
        </svg>
        <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-yellow-200 to-orange-400 shadow-[0_0_60px_rgba(253,224,71,0.65)]" />
      </div>
    </div>
  );
}

function CloudsAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Cloud className="top-[8%] h-20 w-44 opacity-80 animate-cloud-slow sm:h-24 sm:w-56" />
      <Cloud className="top-[22%] h-14 w-32 opacity-55 animate-cloud-fast sm:h-16 sm:w-40" />
      <Cloud className="top-[42%] h-24 w-52 opacity-70 animate-cloud-medium sm:h-28 sm:w-64" />
      <Cloud className="top-[62%] h-16 w-40 opacity-45 animate-cloud-slow sm:h-20 sm:w-48" />
    </div>
  );
}

function RainAnimation() {
  const drops = useMemo(
    () =>
      Array.from({ length: 50 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.7 + Math.random() * 0.6,
        opacity: 0.4 + Math.random() * 0.5
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Cloud className="top-[6%] h-24 w-52 opacity-85 animate-cloud-slow sm:h-28 sm:w-64" />
      <Cloud className="top-[18%] h-20 w-44 opacity-70 animate-cloud-medium sm:h-24 sm:w-56" />
      <Cloud className="top-[2%] right-0 h-24 w-52 opacity-75 animate-cloud-fast sm:h-28 sm:w-60" />
      <div className="absolute inset-0">
        {drops.map((d, i) => (
          <span
            key={i}
            className="absolute top-[-10%] block h-6 w-[2px] rounded-full bg-gradient-to-b from-transparent via-cyan-100/70 to-cyan-200 animate-rain-fall"
            style={{
              left: `${d.left}%`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
              opacity: d.opacity
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid meet"
      className={cn("absolute -left-[20%] fill-white/85 drop-shadow-[0_4px_18px_rgba(255,255,255,0.18)]", className)}
    >
      <ellipse cx="50" cy="62" rx="30" ry="24" />
      <ellipse cx="82" cy="50" rx="36" ry="30" />
      <ellipse cx="122" cy="55" rx="40" ry="32" />
      <ellipse cx="158" cy="64" rx="28" ry="22" />
    </svg>
  );
}
