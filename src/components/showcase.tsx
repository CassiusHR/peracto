import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
} from "motion/react";
import { containFocus } from "@/lib/focus";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Layers,
  Boxes,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SectionCorners } from "@/components/section-corners";
import { CONTACT_HREF, type SiteCopy } from "@/i18n/site-copy";

const MORPH_TRANSITION: Transition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

type ShowcaseCard = SiteCopy["services"]["cards"][number];
type A11y = SiteCopy["a11y"];

const ICONS: Record<string, LucideIcon> = {
  agentic: Sparkles,
  forward: Boxes,
  fractional: Layers,
  advisory: Search,
};

export function Showcase({
  copy,
  a11y,
}: {
  copy: SiteCopy["services"];
  a11y: A11y;
}): ReactNode {
  const CARDS = copy.cards;
  const [activeId, setActiveId] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const headingId = useId();
  const closeCard = useCallback(() => setActiveId(null), []);

  const recompute = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector<HTMLElement>("[data-card]");
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0");
    const step = cardWidth + gap;
    if (step <= 0) {
      setPage(0);
      setPageCount(1);
      return;
    }
    const totalScrollable = track.scrollWidth - track.clientWidth;
    const pages = Math.max(1, Math.round(totalScrollable / step) + 1);
    const current = Math.round(track.scrollLeft / step);
    setPageCount(pages);
    setPage(Math.min(pages - 1, Math.max(0, current)));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = (): void => recompute();
    track.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => recompute());
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [recompute]);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeId]);

  const scrollByCards = useCallback((direction: 1 | -1): void => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector<HTMLElement>("[data-card]");
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0");
    track.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, []);

  const activeCard = activeId
    ? (CARDS.find((c) => c.id === activeId) ?? null)
    : null;

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="services"
        aria-labelledby={headingId}
        className="border-border relative border-b"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="lg:border-border flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:border-r lg:px-14 lg:py-24">
            <h2
              id={headingId}
              className="text-foreground text-4xl leading-[1.05] font-medium tracking-tighter sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]"
            >
              {copy.title[0]}
              <br />
              <span className="text-muted-foreground">{copy.title[1]}</span>
            </h2>
            <p className="text-muted-foreground mt-10 max-w-md text-sm leading-relaxed sm:text-base">
              {copy.body}
            </p>
            <div className="mt-10">
              <a
                href={CONTACT_HREF}
                className="focus-ring bg-foreground text-background inline-flex items-center gap-2 rounded-full px-5 py-4 text-xs font-semibold tracking-[0.12em] uppercase transition-opacity hover:opacity-90"
              >
                {copy.cta}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="relative flex flex-col overflow-hidden">
            <div
              ref={trackRef}
              className="flex snap-x snap-mandatory [scrollbar-width:none] items-stretch gap-4 overflow-x-auto scroll-smooth px-6 py-16 [-ms-overflow-style:none] sm:gap-6 sm:px-10 sm:py-20 lg:px-14 lg:py-24 [&::-webkit-scrollbar]:hidden"
            >
              {CARDS.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  hidden={activeId === card.id}
                  onClick={() => setActiveId(card.id)}
                />
              ))}
              <div
                aria-hidden="true"
                className="shrink-0 basis-6 sm:basis-10 lg:basis-14"
              />
            </div>

            <div className="flex items-center justify-center gap-2 px-6 pb-10 sm:px-10 sm:pb-12 lg:px-14 lg:pb-14">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={page === 0}
                aria-label={a11y.previousCard}
                className="focus-ring bg-muted text-foreground inline-flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <div
                role="group"
                aria-label={a11y.cardProgress}
                className="bg-muted flex h-8 items-center gap-2 rounded-full px-4"
              >
                {Array.from({ length: pageCount }).map((_, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                      i === page
                        ? "bg-foreground w-6"
                        : "bg-muted-foreground/40 w-1.5"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={page >= pageCount - 1}
                aria-label={a11y.nextCard}
                className="focus-ring bg-muted text-foreground inline-flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {activeCard ? (
            <ExpandedCard
              key="expanded"
              card={activeCard}
              onClose={closeCard}
              a11y={a11y}
            />
          ) : null}
        </AnimatePresence>
        <SectionCorners />
      </section>
    </MotionConfig>
  );
}

