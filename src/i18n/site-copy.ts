import { en, type SiteCopy } from "@/i18n/copy-en";
import { es } from "@/i18n/copy-es";

export type Lang = "en" | "es";
export type { SiteCopy };

export const CONTACT_EMAIL = "contacto@perac.to";
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}`;

const copies: Record<Lang, SiteCopy> = { en, es };

/** Home path per locale. English is the base at `/`, Spanish lives under `/es/`. */
export const homePath: Record<Lang, string> = { en: "/", es: "/es/" };

export function getCopy(lang: Lang): SiteCopy {
  return copies[lang];
}

export function otherLang(lang: Lang): Lang {
  return lang === "en" ? "es" : "en";
}
