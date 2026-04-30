import * as React from "react";
import { cn } from "@/lib/utils";

const Sidebar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(({ className, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn(
      "flex w-[14.5rem] shrink-0 flex-col border-r border-border bg-card/95 py-6 backdrop-blur md:sticky md:top-0 md:h-screen",
      className
    )}
    {...props}
  />
));
Sidebar.displayName = "Sidebar";

function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 pb-2", className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-1 flex-col gap-2 px-2", className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 py-2", className)} {...props} />;
}

export { Sidebar, SidebarHeader, SidebarContent, SidebarGroup };
