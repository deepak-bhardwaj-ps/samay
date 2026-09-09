import { Link, useRouterState } from "@tanstack/react-router";
import { Clock, BookOpen, Settings, Info } from "lucide-react";

const navItems = [
  { to: "/", label: "Clock", icon: Clock },
  { to: "/about", label: "About", icon: Info },
  { to: "/units", label: "Units", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="app-header sticky top-0 z-50 w-full border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
        >
          <span className="brand-mark flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
            मु
          </span>
          <span className="font-display text-xl tracking-wide text-foreground">Muhūrta</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all
                  ${isActive ? "nav-active text-primary-foreground" : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"}
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-primary sm:hidden" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
