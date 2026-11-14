import type { ReactNode } from "react";

/** Shared page frame: sticky top bar, centered content column, subtle footer. */
export function AppShell({
  title,
  logo,
  actions,
  children,
  footer,
  maxWidth = "max-w-3xl",
}: {
  title: ReactNode;
  logo?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="flex min-h-dvh flex-col" dir="ltr">
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className={`mx-auto flex w-full ${maxWidth} items-center justify-between gap-3 px-4 py-3`}>
          <div className="flex min-w-0 items-center gap-2.5">
            {logo}
            <h1 className="truncate text-base font-bold text-zinc-100">{title}</h1>
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
      </header>
      <main className={`mx-auto w-full ${maxWidth} flex-1 px-4 py-5`}>{children}</main>
      <footer className="border-t border-zinc-800/60 px-4 py-3 text-center text-xs text-zinc-500">
        {footer ?? "Built with Pollinations"}
      </footer>
    </div>
  );
}
