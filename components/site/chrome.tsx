import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { components } from "@/lib/registry";
import { ThemeToggle } from "@/registry/gear5/ui/theme-toggle";
import { SiteCommandPalette } from "./site-command-palette";

const FOOTER_COLUMNS = [
  {
    heading: "Library",
    links: [
      { label: "All components", href: "/components" },
      { label: "Getting started", href: "/getting-started" },
      { label: "Machine-readable index", href: "/r/index.json" },
      { label: "Agent index (llms.txt)", href: "/llms.txt" },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "Source on GitHub", href: siteConfig.repo },
      { label: "Contributing", href: `${siteConfig.repo}/blob/main/CONTRIBUTING.md` },
      { label: "Security policy", href: `${siteConfig.repo}/blob/main/SECURITY.md` },
    ],
  },
  {
    heading: "Standards",
    links: [
      { label: "Code of conduct", href: `${siteConfig.repo}/blob/main/CODE_OF_CONDUCT.md` },
      { label: "MIT licence", href: `${siteConfig.repo}/blob/main/LICENSE` },
    ],
  },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/75 backdrop-blur-xl">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 text-body sm:gap-x-5 sm:px-6"
      >
        <Link
          href="/"
          className="flex h-10 items-center rounded-md transition-opacity hover:opacity-80"
          aria-label={siteConfig.name}
        >
          <Image src="/logo.svg" alt="" width={84} height={34} priority className="brightness-0 dark:brightness-100" />
        </Link>

        <div className="order-last flex w-full gap-6 border-t border-hairline pt-3 text-sm font-medium text-smoke sm:order-none sm:w-auto sm:border-0 sm:pt-0">
          <Link href="/components" className="transition-colors hover:text-cream">Components</Link>
          <Link href="/getting-started" className="transition-colors hover:text-cream">Get started</Link>
        </div>

        <div className="ms-auto">
          <SiteCommandPalette
            items={components.map((item) => ({
              name: item.name,
              title: item.title,
              category: item.category ?? "Components",
            }))}
          />
        </div>

        <a
          href={siteConfig.repo}
          className="hidden rounded-md border border-hairline px-3 py-1.5 text-sm font-medium text-cream transition-colors hover:border-cream/40 hover:bg-cream/10 lg:block"
        >
          GitHub
        </a>

        <ThemeToggle defaultTheme="dark" />
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-anvil text-cream">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading} className="flex flex-col gap-3">
              <h2 className="text-body-sm font-bold">{column.heading}</h2>

              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-body-sm text-smoke underline-offset-4 transition-colors hover:text-cream hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 text-body-sm text-smoke">
            <p>{siteConfig.name} is MIT licensed.</p>
            <p>System fonts. No analytics. No account required.</p>
          </div>
          <div className="flex items-center gap-4 text-smoke">
            <a
              href={siteConfig.repo}
              className="transition-colors hover:text-cream"
              aria-label="GitHub"
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
