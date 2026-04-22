# NeuralRift — Instrucciones para Claude Code

Lee este archivo completo antes de modificar cualquier archivo del proyecto.
Contiene decisiones de diseño deliberadas que NO deben alterarse.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Backend | Laravel 11 |
| Frontend SPA | Inertia.js v2 + React 18 + TypeScript |
| Build | Vite + SSR (`bootstrap/ssr/ssr.js`) |
| Estilos | Tailwind CSS + `resources/css/app.css` |
| Animaciones | Framer Motion |
| Editor | Tiptap con `@tiptap/static-renderer` para SSR |
| Deploy local | Laravel Herd |

---

## DISEÑO INTENCIONAL — NUNCA MODIFICAR

El diseño fue creado en AXIOM.ai (Claude Design) con elecciones específicas del cliente.
Linters, auditorías automáticas (Impeccable, etc.) o convenciones genéricas NO prevalecen
sobre estas decisiones. Si algo está en esta sección, es correcto aunque parezca un error.

---

### 1. Tipografía — las 3 fuentes son obligatorias

```js
// tailwind.config.js
fontFamily: {
    display: ['"Playfair Display"', 'Georgia', ...defaultTheme.fontFamily.serif],
    sans:    ['"DM Sans"',          'system-ui', ...defaultTheme.fontFamily.sans],
    mono:    ['"JetBrains Mono"',   ...defaultTheme.fontFamily.mono],
}
```

- `font-display` → headings, logo, títulos de posts. Serif editorial deliberado.
- `font-sans` → body, UI, navegación. DM Sans es más legible que Figtree/Inter en dark mode.
- `font-mono` → código, badges, fechas, metadatos.

**PROHIBIDO reemplazar por:** Archivo, Figtree, Inter, Geist, Nunito o cualquier otra fuente.
Impeccable las marcó como "reject list" — el cliente las eligió intencionalmente.

Carga en `resources/views/app.blade.php` vía `<link>` (no `@import`):
```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;600&display=swap"
  media="print" onload="this.media='all'">
```

---

### 2. Paleta de colores — valores exactos, no cambiar

```js
// tailwind.config.js → theme.extend.colors.nr
bg:           '#080B12'   // fondo principal de todas las páginas públicas
bg2:          '#090c14'   // fondo ligeramente más claro (variante)
bg3:          '#070a11'   // fondo más oscuro (secciones alternadas, footer)
surface:      '#111827'   // superficies elevadas — SOLO en el panel admin
accent:       '#7C6AF7'   // violeta — color principal de marca
'accent-dark':'#6d58f0'   // violeta más oscuro para gradientes (to-nr-accent-dark)
cyan:         '#06B6D4'   // cyan — segundo color de marca
gold:         '#F59E0B'   // dorado — badges "Nuevo", premium, destacados
green:        '#10B981'   // confirmaciones, éxito
red:          '#EF4444'   // errores, eliminar
text:         '#F1F5F9'   // texto principal
muted:        '#94A3B8'   // texto secundario
faint:        '#6B7280'   // texto decorativo/terciario (contraste 4.6:1 WCAG AA)
```

**PROHIBIDO cambiar** estos valores hexadecimales bajo ningún concepto.

Nota sobre `nr-faint`: el valor `#6B7280` fue elegido específicamente para cumplir
contraste WCAG AA sobre `#080B12`. No "mejorar" a valores más claros ni más oscuros.

---

### 3. Gradient text del logo NeuralRift

El logo usa `className="text-gradient"` — NO `text-nr-accent` ni color sólido.

