export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/60 bg-background/50 py-8 text-center">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm text-muted-foreground">
          {year} · Muhūrta Clock · Ancient timekeeping for modern life
        </p>
        <p className="mt-2 text-xs text-muted-foreground/70">
          Times are calculated from local sunrise and sunset. Traditions vary by region and lineage.
        </p>
      </div>
    </footer>
  );
}