function Card({
  card,
  hidden,
  onClick,
}: {
  card: ShowcaseCard;
  hidden: boolean;
  onClick: () => void;
}): ReactNode {
  const Icon = ICONS[card.id] ?? Sparkles;
  return (
    <motion.button
      type="button"
      data-card
      onClick={onClick}
      layoutId={`card-${card.id}`}
      transition={MORPH_TRANSITION}
      style={{ visibility: hidden ? "hidden" : "visible" }}
      className="focus-ring group bg-muted relative flex aspect-[3/4] w-[280px] shrink-0 cursor-pointer snap-center flex-col justify-between rounded-2xl p-6 text-left sm:w-[320px] sm:p-7 lg:w-[360px] lg:p-8"
    >
      <motion.div
        layoutId={`card-icon-${card.id}`}
        transition={MORPH_TRANSITION}
        className="bg-background/60 text-foreground flex h-11 w-11 items-center justify-center rounded-full"
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </motion.div>
      <div className="space-y-5">
        <motion.h3
          layoutId={`card-title-${card.id}`}
          transition={MORPH_TRANSITION}
          className="text-foreground text-xl leading-tight font-medium tracking-tight whitespace-pre-line sm:text-2xl"
        >
          {card.title}
        </motion.h3>
        <motion.span
          layoutId={`card-plus-${card.id}`}
          aria-hidden="true"
          transition={MORPH_TRANSITION}
          className="bg-background/60 text-foreground inline-flex h-9 w-9 items-center justify-center rounded-full"
        >
          <motion.span
            className="inline-flex"
            animate={{ rotate: 0 }}
            transition={MORPH_TRANSITION}
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </motion.span>
        </motion.span>
      </div>
    </motion.button>
  );
}

function ExpandedCard({
  card,
  onClose,
  a11y,
}: {
  a11y: A11y;
  card: ShowcaseCard;
  onClose: () => void;
}): ReactNode {
  const Icon = ICONS[card.id] ?? Sparkles;
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (dialogRef.current)
      return containFocus(
        dialogRef.current,
        onClose,
        dialogRef.current.querySelector<HTMLButtonElement>("[data-close-card]")
      );
  }, [onClose]);
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-10"
    >
      <motion.button
        type="button"
        aria-label={a11y.close}
        tabIndex={-1}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-background/60 absolute inset-0 cursor-default backdrop-blur-xl"
      />

      <motion.div
        layoutId={`card-${card.id}`}
        transition={MORPH_TRANSITION}
        className="bg-muted relative z-10 flex max-h-[calc(100dvh-3rem)] w-full max-w-[420px] flex-col justify-between overflow-y-auto overscroll-contain rounded-2xl p-8 sm:max-h-[calc(100dvh-5rem)] sm:max-w-2xl sm:p-10 lg:p-12"
      >
        <motion.div
          layoutId={`card-icon-${card.id}`}
          transition={MORPH_TRANSITION}
          className="bg-background/60 text-foreground flex h-11 w-11 items-center justify-center rounded-full"
        >
          <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </motion.div>

        <div className="mt-8 space-y-6 sm:mt-12">
          <motion.h3
            id={titleId}
            layoutId={`card-title-${card.id}`}
            transition={MORPH_TRANSITION}
            className="text-foreground text-2xl leading-tight font-medium tracking-tight whitespace-pre-line sm:text-3xl lg:text-4xl"
          >
            {card.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{
              duration: 0.35,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-muted-foreground max-w-prose text-sm leading-relaxed sm:text-base"
          >
            {card.body}
          </motion.p>
          <motion.button
            data-close-card
            type="button"
            onClick={onClose}
            layoutId={`card-plus-${card.id}`}
            transition={MORPH_TRANSITION}
            aria-label={a11y.closeCard}
            className="focus-ring bg-background/60 text-foreground inline-flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80"
          >
            <motion.span
              className="inline-flex"
              animate={{ rotate: 45 }}
              transition={MORPH_TRANSITION}
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            </motion.span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
