# Accessibility, performance y SEO — 2026-10-03

Revisión local del build estático de Peracto, realizada antes de publicar estos cambios. Se conservaron los logos, el copy de experiencia internacional y la identidad visual. La evidencia de este documento corresponde al build local.

## Cambios

- `src/pages/index.astro` y `src/components/community.tsx`: eliminada la sección fijada de 180vh que convertía el scroll vertical en desplazamiento horizontal.
- `src/layouts/Layout.astro`: eliminado Lenis y su bucle global. Navegación y scroll nativos; zoom sin límite artificial, tema oscuro en HTML y fuentes locales.
- `src/components/header.tsx`, `showcase.tsx` y `src/lib/focus.ts`: foco contenido en overlays, Escape, restauración del foco, fondo inerte y menú desplazable en pantallas bajas. Los enlaces del menú mantienen el hash y dejan visibles los títulos bajo la cabecera.
- `src/components/testimonials.tsx`: contraste de tarjetas inactivas, indicadores con área de 32×32px, estados semánticos y flechas de teclado limitadas a la sección.
- `src/components/pricing.tsx`: radios HTML nativos con navegación por flechas y foco visible.
- `src/components/Faq.astro`: acordeón nativo, headings y respuestas renderizadas en HTML; funciona sin hidratación ni JavaScript.
- `src/lib/animation-loop.ts`: WebGL se detiene fuera de pantalla, con movimiento reducido, al pausar y cuando el documento está oculto. El logo reutiliza el render target al redimensionar y tiene una alternativa SVG si WebGL no está disponible.
- `src/components/MotionControls.astro` y `LogoMarquee.astro`: pausa global de efectos decorativos. Los nueve logos aparecen en una cuadrícula estática con movimiento reducido o sin JavaScript.
- `Footer.astro` y `index.astro`: footer semántico y CTA dentro de main. `logo-demo.astro`: título, descripción y un h1 propio.
- `public/fonts/`: Geist y Geist Mono locales con sus licencias OFL, `font-display: swap` y preload de la fuente principal.
- `public/og-image.png`: imagen social válida de 1200×630 con logo, tipografía y copy existentes.

## Noindex

Las dos páginas compiladas incluyen `meta robots="noindex, follow"`. `public/_headers` configura `X-Robots-Tag: noindex, follow` para los assets estáticos. No se genera ni se anuncia un sitemap. HTML continúa accesible a los crawlers para que puedan leer la directiva, como indica [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/block-indexing). La cabecera está preparada conforme a la [documentación de Cloudflare](https://developers.cloudflare.com/workers/static-assets/headers/); no se verificó un despliegue remoto.

## Evidencia

`npm run check`: 0 errores, warnings e hints. `npm run build`, Prettier sobre archivos modificados y `git diff --check`: correctos.

Chromium + axe-core 4.10.3, viewports 1440×1000 y 390×844:

| Medición local | Antes | Después |
| --- | --- | --- |
| Tipos de incidencias axe en homepage | 3 | 0 |
| Archivos JS cargados tras recorrer toda la página | 18 | 14 |
| Suma estimada gzip de esos archivos JS | 156,717 bytes | 144,598 bytes |
| Errores JS / recursos HTTP fallidos | 0 / 0 | 0 / 0 |
| Desbordamiento horizontal de página | No | No |

Reducción estimada de JavaScript: 7.7%. Se comprimió cada respuesta JS local única con gzip; esto no mide el tráfico real del CDN. El número inicial de archivos JS sigue en 8.

Al llegar al final, hero y efecto de la tarjeta quedan en 0 llamadas de dibujo por 700ms; antes seguían activos. El efecto del CTA dibuja solo si continúa dentro del viewport. Pausa/reanudación y cambio dinámico de movimiento reducido comprobados. La señal de documento oculto se probó simulando `visibilitychange`.

También pasaron teclado, skip link, menú móvil y modal de servicios (incluido axe en ambos overlays), restauración del foco, navegación, controles del carrusel, radios, FAQ, IDs únicos, enlaces internos, nueve logos estáticos, contenido/FAQ sin JavaScript y axe/noindex en `/logo-demo/`.

Los JSON, scripts y capturas antes/después se conservan como artefactos del chat. Axe mantiene comprobaciones de contraste incompletas en algunos fondos gráficos/contenido recortado; 0 incidencias detectadas no equivale a certificación WCAG. No se midieron Core Web Vitals en producción ni se hizo una prueba con VoiceOver o dispositivo físico. Los timings de Chromium local no se usan como promesa de rendimiento real.
