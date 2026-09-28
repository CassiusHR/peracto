# Peracto — Plan de posicionamiento y copy

Estado: primera implementación local para revisión en `codex/peracto-agentic-copy`.

## Actualización de implementación

La instrucción posterior del usuario pide mantener todos los componentes. Esta decisión sustituye las propuestas de retirar bloques descritas en el plan original: se conservan estructura, logo, shaders, carruseles, tarjetas, FAQ y animaciones. El carrusel de testimonios explica problemas de negocio sin atribuir citas a personas; Showcase presenta las cuatro ofertas; Community presenta capacidades; Pricing conserva sus tarjetas y selector para mostrar alcance o entregables.

Se mantiene el inglés de la web original para esta vista previa. El contacto confirmado por el usuario es `contacto@perac.to`; los CTA abren el correo y Contact navega al bloque de contacto.

Validación local del 28 de septiembre de 2026: baseline y resultado final con `npm run check` (0 errores, warnings e hints) y `npm run build`. Revisión de la versión compilada a 1440 px y 390 px: menú móvil, apertura/cierre de servicios, carrusel, FAQ, selector de alcance/entregables, anclas y enlaces de correo. Sin errores de JavaScript ni desbordamiento horizontal; sin IDs duplicados ni anclas huérfanas. No se envió correo ni se desplegó en producción.

La instalación utilizó `npm ci --cache /tmp/peracto-npm-cache` porque la caché habitual tenía un error de permisos. Se conservaron manifiesto y lockfile. La instalación reportó 20 vulnerabilidades de dependencias existentes; no se modificaron dependencias dentro de este cambio de copy.

El resto del documento conserva la propuesta inicial como referencia; las decisiones anteriores prevalecen en esta implementación.
Fecha: 28 de septiembre de 2026.
Repositorio: https://github.com/CassiusHR/peracto
Base revisada: `main`, commit `5523f144b5084d7029ce05276344b36a78929b3c`.

## 1. Objetivo y alcance

Reposicionar Peracto como una firma de desarrollo agéntico, Forward Deployed Engineering, Fractional CTO/CPO y Executive Advisory. La página debe permitir que un comprador entienda qué problema podemos resolver, con qué responsabilidad nos incorporamos y cómo iniciar una conversación.

Hipótesis editorial: una promesa común y cuatro modalidades claramente diferenciadas explicarán mejor la oferta que una lista de capacidades de IA o un catálogo de siete servicios.

Esta iteración comprende este plan y las instrucciones de trabajo en `AGENTS.md`. La siguiente comprende el contenido de la home, navegación, FAQ, footer y metadatos. Quedan fuera de esta iteración el código de la web, rediseño visual, animaciones, infraestructura, dependencias, precios y publicación.

Fuentes: solicitud actual del usuario, código clonado y `../PERACTO_POSITIONING.md`, un brief previo que se conserva intacto. La solicitud actual prevalece sobre el brief. Sus precios, plazos, experiencia y proyectos son antecedentes pendientes de reconfirmación, no afirmaciones listas para publicar.

## 2. Decisiones propuestas y preguntas pendientes

- **Comprador inicial propuesto:** fundadores, CEOs y responsables de tecnología/producto de empresas de software o negocios con una operación apoyada en software. Procede del brief anterior y requiere validación para esta etapa.
- **Necesidad común:** convertir una prioridad de negocio en decisiones de producto, software operativo y capacidad interna para mantenerlo.
- **Idioma:** por confirmar. La web actual y el brief están en inglés; este documento usa español para la revisión y ofrece un hero equivalente en inglés. No se propone mezclar idiomas dentro de una misma versión publicada.
- **Desarrollo agéntico:** hipótesis a confirmar: incluye tanto construir software con agentes de IA como desarrollar agentes integrados a procesos del cliente. Son capacidades distintas y el copy debe explicarlas por separado.
- **Tono propuesto:** directo, técnico cuando aporta claridad y comprensible para un decisor de negocio. Mostrar responsabilidades y entregables concretos.
- **Conversión principal:** una conversación sobre el problema y el alcance. El canal real de contacto o agenda está pendiente.
- **Entrada comercial:** evaluar el problema antes de proponer una modalidad. El assessment del brief puede ser un servicio de entrada, pero no se presenta como compra obligatoria ni con un plazo o precio todavía sin validar.