```css
/* app.css — .text-gradient */
background: linear-gradient(to right, #7C6AF7, #06B6D4);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

Aparece en:
- `Navbar.tsx` — `<span className="text-gradient">NeuralRift</span>`
- `Footer.tsx` — `<div className="font-display text-2xl font-black text-gradient mb-3">`

Si en algún momento ves `text-nr-accent` en el logo, está mal. Corrígelo.

---

### 4. Glassmorphism — clase `glass` obligatoria en cards públicas

Las superficies del sitio público usan glassmorphism. La clase `glass` está definida en `app.css`:

```css
/* app.css */
.glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.08);
}
.glass-md {
    background: rgba(17,24,39,0.60);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.08);
}
.glass-strong {
    background: rgba(17,24,39,0.85);
    backdrop-filter: blur(32px);
    border: 1px solid rgba(255,255,255,0.12);
}
```

**Dónde debe ir `glass`:**
| Componente | Clase correcta |
|---|---|
| `PostCard.tsx` — card completa | `glass` |
| `AffiliateWidget.tsx` — card completa | `glass` |
| `NewsletterWidget.tsx` — card contenedora | `glass` |
| `Navbar.tsx` — al hacer scroll | `glass-strong` |
| `Navbar.tsx` — mobile menu | `glass-strong` |
| `TableOfContents.tsx` — sidebar sticky | `glass` |
| Badges de categoría, lang, featured | `glass` |
| Pills de filtro en Blog/Index y Tools | `glass` |

**`bg-nr-surface` es para el admin** (`AdminLayout`, dashboard cards, formularios).
**NUNCA** usar `bg-nr-surface` en páginas públicas donde debe ir `glass`.

---

### 5. PostCardFeatured — borde gradiente animado

`PostCardFeatured.tsx` tiene una estructura específica de dos capas:

```tsx
// Capa exterior: proporciona el borde gradiente animado (1px padding)
<div className="border-gradient-animated">
    // Capa interior: el contenido real con fondo sólido
    <Link className="... rounded-[17px] bg-gradient-to-br from-nr-bg3 to-nr-surface ...">
        {/* Glow orbs: blur-2xl (NO blur-3xl — performance) */}
        <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-nr-accent/10 blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-nr-cyan/[0.08] blur-2xl" />
        {/* ... resto del contenido */}
    </Link>
</div>
```

```css
/* app.css — .border-gradient-animated */
background: linear-gradient(135deg,
    rgba(124,106,247,0.7),
    rgba(6,182,212,0.55),
    rgba(124,106,247,0.7)
);
background-size: 200% 200%;
animation: gradBorder 4s linear infinite;
padding: 1px;
border-radius: 18px;
```

El inner `<Link>` tiene `rounded-[17px]` (18px - 1px padding = 17px) para que
los bordes del gradiente sean visibles en las esquinas.

**PROHIBIDO** reemplazar esto por un simple `border border-nr-accent/40`.

---

### 6. Constelación de nodos en el Hero (Home.tsx)

El hero tiene 8 nodos flotantes animados + 6 líneas SVG conectoras.
Son el elemento visual diferenciador del diseño — integrados temáticamente con el blog de IA.

```tsx
// Home.tsx — constantes definidas fuera del componente
const NODES = [
    { x: '11%', y: '22%', size: 6, color: '#7C6AF7', delay: 0 },
    { x: '80%', y: '12%', size: 3, color: '#06B6D4', delay: 0.4 },
    { x: '90%', y: '65%', size: 4, color: '#7C6AF7', delay: 0.8 },
    { x: '7%',  y: '75%', size: 3, color: '#06B6D4', delay: 1.2 },
    { x: '54%', y: '85%', size: 5, color: '#7C6AF7', delay: 0.6 },
    { x: '70%', y: '38%', size: 3, color: '#06B6D4', delay: 1.0 },
    { x: '33%', y: '55%', size: 4, color: '#7C6AF7', delay: 0.2 },
    { x: '44%', y: '18%', size: 3, color: '#06B6D4', delay: 1.4 },
]

const SVG_LINES = [
    ['11%', '22%', '33%', '55%'],
    ['33%', '55%', '54%', '85%'],
    ['80%', '12%', '70%', '38%'],
    ['70%', '38%', '90%', '65%'],
    ['44%', '18%', '70%', '38%'],
    ['33%', '55%', '70%', '38%'],
]
```

Estructura en JSX:
```tsx
<div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    {/* SVG lines — hidden on mobile, visible md+ */}
    <svg className="absolute inset-0 w-full h-full hidden md:block" style={{ opacity: 0.10 }}>
        {SVG_LINES.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7C6AF7" strokeWidth="1" />
        ))}
    </svg>

    {/* Floating nodes con Framer Motion */}
    {NODES.map((node, i) => (
        <motion.div
            key={i}
            style={{ left: node.x, top: node.y, width: node.size*2, height: node.size*2,
                     background: node.color, boxShadow: `0 0 ${node.size*4}px ${node.color}80`,
                     transform: 'translate(-50%, -50%)', position: 'absolute', borderRadius: '50%' }}
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.2, 1], y: [0, -8, 0] }}
            transition={{ duration: 4, delay: node.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
    ))}
