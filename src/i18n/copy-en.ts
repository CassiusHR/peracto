/**
 * English site copy. English is the base locale served at `/`.
 * `copy-es.ts` must match this shape (enforced by the `SiteCopy` type).
 */
export const en = {
  lang: "en",
  locale: "en_US",
  meta: {
    title: "Agentic engineering, held to a higher standard",
    description:
      "Peracto designs and builds agentic software with senior engineers, frontier tooling and a disciplined workflow. Development, embedded engineering, fractional CTO/CPO and executive advisory.",
    ogAlt: "Peracto — Agentic engineering, held to a higher standard.",
  },
  a11y: {
    skip: "Skip to main content",
    home: "Peracto home",
    primaryNav: "Primary navigation",
    mobileNav: "Mobile navigation",
    footerNav: "Footer",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    pause: "Pause animations",
    resume: "Resume animations",
    previousCard: "Previous card",
    nextCard: "Next card",
    cardProgress: "Card progress",
    close: "Close",
    closeCard: "Close card",
  },
  nav: {
    home: "Home",
    services: "Services",
    approach: "Approach",
    faq: "FAQ",
    contact: "Contact",
    cta: "Let’s talk",
    switchLabel: "Español",
    switchShort: "ES",
  },
  hero: {
    title: "Agentic engineering, held to a higher standard.",
    body: "A small team of senior engineers and product leaders. Frontier models, a disciplined workflow, and software that holds up in production.",
    primary: "Start a conversation",
    secondary: "See the practice",
    stats: [
      { label: "Team", value: "Senior only" },
      { label: "Tooling", value: "Frontier" },
      { label: "Standard", value: "Production" },
    ],
  },
  services: {
    title: ["Four disciplines.", "One standard."],
    body: "Choose how closely we work with you. The craft stays the same.",
    cta: "Start a conversation",
    cards: [
      {
        id: "agentic",
        title: "Agentic\nDevelopment",
        body: "Software built with AI agents under senior engineering review, and agents that work inside your systems with clear permissions, evaluations and human oversight.",
      },
      {
        id: "forward",
        title: "Forward Deployed\nEngineering",
        body: "Senior engineers inside your team, data and systems. We integrate, ship to production, and leave your people able to run what we build.",
      },
      {
        id: "fractional",
        title: "Fractional\nCTO / CPO",
        body: "Technology or product leadership with a defined mandate. Architecture and engineering on one side; customers, priorities and roadmap on the other.",
      },
      {
        id: "advisory",
        title: "Executive\nAdvisory",
        body: "Independent technical and product judgment for founders and executive teams. Options, investments and risks, weighed before you commit.",
      },
    ],
  },
  craft: {
    lead: "Frontier tools.",
    title: "Senior hands.",
    body: "We work with the best models, platforms and workflows available, chosen for each problem and held to engineering discipline. Nothing ships without review by a senior engineer.",
  },
  approach: {
    title: "How the work is done",
    steps: [
      {
        title: "Frame",
        body: "Define the outcome, the baseline and who owns what. Work starts from a clear brief.",
      },
      {
        title: "Build",
        body: "Short cycles inside your systems. Each release is tested against real constraints, not demos.",
      },
      {
        title: "Prove",
        body: "Measure quality, adoption and results against the baseline. Agent behaviour is evaluated, not assumed.",
      },
      {
        title: "Hand over",
        body: "Documentation, knowledge transfer and a clear line between what your team owns and where we stay involved.",
      },
    ],
  },
  faq: {
    title: "Questions",
    items: [
      {
        q: "What do you mean by agentic development?",
        a: "Two things. We use AI agents to build software, with every change reviewed and validated by engineers. We also build agents that operate inside your business workflows. We agree which one your project needs before defining scope.",
      },
      {
        q: "Can you work with our existing team?",
        a: "Yes. Our engineers work inside your context and alongside your people, with responsibilities and time commitment agreed for each engagement.",
      },
      {
        q: "How is a fractional CTO or CPO different from an advisor?",
        a: "A fractional CTO or CPO holds an ongoing leadership mandate. An advisor brings analysis and recommendations to the people who keep that responsibility.",
      },
      {
        q: "How do you use AI responsibly?",
        a: "Data boundaries, access and tooling are agreed before work begins. AI-assisted work is reviewed, and agents are evaluated against the permissions and acceptance criteria defined for the project.",
      },
      {
        q: "How is an engagement priced?",
        a: "By scope, commitment and responsibility. Each proposal sets out deliverables, terms and acceptance criteria before work begins.",
      },
    ],
  },
  contact: {
    title: "Tell us what you are building.",
    body: "Or what is standing in its way. A short note on the problem is enough to begin.",
    cta: "Start a conversation",
  },
  footer: {
    backToTop: "Back to top",
    company: "Peracto",
    servicesLabel: "Services",
    connect: "Connect",
    cta: "Start a conversation",
    rights: "All rights reserved.",
  },
};

export type SiteCopy = typeof en;