## 3. Posicionamiento

**Definición propuesta**

Peracto combina desarrollo agéntico y dirección de tecnología y producto para llevar prioridades de negocio a sistemas en operación.

**Idea que debe conectar toda la página**

Nos involucramos desde las decisiones de producto y tecnología hasta la construcción, integración y adopción de la solución.

**Jerarquía del mensaje**

1. Qué resolvemos: construir y poner en operación software e IA vinculados a una necesidad del negocio.
2. Cómo participamos: desarrollo, ingeniería integrada, dirección fraccional o asesoría ejecutiva.
3. Cómo trabajamos: acordar el resultado, ejecutar con contexto y verificar su funcionamiento.
4. Por qué confiar: personas, trabajo y resultados verificables.
5. Qué hacer: conversar sobre un problema concreto.

No usar los cuatro nombres de servicios como único titular. El visitante debe comprender la propuesta antes de necesitar el glosario.

## 4. Las cuatro ofertas

Las siguientes descripciones son propuestas de alcance comercial, sujetas a confirmar capacidad y disponibilidad.

| Oferta | Situación del cliente | Responsabilidad propuesta | Entregables posibles |
| --- | --- | --- | --- |
| Desarrollo agéntico | Necesita construir un producto o incorporar agentes a un proceso | Diseñar, construir, integrar y validar una solución con alcance definido | Software, integraciones, evaluaciones, documentación y entrega operativa |
| Forward Deployed Engineering | El reto depende de sistemas, datos y procesos internos que requieren trabajo continuo con el equipo | Integrarse a la ejecución del cliente y resolver el problema en su contexto | Integraciones desplegadas, flujos adoptados, seguimiento y transferencia de conocimiento |
| Fractional CTO / CPO | Necesita dirección recurrente de tecnología o producto con una dedicación acordada | Asumir un mandato de liderazgo con decisiones y responsabilidades explícitas | Estrategia técnica, prioridades de producto, roadmap y acuerdos de ejecución |
| Executive Advisory | La dirección necesita criterio externo para una decisión relevante | Analizar opciones, cuestionar supuestos y acompañar al responsable de decidir | Evaluación de alternativas, recomendaciones y seguimiento de decisiones |

**Diferencias que el copy debe mantener**

- Desarrollo agéntico explica qué construimos y cómo utilizamos agentes con revisión humana.
- Forward Deployed Engineering explica cómo nos integramos al equipo y a su operación. No implica presencia física permanente; la modalidad se acuerda.
- Fractional CTO/CPO implica responsabilidad de dirección recurrente. CTO: arquitectura, ingeniería y operación tecnológica. CPO: problema de cliente, prioridades, roadmap y resultados de producto. No asumir que ambos cargos se contratan juntos o recaen en una misma persona.
- Executive Advisory aporta criterio y acompañamiento al decisor; no promete ocupar el cargo ni dirigir la ejecución cotidiana.
- Las modalidades pueden combinarse cuando el problema lo requiere. No son planes de suscripción con prestaciones crecientes.

## 5. Arquitectura de la home y primer borrador

### Navegación

Servicios · Cómo trabajamos · Contacto.

CTA: **Hablemos de tu proyecto**.

Añadir “Experiencia” cuando exista contenido verificable para esa sección. No ofrecer páginas, secciones o agendas inexistentes.

### Hero

**Titular propuesto**

Desarrollo agéntico y liderazgo para llevar tu producto a operación.

