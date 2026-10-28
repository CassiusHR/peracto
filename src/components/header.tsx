import { Menu, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { containFocus } from "@/lib/focus";
import {
  CONTACT_EMAIL,
  CONTACT_HREF,
  getCopy,
  homePath,
  otherLang,
  type Lang,
  type SiteCopy,
} from "@/i18n/site-copy";

function getLinks(t: SiteCopy) {
  const primary = [
    { label: t.nav.services, href: "#services" },
    { label: t.nav.approach, href: "#approach" },
    { label: t.nav.faq, href: "#faq" },
  ];
  return {
    primary,
    mobile: [{ label: t.nav.home, href: "#main-content" }, ...primary],
    utility: [
      { label: t.nav.contact, href: "#contact" },
      { label: CONTACT_EMAIL, href: CONTACT_HREF },
    ],
  };
}

function Logo({ label }: { label: string }): ReactNode {
  return (
    <a
      href="#main-content"
      className="focus-ring enter text-foreground inline-flex items-center gap-2.5 rounded-sm"
      aria-label={label}
    >
      <img
        src="/peracto-icon.svg"
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 shrink-0 dark:invert"
        aria-hidden="true"
      />
      <img
        src="/peractoname1.svg"
        alt="Peracto"
        width={83}
        height={20}
        className="h-5 w-auto shrink-0 dark:invert"
      />
    </a>
  );
}

export function Header({ lang }: { lang: Lang }): ReactNode {
  const t = getCopy(lang);
  const links = getLinks(t);
  const altLang = otherLang(lang);
  const altCopy = getCopy(altLang);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = (): void => setIsOpen(false);
  const followLink = (event: MouseEvent<HTMLAnchorElement>): void => {
    closeMenu();
    const href = event.currentTarget.getAttribute("href");
    if (href?.startsWith("#")) {
      requestAnimationFrame(() => {
        const target = document.getElementById(href.slice(1));
        target?.setAttribute("tabindex", "-1");
        target?.focus({ preventScroll: true });
      });
    }
  };

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("nav-open");
    const restoreFocus = headerRef.current
      ? containFocus(
          headerRef.current,
          closeMenu,
          menuRef.current?.querySelector("a")
        )
      : undefined;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (desktop.matches) closeMenu();
    };
    desktop.addEventListener("change", onResize);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove("nav-open");
      desktop.removeEventListener("change", onResize);
      restoreFocus?.();
    };
  }, [isOpen]);

  return (
    <header
      ref={headerRef}
      className="border-border bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-50 border-b backdrop-blur"
    >
      <span
        aria-hidden="true"
        className="border-border bg-background pointer-events-none absolute bottom-0 left-0 z-10 h-[7px] w-[7px] -translate-x-1/2 translate-y-1/2 border"
      />
      <span
        aria-hidden="true"
        className="border-border bg-background pointer-events-none absolute right-0 bottom-0 z-10 h-[7px] w-[7px] translate-x-1/2 translate-y-1/2 border"
      />

      <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Logo label={t.a11y.home} />

        <nav
          className={`hidden rounded-full px-2 py-1.5 transition-[background-color] duration-300 ease-out lg:ml-12 lg:flex lg:items-center lg:gap-1 ${
            isScrolled ? "bg-transparent" : "bg-muted"
          }`}
          aria-label={t.a11y.primaryNav}
        >
          {links.primary.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              style={{ ["--enter-delay" as string]: `${80 + i * 60}ms` }}
              className="focus-ring enter text-foreground hover:text-muted-foreground rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <a
            href={homePath[altLang]}
            hrefLang={altLang}
            lang={altLang}
            aria-label={altCopy.nav.switchLabel}
            style={{ ["--enter-delay" as string]: "260ms" }}
            className="focus-ring enter text-foreground hover:text-muted-foreground rounded-full px-2 py-1.5 font-mono text-xs font-medium tracking-[0.12em] transition-colors"
          >
            {t.nav.switchShort}
          </a>
          <a
            href={CONTACT_HREF}
            style={{ ["--enter-delay" as string]: "320ms" }}
            className={`focus-ring enter text-foreground hover:text-muted-foreground rounded-full px-5 py-2.5 text-sm font-medium transition-[background-color] duration-300 ease-out ${
              isScrolled ? "bg-transparent" : "bg-muted hover:bg-border"
            }`}
          >
            {t.nav.cta}
          </a>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <a
            href={CONTACT_HREF}
            style={{ ["--enter-delay" as string]: "120ms" }}
            className="focus-ring enter bg-muted text-foreground hover:bg-border rounded-full px-4 py-2 text-sm font-medium transition-colors"
          >
            {t.nav.cta}
          </a>
          <button
            type="button"
            style={{ ["--enter-delay" as string]: "180ms" }}
            className="focus-ring enter bg-muted text-foreground hover:bg-border inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            aria-label={isOpen ? t.a11y.closeMenu : t.a11y.openMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? (
              <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        ref={menuRef}
        inert={!isOpen}
        aria-hidden={!isOpen}
        className={`border-border bg-background fixed inset-x-0 top-16 z-40 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t transition-opacity duration-200 sm:top-20 sm:h-[calc(100dvh-5rem)] lg:hidden ${
          isOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div className="min-h-[calc(100dvh-4rem)] px-4 pt-16 sm:min-h-[calc(100dvh-5rem)] sm:px-6 sm:pt-20">
          <nav aria-label={t.a11y.mobileNav}>
            <ul className="space-y-2">
              {links.mobile.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="focus-ring text-foreground hover:text-muted-foreground block rounded-lg text-4xl leading-tight font-normal tracking-[-0.04em] transition-colors sm:text-5xl"
                    onClick={followLink}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-12 flex flex-col items-start gap-2 pb-10">
            <p className="text-muted-foreground text-base font-medium tracking-[-0.02em]">
              Peracto
            </p>
            {links.utility.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="focus-ring text-foreground hover:text-muted-foreground rounded-md text-base font-normal transition-colors"
                onClick={followLink}
              >
                {link.label}
              </a>
            ))}
            <a
              href={homePath[altLang]}
              hrefLang={altLang}
              lang={altLang}
              className="focus-ring text-foreground hover:text-muted-foreground mt-4 rounded-md text-base font-normal transition-colors"
            >
              {altCopy.nav.switchLabel}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
