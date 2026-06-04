import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { SectionCorners } from "@/components/section-corners";

const PANEL_TRANSITION: Transition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1],
};

const CHEVRON_TRANSITION: Transition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
};

type FAQ = {
  q: string;
  a: ReadonlyArray<string>;
};

const FAQS: ReadonlyArray<FAQ> = [
  {
    q: "What exactly does Frame give me on day one?",
    a: [
      "Frame is a wireframe-stage scaffold for product teams. The repo boots a working app with routing, layout primitives, theming, and a set of intentionally generic component placeholders already in place — so the first feature you ship doesn't start from a blank canvas. Brand, content, and product details are meant to be overwritten at your own pace.",
    ],
  },
  {
    q: "How do I start a project from Frame?",
    a: [
      "Clone the repo, install with your preferred package manager, and run the dev server. There's no install wizard, no setup script, and no required environment variables for the default routes. Most teams have a working local app within a few minutes.",
    ],
  },
  {
    q: "Is Frame opinionated about my stack?",
    a: [
      "Frame uses Next.js, Tailwind, and TypeScript out of the box, but it doesn't introduce custom abstractions on top of them. If your team already uses these tools, the conventions will look familiar. If you migrate off any one of them later, the rest of the scaffold is still useful.",
    ],
  },
  {
    q: "Can I use Frame for client work?",
    a: [
      "Yes. Frame is licensed for unlimited commercial projects (you just can't resell the template itself), and intentionally easy to strip back to a minimal starting point. Teams use it as the first commit on internal tools, marketing sites, and early-stage product builds — anywhere the goal is to put structure in place before brand and copy land.",
    ],
  },
  {
    q: "How does Frame handle theming and dark mode?",
    a: [
      "Theme tokens live in CSS variables and are wired through Tailwind's theme inline mapping. A floating theme switch toggles between light and dark; reduced-motion preferences and color-scheme metadata are honored automatically. Replace the token values with your brand palette and the rest of the system follows.",
    ],
  },
  {
    q: "What's missing on purpose?",
    a: [
      "Frame intentionally omits anything that would couple it to a specific product: forms libraries, state managers, auth, analytics, and CMS integrations are not pre-wired. The structure is opinionated; the runtime behavior is not. Drop in whatever your team prefers.",
    ],
  },
  {
    q: "Will I outgrow Frame?",
    a: [
      "That's the goal. Frame is meant to be torn out incrementally as your real design system, content model, and feature surface arrive. Most teams replace components piece by piece rather than all at once — by the time the scaffold is gone, the structure underneath has already paid for itself.",
    ],
  },
];

export function Faq(): ReactNode {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="relative border-b border-border p-6 sm:p-10 lg:p-14"
    >
      <h2
        id={headingId}
        className="text-3xl font-medium leading-[1.05] tracking-tighter text-foreground sm:text-4xl lg:text-[3.5rem]"
      >
        FAQs
      </h2>

      <div className="mt-6 border-t border-border sm:mt-10 lg:mt-14">
        <ul className="divide-y divide-border">
          {FAQS.map((faq, i) => (
            <FaqRow
              key={faq.q}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((prev) => (prev === i ? -1 : i))}
            />
          ))}
        </ul>
      </div>
      <SectionCorners />
    </section>
  );
}

function FaqRow({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}): ReactNode {
  const triggerId = useId();
  const panelId = useId();

  return (
    <li>
      <button
        id={triggerId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="focus-ring flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left sm:py-7"
      >
        <span className="text-base font-medium leading-snug tracking-tight text-foreground sm:text-lg">
          {faq.q}
        </span>

        {/* Chevron capsule. Cross-fades two background layers so the closed
         * state shows a filled muted chip and the open state shows a hairline
         * border ring. Animating the layers' opacities sidesteps Motion's
         * inability to interpolate between CSS-variable colors. */}
        <motion.span
          aria-hidden="true"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={CHEVRON_TRANSITION}
          className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center text-foreground"
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-muted"
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={CHEVRON_TRANSITION}
          />
          <motion.span
            className="absolute inset-0 rounded-full border border-border"
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={CHEVRON_TRANSITION}
          />
          <ChevronDown className="relative h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={PANEL_TRANSITION}
            style={{ overflow: "hidden" }}
          >
            <motion.div
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={PANEL_TRANSITION}
              className="max-w-3xl space-y-4 pb-7 pr-12 text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              {faq.a.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </li>
  );
}