**Bajada**

Construimos software y agentes de IA, nos integramos a tu equipo y asumimos la dirección de tecnología y producto que tu empresa necesita.

**CTA principal:** Hablemos de tu proyecto.

**CTA secundario:** Explorar servicios.

**Versión equivalente si el mercado principal es angloparlante**

Headline: Agentic development and leadership to bring your product into operation.

Supporting copy: We build software and AI agents, embed with your team, and provide the technology and product leadership your company needs.

Primary CTA: Discuss your project.

Secondary CTA: Explore our services.

Nota de edición: “operación” expresa la intención de entregar algo utilizable; no equivale a una garantía de resultado. El alcance de mantenimiento se acuerda por proyecto.

### Servicios

Título: **Cómo podemos trabajar contigo**.

**Desarrollo agéntico**

Construimos productos digitales con agentes de IA y criterio de ingeniería. También desarrollamos agentes conectados a tus sistemas para ejecutar tareas con permisos, evaluaciones y supervisión definidos.

**Forward Deployed Engineering**

Nos integramos a tu equipo para trabajar sobre tus datos, sistemas y procesos. Construimos las integraciones, acompañamos su puesta en marcha y transferimos el conocimiento necesario para operarlas.

**Fractional CTO / CPO**

Asumimos la dirección de tecnología o producto con una dedicación acordada. Definimos prioridades, tomamos decisiones con tu equipo y damos seguimiento a la ejecución y a los resultados.

**Executive Advisory**

Acompañamos a fundadores y equipos ejecutivos en decisiones de IA, tecnología y producto. Evaluamos alternativas, inversiones y riesgos para definir un curso de acción con criterio técnico y de negocio.

### Método

Título: **Del problema a la operación**.

1. **Definir el resultado.** Entendemos el problema, quién lo vive y cómo mediremos una mejora. Acordamos alcance, accesos y responsables.
2. **Construir con contexto.** Trabajamos con tu equipo y tus sistemas. Priorizamos entregas que permitan probar supuestos y recibir feedback temprano.
3. **Verificar en operación.** Revisamos calidad, uso y resultados frente al punto de partida. Documentamos y acordamos la continuidad o transferencia.

Los detalles de agentes, herramientas y revisión técnica deben aparecer donde expliquen una capacidad, no como una lista de herramientas en el hero.

### Experiencia

Publicar esta sección solo cuando haya material validado. Formato propuesto para cada caso:

- Contexto y problema.
- Responsabilidad concreta de Peracto o del profesional, diferenciadas.
- Qué se construyó o decidió.
- Estado: prototipo, piloto o producción.
- Resultado respaldado, periodo y forma de medición, cuando exista.
- Nombre, imagen o referencia que se pueda publicar.

El brief menciona transporte minero, operaciones de salones, analítica deportiva y agentes de voz. Son candidatos a investigar; no se presentan todavía como casos terminados ni clientes de Peracto.

Si no hay casos autorizados, usar perfiles profesionales confirmados. Si tampoco están disponibles, omitir la sección de prueba social en la primera versión.

### FAQ

**¿Qué significa desarrollo agéntico?**

Usamos agentes de IA en el proceso de desarrollo, con revisión y validación de ingeniería. También podemos construir agentes que trabajen dentro de un proceso de tu empresa. Definimos cuál de estas capacidades requiere tu proyecto.

**¿Pueden trabajar con nuestro equipo actual?**

Sí. En una modalidad de Forward Deployed Engineering nos integramos a tu contexto, coordinamos responsabilidades y construimos junto a tu equipo. La dedicación y la forma de colaboración se acuerdan según el proyecto.

**¿En qué se diferencia un CTO/CPO fraccional de un advisor?**

Un CTO o CPO fraccional asume un mandato recurrente de dirección. Un advisor aporta análisis y recomendaciones a quienes mantienen esa responsabilidad. Definimos el alcance antes de empezar.