</div>
```

**PROHIBIDO** eliminar, simplificar o reemplazar por un fondo estático.

---

### 7. MeshBackground

`<MeshBackground />` es un componente en `resources/js/Components/Layout/MeshBackground.tsx`.
Usa la clase `.mesh-bg` (4 radial-gradients violeta/cyan) + `.noise` overlay.

**Debe estar presente en:**
- `Home.tsx` — hero section
- `Blog/Index.tsx` — header section
- `Category/Show.tsx` — hero section
- `About.tsx` — hero section

Si no está en alguna de estas páginas, agrégalo.

---

### 8. Headline rotativo en el Hero

```tsx
// Home.tsx — palabras que rotan cada 2.8s
const ROTATING_WORDS = [
    'Inteligencia Artificial',
    'Modelos de Lenguaje',
    'Automatización IA',
    'El Futuro Digital',
]
```

El `motion.span` tiene `aria-hidden="true"` porque hay un `<span className="sr-only" aria-live="polite">` adyacente para screen readers. Ambos son necesarios.

El cursor parpadeante `|` usa `animate-blink` — mantener.

---

### 9. Cursor personalizado

```css
/* app.css */
body { cursor: none; }                          /* cursor custom activo */
body:not(.cursor-ready) { cursor: auto; }       /* fallback hasta hidratación JS */
.admin-layout * { cursor: auto !important; }    /* admin no usa cursor custom */
```

```tsx
// app.tsx — después de montar la app
document.body.classList.add('cursor-ready')
```

`CustomCursor.tsx` está montado en `Navbar.tsx` para cubrir todas las páginas públicas.
**No mover ni eliminar** el `<CustomCursor />` de Navbar.

---

### 10. Animaciones Framer Motion — no simplificar

Las animaciones existentes son intencionales. No reemplazar por transiciones CSS simples.

| Elemento | Animación |
|---|---|
| Hero badge, headline, subheadline, CTAs | `initial/animate` stagger con `delay` |
| Rotating words | `motion.span` con `key={wordIndex}` para re-render |
| Constellation nodes | `animate` en bucle infinito `repeat: Infinity` |
| PostCard, AffiliateWidget | `whileInView` con `viewport={{ once: true }}` |
| Category pages | `motion.h1` con `initial: { opacity: 0, y: 12 }` |

---

## Convenciones y reglas del proyecto

### Renderizado de contenido Tiptap (CRÍTICO)

El contenido de posts viene como JSON de Tiptap. **SIEMPRE** usar `renderContent()`:

```tsx
import { renderContent } from '@/lib/tiptap'

<div
    className="nr-prose"
    dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
/>
```

**NUNCA** pasar el JSON directamente a `dangerouslySetInnerHTML`. El SSR romperá.

### Inertia `<Head>` — restricción importante

```tsx
// CORRECTO
<Head title="Página — NeuralRift">
    <meta name="description" content="..." />
    <meta property="og:title" content="..." />
</Head>

// INCORRECTO — causa crash en SSR (bug Inertia v2 con null props en <link>)
<Head>
    <title>Página — NeuralRift</title>
    <link rel="canonical" href="..." />  {/* ← esto rompe el SSR */}
</Head>
```

Regla: `title` siempre como prop de `<Head>`, solo `<meta>` como children, nunca `<link>`.

### `nr-accent-dark` en lugar de valores hardcodeados

```tsx
// CORRECTO
className="bg-gradient-to-r from-nr-accent to-nr-accent-dark"

// INCORRECTO
className="bg-gradient-to-r from-nr-accent to-[#6d58f0]"
```

El token `nr-accent-dark: '#6d58f0'` existe en `tailwind.config.js`. Úsalo.

### Imágenes — atributos requeridos

```tsx
// PostCard, AffiliateWidget (below the fold)
<img loading="lazy" decoding="async" width="800" height="450" ... />

// PostCardFeatured (above the fold)
<img loading="eager" decoding="async" ... />
```

### `will-change-transform` en cards con hover

```tsx
// PostCard.tsx, AffiliateWidget.tsx — cualquier elemento con hover:-translate-y-1
className="... hover:-translate-y-1 will-change-transform transition-... duration-300"
```

### Admin vs. público — superficies

| Contexto | Clase de superficie |
|---|---|
| Páginas públicas (cards, widgets) | `glass` |
| Navbar scrolled, mobile menu | `glass-strong` |
| Panel admin (cards, formularios) | `bg-nr-surface` o `glass` |
| Secciones alternadas (Home affiliates, Footer) | `bg-nr-bg3` |

### Social links en Footer

```tsx
// Footer.tsx — solo mostrar redes con URLs reales configuradas
const SOCIAL_LINKS = [
    { label: 'Twitter/X', href: `https://twitter.com/${SITE.twitter.replace('@', '')}` },
    // LinkedIn, YouTube: agregar cuando haya URLs reales, NO usar href="#"
]
```

### Skip navigation link

`Navbar.tsx` tiene como primer elemento:
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only ...">Saltar al contenido</a>
```

