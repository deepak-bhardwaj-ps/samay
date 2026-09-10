import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, CircleDot, SlidersHorizontal, ArrowUpRight } from "lucide-react";

const navigation = [
  { to: "/", label: "Today", icon: CircleDot },
  { to: "/units", label: "Learn", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: SlidersHorizontal },
] as const;

export function Header() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  return (
    <>
      <header className="app-header">
        <Link to="/" className="wordmark" aria-label="Samay home">
          <span lang="sa">समय</span>samay<span className="wordmark-dot">.</span>
        </Link>
        <span className="brand-caption">A different way to be in time</span>
        <Link to="/about" className="about-link">
          The philosophy <ArrowUpRight size={15} />
        </Link>
      </header>
      <nav className="app-navigation" aria-label="Main navigation">
        {navigation.map(({ to, label, icon: Icon }) => {
          const active = path === to || (to === "/units" && path === "/about");
          return (
            <Link
              key={to}
              to={to}
              className={active ? "is-active" : ""}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={21} strokeWidth={1.65} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