**¿Necesitamos tener definido el proyecto?**

Podemos comenzar por aclarar el problema, las prioridades y las restricciones. Con esa base proponemos el alcance y la modalidad de trabajo.

**¿Cómo se define el presupuesto?**

Según el alcance, la dedicación y la responsabilidad acordados. La propuesta especifica entregables, condiciones y criterios de aceptación.

**¿Qué ocurre después de la entrega?**

Acordamos si el trabajo continúa con acompañamiento o se transfiere a tu equipo. La documentación, la operación y el soporte se definen dentro del alcance.

### Cierre y contacto

Título: **Conversemos sobre lo que necesitas construir o resolver.**

Texto: Cuéntanos qué está frenando a tu empresa y qué resultado necesitas. A partir de ese contexto definimos cómo puede participar Peracto.

CTA: **Hablemos de tu proyecto**.

Destino pendiente: URL de agenda, correo o canal existente y validado. No inventar una dirección. Implementar un formulario nuevo requeriría definir recepción y tratamiento de datos; no forma parte del cambio de copy por defecto.

### Footer y metadatos

Footer: Peracto · Servicios · Cómo trabajamos · Contacto. Añadir enlaces legales reales cuando estén disponibles. Mantener marca y copyright.

Título SEO propuesto: **Peracto | Desarrollo agéntico y Fractional CTO/CPO**.

Descripción propuesta: **Desarrollo de software y agentes de IA, Forward Deployed Engineering, Fractional CTO/CPO y asesoría ejecutiva para tu empresa.**

Si se elige inglés, adaptar todo el contenido, títulos accesibles y metadatos. Si se eligen dos idiomas, definir rutas y navegación de idioma en una iteración explícita; no basta con duplicar párrafos.

## 6. Inventario de reemplazo sobre el código actual

| Superficie / archivo | Contenido observado | Cambio propuesto |
| --- | --- | --- |
| `src/pages/index.astro` — hero | “A baseline for products…”; Frame; 120+ componentes; 9 min; licencia | Hero y bajada Peracto; eliminar métricas de plantilla sin reemplazarlas por cifras inventadas |
| `src/pages/index.astro` — scaffoldCards | Tres beneficios de plantilla | Cuatro ofertas; ajustar estructura mínima para no forzar cuatro servicios dentro de tres tarjetas |
| `src/pages/index.astro` + `src/components/LogoMarquee.astro` | “Trusted by” Linear, Vercel, Figma y logos | Retirar prueba social no validada; sustituir solo con evidencia autorizada |
| `src/pages/index.astro` — steps | Clonar, reemplazar placeholders, conectar datos, publicar | Método de trabajo de Peracto y enlaces existentes |
| `src/components/header.tsx` | Layouts, System, Docs, Sign In, Open Frame, utilidades de plantilla | Navegación y CTA propuestos, tanto escritorio como móvil |
| `src/components/testimonials.tsx` | Testimonios sobre Frame y avatares de ejemplo | Dejar de montar el bloque hasta disponer de testimonios reales autorizados |
| `src/components/showcase.tsx` | Renta fija, acciones, mercados privados | Retirar de la home; reutilizar solo si un caso real justifica esa presentación |
| `src/components/community.tsx` | Comunidad de builders y proyectos de ejemplo | Retirar de la home; sin sustituto decorativo |
| `src/components/pricing.tsx` | Starter, Studio, Enterprise; mensual/anual | Retirar precios y selector de la home; las cuatro modalidades se explican en Servicios |
| `src/components/faq.tsx` | FAQ de plantilla y referencia a Next.js | FAQ comercial de Peracto |
| `src/components/FinalCTA.astro` | “Drop in your brand…” / “Start with Frame” | Cierre propuesto y destino real |
| `src/components/Footer.astro` | Frame, Templates y enlaces `#` | Footer compacto con destinos verificables |
| `src/lib/config.ts` | Descripción genérica, keywords de frameworks, `@yourhandle`, inglés | Metadata coherente con posicionamiento e idioma; verificar identidad social o eliminar placeholder |
| `src/layouts/Layout.astro` | Título por defecto solo “Peracto” y metadata compartida | Pasar título desde la home; tocar layout solo si hay que retirar metadata no aplicable |
| `public/site.webmanifest` | Descripción “Peracto website” | Descripción de marca consistente; sin alterar comportamiento de instalación |
| `src/components/SkipToContent.astro` y etiquetas accesibles | Contenido auxiliar por localizar si cambia el idioma | Incluirlo en la revisión de localización |