Cada `<main>` debe tener `id="main-content"` para que funcione.

---

## Estructura de archivos clave

```
resources/
├── css/app.css                        ← Tailwind + clases custom (glass, nr-prose, etc.)
├── js/
│   ├── app.tsx                        ← Entry point React + cursor-ready class
│   ├── ssr.tsx                        ← SSR entry
│   ├── lib/
│   │   ├── constants.ts               ← SITE, NAV_LINKS, CATEGORY_COLORS, ADMIN_NAV
│   │   ├── tiptap.ts                  ← renderContent() — SIEMPRE usar esto
│   │   └── utils.ts                   ← cn(), formatDate(), readTime()
│   ├── hooks/
│   │   ├── useReadingProgress.ts      ← scroll progress 0-100
│   │   └── useDebounce.ts             ← debounce genérico
│   ├── Components/
│   │   ├── Layout/
│   │   │   ├── Navbar.tsx             ← skip link, gradient logo, glass, CustomCursor
│   │   │   ├── Footer.tsx             ← gradient logo, social links reales
│   │   │   ├── MeshBackground.tsx     ← mesh-bg + noise overlay
│   │   │   ├── AdminLayout.tsx        ← layout del panel admin
│   │   │   └── CustomCursor.tsx       ← cursor dot + ring animado
│   │   └── Blog/
│   │       ├── PostCard.tsx           ← glass, lazy img, will-change
│   │       ├── PostCardFeatured.tsx   ← border-gradient-animated wrapper, eager img
│   │       ├── AffiliateWidget.tsx    ← glass, lazy img, will-change
│   │       ├── NewsletterWidget.tsx   ← glass, label accesible
│   │       ├── ReadingProgress.tsx    ← barra de progreso lectura (z-[60])
│   │       ├── ShareButtons.tsx       ← Twitter/LinkedIn/WhatsApp/clipboard
│   │       └── TableOfContents.tsx    ← DOMParser + IntersectionObserver (SSR safe)
│   └── Pages/
│       ├── Home.tsx                   ← constellation nodes, MeshBackground, rotating words
│       ├── About.tsx
│       ├── Tools.tsx
│       ├── Blog/
│       │   ├── Index.tsx
│       │   └── Show.tsx               ← renderContent(), ReadingProgress, TOC, ShareButtons
│       ├── Category/
│       │   └── Show.tsx
│       └── Admin/
│           ├── Dashboard.tsx
│           ├── Analytics.tsx          ← Recharts charts
│           ├── Newsletter.tsx
│           ├── Settings.tsx
│           ├── Posts/Index.tsx
│           ├── Posts/Edit.tsx         ← TiptapEditor
│           ├── Categories/Index.tsx
│           └── Affiliates/Index.tsx
```

---

## Comandos

```bash
# Desarrollo
npm run dev          # Vite dev server

# Build
npm run build        # Client + SSR build completo

# Calidad
npm run type-check   # TypeScript sin emitir (tsc --noEmit)
npm run lint         # ESLint
npm run format       # Prettier — reescribe archivos
npm run format:check # Prettier — solo verifica
npm run check        # type-check + lint + format:check (correr antes de commit)

# Laravel
php artisan migrate         # Migraciones
php artisan db:seed         # Datos de demo
php artisan optimize:clear  # Limpiar caché
```

---

## Checklist antes de hacer un commit

- [ ] `npm run check` pasa sin errores (warnings de `any` en Recharts son aceptables)
- [ ] El logo "NeuralRift" usa `text-gradient` (NO `text-nr-accent`)
- [ ] Las cards públicas usan `glass` (NO `bg-nr-surface`)
- [ ] `PostCardFeatured` está envuelto en `<div className="border-gradient-animated">`
- [ ] La constelación de nodos existe en el hero de `Home.tsx`
- [ ] Las fuentes son Playfair Display + DM Sans + JetBrains Mono
- [ ] No hay `href="#"` en links de redes sociales
- [ ] Ningún `<link rel="canonical">` dentro de `<Head>` de Inertia
- [ ] El contenido Tiptap usa `renderContent()` de `@/lib/tiptap`
