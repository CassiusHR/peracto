/** Spanish site copy, served under `/es/`. Shape mirrors `copy-en.ts`. */
import type { SiteCopy } from "@/i18n/copy-en";

export const es: SiteCopy = {
  lang: "es",
  locale: "es_CL",
  meta: {
    title: "Ingeniería agéntica con un estándar superior",
    description:
      "Peracto diseña y construye software agéntico con ingenieros senior, herramientas de frontera y un flujo de trabajo riguroso. Desarrollo, ingeniería integrada, CTO/CPO fraccional y asesoría ejecutiva.",
    ogAlt: "Peracto — Ingeniería agéntica con un estándar superior.",
  },
  a11y: {
    skip: "Saltar al contenido principal",
    home: "Inicio de Peracto",
    primaryNav: "Navegación principal",
    mobileNav: "Navegación móvil",
    footerNav: "Pie de página",
    openMenu: "Abrir menú de navegación",
    closeMenu: "Cerrar menú de navegación",
    pause: "Pausar animaciones",
    resume: "Reanudar animaciones",
    previousCard: "Tarjeta anterior",
    nextCard: "Tarjeta siguiente",
    cardProgress: "Progreso de tarjetas",
    close: "Cerrar",
    closeCard: "Cerrar tarjeta",
  },
  nav: {
    home: "Inicio",
    services: "Servicios",
    approach: "Método",
    faq: "Preguntas",
    contact: "Contacto",
    cta: "Conversemos",
    switchLabel: "English",
    switchShort: "EN",
  },
  hero: {
    title: "Ingeniería agéntica con un estándar superior.",
    body: "Un equipo pequeño de ingenieros y líderes de producto senior. Modelos de frontera, un flujo de trabajo riguroso y software que resiste en producción.",
    primary: "Iniciar una conversación",
    secondary: "Ver la práctica",
    stats: [
      { label: "Equipo", value: "Solo senior" },
      { label: "Herramientas", value: "De frontera" },
      { label: "Estándar", value: "Producción" },
    ],
  },
  services: {
    title: ["Cuatro disciplinas.", "Un solo estándar."],
    body: "Tú eliges qué tan cerca trabajamos contigo. El oficio no cambia.",
    cta: "Iniciar una conversación",
    cards: [
      {
        id: "agentic",
        title: "Desarrollo\nAgéntico",
        body: "Software construido con agentes de IA bajo revisión de ingeniería senior, y agentes que operan dentro de tus sistemas con permisos claros, evaluaciones y supervisión humana.",
      },
      {
        id: "forward",
        title: "Forward Deployed\nEngineering",
        body: "Ingenieros senior dentro de tu equipo, tus datos y tus sistemas. Integramos, llevamos a producción y dejamos a tu gente capaz de operar lo que construimos.",
      },
      {
        id: "fractional",
        title: "CTO / CPO\nFraccional",
        body: "Liderazgo de tecnología o producto con un mandato definido. Arquitectura e ingeniería por un lado; clientes, prioridades y roadmap por el otro.",
      },
      {
        id: "advisory",
        title: "Asesoría\nEjecutiva",
        body: "Criterio técnico y de producto independiente para fundadores y equipos ejecutivos. Opciones, inversiones y riesgos, evaluados antes de comprometerse.",
      },
    ],
  },
  craft: {
    lead: "Herramientas de frontera.",
    title: "Manos senior.",
    body: "Trabajamos con los mejores modelos, plataformas y flujos de trabajo disponibles, elegidos para cada problema y sujetos a disciplina de ingeniería. Nada sale a producción sin revisión de un ingeniero senior.",
  },
  approach: {
    title: "Cómo trabajamos",
    steps: [
      {
        title: "Encuadre",
        body: "Definimos el resultado, la línea base y quién es responsable de qué. El trabajo parte de un brief claro.",
      },
      {
        title: "Construcción",
        body: "Ciclos cortos dentro de tus sistemas. Cada entrega se prueba con restricciones reales, no con demos.",
      },
      {
        title: "Validación",
        body: "Medimos calidad, adopción y resultados frente a la línea base. El comportamiento de los agentes se evalúa, no se supone.",
      },
      {
        title: "Traspaso",
        body: "Documentación, transferencia de conocimiento y una línea clara entre lo que gestiona tu equipo y dónde seguimos involucrados.",
      },
    ],
  },
  faq: {
    title: "Preguntas",
    items: [
      {
        q: "¿Qué significa desarrollo agéntico?",
        a: "Dos cosas. Usamos agentes de IA para construir software, con cada cambio revisado y validado por ingenieros. También construimos agentes que operan dentro de los procesos de tu negocio. Antes de definir el alcance acordamos cuál necesita tu proyecto.",
      },
      {
        q: "¿Pueden trabajar con nuestro equipo actual?",
        a: "Sí. Nuestros ingenieros trabajan dentro de tu contexto y junto a tu gente, con responsabilidades y dedicación acordadas para cada proyecto.",
      },
      {
        q: "¿En qué se diferencia un CTO o CPO fraccional de un asesor?",
        a: "Un CTO o CPO fraccional asume un mandato de liderazgo continuo. Un asesor aporta análisis y recomendaciones a quienes mantienen esa responsabilidad.",
      },
      {
        q: "¿Cómo usan la IA de forma responsable?",
        a: "Los límites de datos, accesos y herramientas se acuerdan antes de empezar. El trabajo asistido por IA se revisa, y los agentes se evalúan según los permisos y criterios de aceptación definidos para el proyecto.",
      },
      {
        q: "¿Cómo se cotiza un proyecto?",
        a: "Según alcance, dedicación y responsabilidad. Cada propuesta define entregables, condiciones y criterios de aceptación antes de comenzar.",
      },
    ],
  },
  contact: {
    title: "Cuéntanos qué estás construyendo.",
    body: "O qué lo está frenando. Una nota breve sobre el problema basta para empezar.",
    cta: "Iniciar una conversación",
  },
  footer: {
    backToTop: "Volver arriba",
    company: "Peracto",
    servicesLabel: "Servicios",
    connect: "Contacto",
    cta: "Iniciar una conversación",
    rights: "Todos los derechos reservados.",
  },
};