Preservar logo, shader, tipografía y sistema visual actual. Revisar el ajuste de textos sin truncar títulos: existen clases `whitespace-nowrap` y `text-ellipsis` en las tarjetas. Una modificación mínima de composición puede ser necesaria para la legibilidad; no implica un rediseño.

## 7. Secuencia de trabajo y verificación

### Iteración A — plan y decisiones comerciales (esta entrega)

- Clonar y revisar la fuente.
- Definir promesa, ofertas y mapa de reemplazo.
- Guardar borrador y preguntas pendientes.
- Verificación documental: rutas citadas existentes, diff acotado, sin cambios en código ni en el brief original.

### Iteración B — primera versión del contenido

- Confirmar idioma, alcance de desarrollo agéntico y CTA real.
- Aplicar hero, servicios, método, FAQ, navegación, footer y metadata en los archivos enumerados.
- Retirar de la home los bloques sin respaldo.
- Mantener casos, bios y testimonios fuera hasta validar su contenido.

Presupuesto fijo de verificación: una ejecución de `npm run check`, una de `npm run build` y una revisión de la home a 390 px y 1440 px que cubra navegación, CTA, FAQ y ajuste de textos. El repositorio tiene `package-lock.json` y no define un script `lint`; se utiliza su comprobación existente, sin agregar dependencias ni un linter por este cambio.

Antes de editar código, ejecutar check/build como baseline con dependencias disponibles; si falta instalarlas, documentar `npm ci` como preparación necesaria ligada a la implementación. No instalar en la fase documental. Distinguir errores previos de regresiones.

### Iteración C — evidencia y publicación

- Completar los casos o perfiles seleccionados con fuentes y autorización.
- Revisar consistencia editorial y destinos reales.
- Publicar mediante el flujo de GitHub cuando el usuario lo solicite; después verificar contenido servido y contacto real.

### Criterios de aceptación

- Una promesa principal y las cuatro ofertas, sin solapamientos de responsabilidad.
- Cada modalidad responde a un problema y explica qué participación se contrata.
- Sin Frame, precios de ejemplo, testimonios ficticios ni productos financieros en la home.
- Sin cifras, clientes, credenciales ni resultados sin respaldo.
- Navegación y CTA con destino real; sin anclas huérfanas ni enlaces de relleno.
- Idioma consistente en contenido, metadata y accesibilidad.
- Texto legible en móvil y escritorio, sin recortes deliberados de nombres de servicios.
- Check/build y revisión visual registrados; pruebas locales diferenciadas de publicación real.

## 8. Datos para cerrar la versión publicable

1. Mercado e idioma prioritarios.
2. Si “desarrollo agéntico” cubre desarrollo con agentes, agentes para clientes o ambos.
3. Si Fractional CTO y CPO se ofrecen por separado y quién asume cada mandato.
4. Perfiles profesionales y hasta dos casos que se puedan hacer públicos, con estado y evidencia.
5. Canal de contacto o agenda real.
6. Si el assessment del brief sigue siendo una oferta comercial y cuándo conviene proponerlo.

No hacen falta todas estas respuestas para revisar el borrador. Sí deben resolverse las que sostengan afirmaciones o acciones de la versión que se publique.
