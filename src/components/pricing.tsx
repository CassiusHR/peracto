import { DitherShader } from "@/components/dither-shader";
import { SectionCorners } from "@/components/section-corners";
import { Check } from "lucide-react";
import { useTheme } from "@/lib/use-theme";
import { useId, useState, type ReactNode } from "react";

type Tier = {
  id: string;
  name: string;
  tagline: string;
  format: string;
  detail: string;
  outcomes: ReadonlyArray<string>;
  cta: { label: string; href: string };
  features: ReadonlyArray<string>;
  featured: boolean;
};

const TIERS: ReadonlyArray<Tier> = [
  {
    id: "assess",
    name: "Assess",
    format: "Clarity",
    detail: "Before you commit",
    tagline: "Understand the problem and define a practical next step.",
    cta: { label: "Discuss an assessment", href: "mailto:contacto@perac.to" },
    features: [
      "Workflow and systems review",
      "Technical and product priorities",
      "Scope and success criteria",
    ],
    outcomes: [
      "Current-state assessment",
      "Prioritized recommendations",
      "A roadmap for the next engagement",
    ],
    featured: false,
  },
  {
    id: "build",
    name: "Build",
    format: "Delivery",
    detail: "With an agreed scope",
    tagline: "Build a product or embed engineering in your operation.",
    cta: { label: "Discuss a build", href: "mailto:contacto@perac.to" },
    features: [
      "Agentic product development",
      "Forward Deployed Engineering",
      "Integration and validation",
    ],
    outcomes: [
      "Working software and integrations",
      "Tests and acceptance checks",
      "Documentation and knowledge transfer",
    ],
    featured: true,
  },
  {
    id: "lead",
    name: "Lead",
    format: "Direction",
    detail: "With a defined mandate",
    tagline: "Bring technology and product judgment into your leadership team.",
    cta: { label: "Discuss leadership", href: "mailto:contacto@perac.to" },
    features: [
      "Fractional CTO or CPO",
      "Executive advisory",
      "Agreed commitment and ownership",
    ],
    outcomes: [
      "Technology or product strategy",
      "Clear priorities and decision ownership",
      "An agreed review and planning rhythm",
    ],
    featured: false,
  },
];

type DetailView = "scope" | "deliverables";

export function Pricing(): ReactNode {
  const [view, setView] = useState<DetailView>("scope");
  const headingId = useId();

  return (
    <section
      id="engagements"
      aria-labelledby={headingId}
      className="relative border-b border-border p-6 sm:p-10 lg:p-14"
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h2
            id={headingId}
            className="text-2xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-3xl lg:text-[2.5rem]"
          >
            A starting point for your next move.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Start with an assessment, a build, or a leadership mandate. Scope,
            commitment, and fees are agreed around your needs.
          </p>
        </div>

        <DetailToggle value={view} onChange={setView} />
      </div>

      <div className="relative mt-12 grid grid-cols-1 gap-4 lg:mt-16 lg:grid-cols-3 lg:gap-6">
        {TIERS.map((tier) => (
          <PricingCard key={tier.id} tier={tier} view={view} />
        ))}
      </div>
      <SectionCorners />
    </section>
  );
}

function DetailToggle({
  value,
  onChange,
}: {
  value: DetailView;
  onChange: (next: DetailView) => void;
}): ReactNode {
  const showDeliverables = value === "deliverables";
  return (
    <div
      role="radiogroup"
      aria-label="Engagement details"
      className="inline-flex items-center gap-4"
    >
      <div className="relative inline-grid h-10 grid-cols-2 items-center rounded-full bg-muted p-1">
        <span
          aria-hidden="true"
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-foreground transition-transform duration-300 ease-out ${
            showDeliverables ? "translate-x-full" : "translate-x-0"
          }`}
        />
        {(["scope", "deliverables"] as const).map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option)}
              className={`focus-ring relative z-10 inline-flex h-8 items-center justify-center rounded-full px-4 font-mono text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
                active
                  ? "text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option === "scope" ? "Scope" : "Deliverables"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PricingCard({
  tier,
  view,
}: {
  tier: Tier;
  view: DetailView;
}): ReactNode {
  const { featured } = tier;
  const featuredShadow = featured
    ? "shadow-[0_12px_32px_-18px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.45)]"
    : "";
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <article
      className={`relative flex min-h-[480px] flex-col overflow-hidden rounded-2xl border border-border bg-background p-6 text-foreground sm:p-8 lg:min-h-[520px] ${featuredShadow}`}
    >
      {featured ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
        >
          <DitherShader
            variant="cta"
            tone={
              isDark
                ? { r: 0.18, g: 0.18, b: 0.18 }
                : { r: 0.83, g: 0.83, b: 0.83 }
            }
          />
        </div>
      ) : null}

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {tier.name}
          </h3>
          {featured ? (
            <span className="inline-flex items-center rounded-full bg-foreground px-3 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-background">
              Hands-on
            </span>
          ) : null}
        </header>

        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
          {tier.tagline}
        </p>

        <div className="mt-10 flex items-baseline gap-2">
          <span className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {tier.format}
          </span>
        </div>
        <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
          {tier.detail}
        </p>

        <ul className="mt-10 space-y-3">
          {(view === "scope" ? tier.features : tier.outcomes).map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
            >
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                <Check className="h-3 w-3" strokeWidth={2} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-10">
          <a
            href={tier.cta.href}
            className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.12em] text-background transition-opacity hover:opacity-90"
          >
            {tier.cta.label}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  );
}
