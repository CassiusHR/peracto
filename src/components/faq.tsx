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
    q: "What do you mean by agentic development?",
    a: [
      "We use AI agents in the development process, with engineering review and validation. We can also build agents that operate within your business workflows. We define which capability your project needs before agreeing on scope.",
    ],
  },
  {
    q: "Can you work with our existing team?",
    a: [
      "Yes. Through Forward Deployed Engineering, we work within your context, coordinate responsibilities, and build alongside your team. The time commitment and working arrangement are agreed for each engagement.",
    ],
  },
  {
    q: "How is a fractional CTO or CPO different from an advisor?",
    a: [
      "A fractional CTO or CPO takes on an ongoing leadership mandate. An advisor provides analysis and recommendations to the people who retain that responsibility. Technology and product leadership can be scoped separately.",
    ],
  },
  {
    q: "Do we need a fully defined project?",
    a: [
      "We can start by clarifying the problem, priorities, and constraints. That gives us a basis for proposing the scope and the right way to work together.",
    ],
  },
  {
    q: "How do you use AI responsibly in delivery?",
    a: [
      "We agree on data boundaries, access, and tool use before the work begins. AI-assisted deliverables are reviewed and validated, and agents are evaluated against the permissions and acceptance criteria defined for the project.",
    ],
  },
  {
    q: "How is an engagement priced?",
    a: [
      "Pricing depends on scope, commitment, and responsibility. The proposal defines deliverables, terms, and acceptance criteria before work begins.",
    ],
  },
  {
    q: "What happens after delivery?",
    a: [
      "We agree on whether the work continues with our support or transfers to your team. Documentation, operation, and ongoing support are defined in the engagement scope.",
    ],
  },
];

export function Faq(): ReactNode {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const headingId = useId();

  return (
    <section
      id="faq"
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
