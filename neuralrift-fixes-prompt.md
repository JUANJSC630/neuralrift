# NeuralRift — Prompt de Fixes para Claude Code
# Basado en el audit completo del proyecto
# Pega este prompt directamente en Claude Code dentro del proyecto neuralrift

---

Eres un desarrollador senior full-stack especializado en Laravel, Inertia.js y React.
Tienes el audit completo del proyecto NeuralRift. Implementa TODOS los fixes listados
siguiendo SOLID, Repository Pattern, Service Layer, Actions, DTOs, Form Requests,
Policies y Observers. Sin excepciones arquitecturales.

---

## PRINCIPIOS OBLIGATORIOS en cada línea de código

**SOLID estricto:**
- Single Responsibility: Controllers máximo 10 líneas por método. Solo orquestan.
  Lógica de negocio en Services. Operaciones atómicas en Actions. Queries en Repositories.
- Open/Closed: extiende con traits e interfaces, no modifica clases existentes.
- Dependency Inversion: inyecta dependencias en constructores, nunca `new Clase()` dentro
  de métodos. Bind interfaces en AppServiceProvider.

**Patrones obligatorios:**
- Repository Pattern: toda query a DB va en `app/Repositories/`.
  Cada repositorio tiene su Interface en `app/Repositories/Contracts/`.
  Bind en AppServiceProvider.
- Service Layer: lógica compleja en `app/Services/`. Services usan Repositories.
  Controllers usan Services. Nunca un Controller usa un Repository directamente.
- Action Classes: operaciones atómicas en `app/Actions/`. Una Action = una operación.
- DTOs: transferencia de datos entre capas en `app/DTOs/`. Readonly classes PHP 8.2.
- Form Requests: TODA validación en `app/Http/Requests/`. Nunca `$request->validate()` en Controller.
- Policies: TODA autorización en `app/Policies/`. Nunca `if role === admin` en Controller.
- Observers: efectos secundarios en `app/Observers/`. Registrar en AppServiceProvider.

**Calidad de código:**
- Nombres con intención: no `$u` sino `$subscriber`. No `$d` sino `$dashboardMetrics`.
- Early returns siempre. Máximo 3 niveles de indentación.
- Manejo de errores explícito con logging. Nunca catch vacíos.
- TypeScript estricto en frontend. Cero `any`. Interfaces para todo.
- Componentes React máximo 150 líneas. Si supera, extrae en subcomponentes.
- Custom hooks para toda lógica con estado o efectos secundarios.

---

## FASE A — SEGURIDAD CRÍTICA

**A1. Middleware EnsureAdmin**

Crear `app/Http/Middleware/EnsureAdmin.php`:
- Verificar `$request->user()?->role === 'admin'`
- Si no es admin: `abort(403)` para requests Inertia, `redirect('/')` para requests normales
- Detectar Inertia con `$request->header('X-Inertia')`
- Registrar en `bootstrap/app.php` con alias `'admin'`
- En `web.php`: reemplazar `middleware(['auth', 'verified'])` del grupo admin
  por `middleware(['auth', 'verified', 'admin'])`

**A2. Throttle en rutas de tracking**

En `web.php` agregar throttle específico por ruta:
- `POST /api/views/{post}` → `throttle:10,1` (10 requests/minuto por IP)
- `GET /herramientas/{slug}/click` → `throttle:30,1` (30/minuto por IP)
- `POST /newsletter/subscribe` → `throttle:3,60` (3/hora por IP)

**A3. Security Headers Middleware**

Crear `app/Http/Middleware/SecurityHeaders.php` con estos headers en cada response:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Registrar globalmente en `bootstrap/app.php`.

**A4. Limitar parámetro days en Analytics**

En `AnalyticsController@index`:
```php
$days = min((int) $request->get('days', 30), 365);
```

**A5. RSS — ocultar email real del autor**

En `resources/views/rss.blade.php` cambiar la etiqueta `<author>`:
```xml
<author>noreply@neuralrift.com ({{ $post->author->name }})</author>
```

---

## FASE B — BUGS CRÍTICOS DE FUNCIONALIDAD

**B1. Fix analytics — eliminar duplicación de tracking**

Crear `app/Actions/Analytics/RecordPostViewAction.php`:
- Recibe `Post $post` y `Request $request`
- Verifica session key `"viewed_post_{$post->id}"` para evitar doble conteo
- Detecta bots por user-agent (googlebot, bingbot, spider, crawler, etc.)
- Si pasa los checks: crea `PostView`, incrementa `views_count`, guarda en session
- Retorna `bool` indicando si se registró la vista

Refactorizar `PostViewController@store` para usar la Action:
```php
public function store(Post $post, Request $request): JsonResponse
{
    $counted = app(RecordPostViewAction::class)->execute($post, $request);
    return response()->json(['counted' => $counted]);
}
```

En `PostController@show`: ELIMINAR el `$post->increment('views_count')` directo.
El tracking debe venir únicamente del frontend vía POST a `/api/views/{post}`.

En `Blog/Show.tsx`: asegurarse de que el `useEffect` de tracking está ACTIVO:
```tsx
useEffect(() => {
    fetch(`/api/views/${post.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '',
        },
    }).catch(() => {})
}, [post.id])
```

**B2. Newsletter — implementar email de confirmación**

Crear `app/Mail/SubscriptionConfirmation.php`:
- Mailable que recibe un `Subscriber`
- Asunto: `"Confirma tu suscripción a NeuralRift"`
- Vista: `resources/views/emails/subscription-confirmation.blade.php`
- Template HTML inline-styled: fondo `#080B12`, botón accent `#7C6AF7`,
  fuente system-ui, link de confirmación con `route('newsletter.confirm', $subscriber->token)`
- Incluir texto plain-text fallback

Crear `app/Actions/Newsletter/SubscribeAction.php`:
- Recibe `string $email` y `string $lang = 'es'`
- Usa `Subscriber::firstOrCreate()` por email
- Si el subscriber no está confirmado: dispara `SubscriptionConfirmation` Mailable
- Si ya estaba confirmado: no reenvía email
- Retorna el `Subscriber`

Crear `app/Actions/Newsletter/ConfirmSubscriberAction.php`:
- Recibe `string $token`
- Busca subscriber con `token = $token` y `confirmed = false`
- Si no existe: lanza `ModelNotFoundException`
- Si existe: actualiza `confirmed = true`, `confirmed_at = now()`, `token = null`
- Retorna el `Subscriber` actualizado

Crear `app/Http/Requests/SubscribeNewsletterRequest.php`:
- `email`: `required|email:rfc,dns|max:255`
- `lang`: `nullable|in:es,en`

Refactorizar `NewsletterController`:
```php
public function subscribe(SubscribeNewsletterRequest $request): RedirectResponse
{
    app(SubscribeAction::class)->execute(
        $request->validated('email'),
        $request->validated('lang', 'es')
    );
    return back()->with('success', 'Revisa tu email para confirmar tu suscripción.');
}

public function confirm(string $token): RedirectResponse
{
    try {
        app(ConfirmSubscriberAction::class)->execute($token);
        return redirect('/')->with('success', '¡Confirmado! Bienvenido a NeuralRift.');
    } catch (ModelNotFoundException) {
        return redirect('/')->with('error', 'El link no es válido o ya fue usado.');
    }
}
```

**B3. Fix read_time — calcular sobre texto puro, no JSON raw**

En `Post.php`, reemplazar el cálculo de `read_time` en el hook `boot()`.
Agregar método privado estático `extractTextFromNode(array $node): string`
que recorre recursivamente el JSON de Tiptap extrayendo solo nodos `type === 'text'`
y concatena su propiedad `text`. Usar eso para `str_word_count()`.

Ejemplo de estructura a recorrer:
```json
{"type": "doc", "content": [
  {"type": "paragraph", "content": [
    {"type": "text", "text": "Hola mundo"}
  ]}
]}
```

Envolver en try/catch para que un JSON malformado no rompa el guardado.

**B4. Eliminar archivos Breeze legacy que rompen SSR**

Eliminar estos archivos que referencian rutas inexistentes:
- `resources/js/Pages/Welcome.tsx`
- `resources/js/Pages/Dashboard.tsx`
- `resources/js/Pages/Profile/Edit.tsx` (y carpeta Profile/ completa)
- `resources/js/Layouts/AuthenticatedLayout.tsx`
- `resources/js/Layouts/GuestLayout.tsx`

Verificar que ninguna ruta en `web.php` o `auth.php` apunta a esas páginas.
Si hay rutas de profile en `auth.php`, eliminarlas o redirigirlas a `/admin/settings`.

**B5. Fix SubscriberSeeder — agregar confirmed_at**

En `SubscriberSeeder.php`, para los subscribers con `confirmed => true` agregar:
```php
'confirmed_at' => now()->subDays(rand(1, 30)),
```

**B6. Fix PostSeeder — corregir tag inexistente**

En `PostSeeder.php`, reemplazar el tag `'Writesonic'` por un tag que sí
existe en `TagSeeder.php` (ej: `'Automatización'` o `'Herramientas'`).
O bien agregar `'Writesonic'` a `TagSeeder.php`.

**B7. Fix sidebar newsletter en Blog/Show**

El formulario inline del sidebar del post no tiene submit funcional.
Reemplazarlo por `<NewsletterWidget compact={true} />` usando una prop `compact`
que muestre el widget en versión condensada (sin el título grande, solo input + botón).
Agregar la prop `compact?: boolean` a `NewsletterWidget.tsx` con el layout simplificado.

---

## FASE C — PERFORMANCE

**C1. Fix query-per-day en Dashboard y Analytics**

En `DashboardController@index`, reemplazar el bucle de 30 queries por:
```php
$viewsByDay = PostView::where('viewed_at', '>=', now()->subDays(29))
    ->selectRaw('DATE(viewed_at) as date, COUNT(*) as views')
    ->groupBy('date')
    ->orderBy('date')
    ->pluck('views', 'date');

$chartData = collect(range(29, 0))->map(function ($daysAgo) use ($viewsByDay) {
    $date = now()->subDays($daysAgo)->format('Y-m-d');
    return [
        'date'  => now()->subDays($daysAgo)->format('d M'),
        'views' => $viewsByDay[$date] ?? 0,
    ];
})->values();
```

Aplicar el mismo patrón en `AnalyticsController@index` con el rango de `$days`.

**C2. Cachear categorías en SharedProps**

En `HandleInertiaRequests.php`, dentro de `share()`:
```php
'categories' => fn () => Cache::remember('nav_categories', 3600, fn () =>
    Category::orderBy('order')
        ->withCount(['posts' => fn($q) => $q->published()])
        ->get(['id', 'name', 'name_en', 'slug', 'color', 'icon', 'posts_count'])
),
```

Crear `app/Observers/CategoryObserver.php`:
- En `created`, `updated`, `deleted`: `Cache::forget('nav_categories')`

Registrar en `AppServiceProvider::boot()`:
```php
Category::observe(CategoryObserver::class);
```

**C3. Migration de índices de performance**

Crear migration `add_performance_indexes_to_all_tables`:
```php
// posts
Schema::table('posts', function (Blueprint $table) {
    $table->index(['status', 'published_at']);
    $table->index(['category_id', 'status']);
    $table->index(['featured', 'status', 'published_at']);
    $table->index(['user_id', 'status']);
});

// post_views
Schema::table('post_views', function (Blueprint $table) {
    $table->index(['post_id', 'viewed_at']);
    $table->index('viewed_at');
});

// affiliate_clicks
Schema::table('affiliate_clicks', function (Blueprint $table) {
    $table->index(['affiliate_id', 'clicked_at']);
    $table->index('clicked_at');
});

// subscribers
Schema::table('subscribers', function (Blueprint $table) {
    $table->index(['confirmed', 'lang']);
    $table->index('confirmed_at');
});
```

Usar `try/catch` en cada `addIndex` para no fallar si el índice ya existe.

---

## FASE D — SEO TÉCNICO

**D1. Canonical URLs**

En cada controller público, pasar `canonical` a Inertia:
```php
// HomeController
return Inertia::render('Home', [
    'canonical' => url('/'),
    ...
]);

// PostController@show
return Inertia::render('Blog/Show', [
    'canonical' => url("/blog/{$post->slug}"),
    ...
]);
```

En cada Page de React, agregar en `<Head>`:
```tsx
<link rel="canonical" href={canonical} />
<meta property="og:url" content={canonical} />
```

**D2. hreflang entre versiones ES/EN**

En `PostController@show`, cuando el post tiene `slug_en`:
```php
'alternates' => [
    'es' => url("/blog/{$post->slug}"),
    'en' => $post->slug_en ? url("/en/blog/{$post->slug_en}") : null,
],
```

En `Blog/Show.tsx`, dentro de `<Head>`:
```tsx
<link rel="alternate" hrefLang="es" href={alternates.es} />
{alternates.en && <link rel="alternate" hrefLang="en" href={alternates.en} />}
<link rel="alternate" hrefLang="x-default" href={alternates.es} />
```

**D3. Sitemap completo**

En `SeoController@sitemap`, agregar:
- Todas las categorías: `/categoria/{slug}`
- Versiones EN de posts que tienen `slug_en`
- Páginas estáticas: `/sobre-mi`, `/herramientas`
- Setear `<lastmod>` en todos los posts con `$post->updated_at`

**D4. Campos SEO bilingüe en editor**

En `Posts/Edit.tsx`, dentro del panel SEO colapsable, agregar campos
`meta_title_en` y `meta_description_en` visibles cuando `activeTab === 'en'`
o cuando `data.lang === 'both'`. Con sus respectivos contadores de caracteres.

En `Blog/Show.tsx`, usar condicionalmente:
```tsx
const metaTitle = lang === 'en' && post.meta_title_en
    ? post.meta_title_en
    : post.meta_title || post.title
const metaDesc = lang === 'en' && post.meta_description_en
    ? post.meta_description_en
    : post.meta_description || post.excerpt || ''
```

**D5. OG tags completos en todas las páginas**

En cada Page, asegurarse de que `<Head>` incluye:
```tsx
<meta property="og:type" content="website" />       // o "article" en posts
<meta property="og:locale" content="es_CO" />        // o "en_US" en versión EN
<meta property="og:site_name" content="NeuralRift" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@neuralrift" />
```

**D6. Schema WebSite en Home**

En `Home.tsx`, agregar JSON-LD WebSite con SearchAction:
```tsx
<script type="application/ld+json">{JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NeuralRift",
    "url": "https://neuralrift.com",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://neuralrift.com/blog?search={search_term_string}",
        "query-input": "required name=search_term_string"
    }
})}</script>
```

---

## FASE E — ACCESIBILIDAD

**E1. id="main-content" en todas las páginas públicas**

Agregar `id="main-content"` al elemento `<main>` en:
- `Home.tsx`
- `Blog/Index.tsx`
- `Blog/Show.tsx`
- `Category/Show.tsx`
- `Tools.tsx`
- `About.tsx`

**E2. Skip navigation link**

En `Navbar.tsx`, como primer elemento antes de todo:
```tsx
<a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
               focus:z-[200] focus:px-4 focus:py-2 focus:bg-nr-accent
               focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold
               focus:shadow-lg"
>
    Saltar al contenido principal
</a>
```

**E3. ARIA en mobile menu**

En `Navbar.tsx`, botón hamburger:
```tsx
<button
    aria-expanded={mobileOpen}
    aria-controls="mobile-menu"
    aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
    onClick={() => setMobileOpen(!mobileOpen)}
>
```

Al div del menú mobile:
```tsx
<div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menú de navegación">
```

**E4. aria-live en headline rotativo**

En `Home.tsx`, al `motion.span` con las palabras rotativas:
```tsx
<motion.span
    key={wordIndex}
    aria-live="polite"
    aria-atomic="true"
    ...
>
    {ROTATING_WORDS[wordIndex]}
</motion.span>
```

**E5. Labels en formularios**

En `NewsletterWidget.tsx`:
```tsx
<label htmlFor="newsletter-email" className="sr-only">
    Tu correo electrónico
</label>
<input id="newsletter-email" type="email" ... />
```

Aplicar el mismo patrón a todos los inputs sin label visible en el admin
(Settings, categorías, afiliados). Usar `sr-only` donde el label visual
no sea necesario por contexto.

**E6. ShareButtons — aria-label en lugar de title**

En `ShareButtons.tsx`, reemplazar `title={s.label}` por `aria-label={s.label}`.

**E7. Touch targets mínimos**

En `Navbar.tsx`:
- CTA button: cambiar `py-2` a `py-3` → `min-h-[44px]`
- Lang toggle: agregar `min-h-[44px] min-w-[44px] flex items-center justify-center`
- Hamburger button: agregar `min-h-[44px] min-w-[44px]`

En tablas del admin, todos los botones de acción inline deben tener `min-h-[36px] min-w-[36px]`.

**E8. Focus visible en elementos interactivos**

Auditar todo el CSS del proyecto. Nunca `outline-none` sin alternativa.
Donde haya `outline-none`, agregar:
```css
focus-visible:ring-2 focus-visible:ring-nr-accent focus-visible:ring-offset-2 focus-visible:ring-offset-nr-bg
```

**E9. "Ver todos" visible en mobile**

En `Home.tsx`, en la sección de posts recientes, el link `Ver todos →`
tiene clase `hidden md:block`. Reemplazar por siempre visible pero con
variante mobile debajo del grid:
```tsx
{/* Desktop: junto al título */}
<a href="/blog" className="hidden md:block text-sm text-nr-accent ...">
    Ver todos →
</a>

{/* Mobile: debajo del grid */}
<div className="md:hidden mt-6 text-center">
    <a href="/blog" className="text-sm text-nr-accent ...">
        Ver todos los artículos →
    </a>
</div>
```

**E10. Tools empty state**

En `Tools.tsx`, cambiar el empty state de `"..."` a:
```tsx
<p className="text-nr-faint text-sm" role="status">
    No hay herramientas disponibles en esta categoría.
</p>
```

---

## FASE F — DESIGN SYSTEM

**F1. Agregar tokens faltantes en tailwind.config.js**

Dentro de `theme.extend.colors.nr` agregar:
```js
'accent-dark': '#6d58f0',   // gradient endpoint hardcodeado 4+ veces
'bg-card':     '#0d1117',   // featured card background
'bg-card-alt': '#0d1424',   // variante de featured card
'web-dev':     '#3B82F6',   // nueva categoría Desarrollo Web
'productivity':'#8B5CF6',   // nueva categoría Productividad
'freelancing': '#14B8A6',   // nueva categoría Freelancing
'automation':  '#EF4444',   // nueva categoría Automatización
```

**F2. Reemplazar valores hardcodeados**

Ejecutar búsqueda en todo el proyecto:
```bash
grep -rn "#6d58f0\|#0d1424\|#171035\|#0d1117" resources/js/
```

Reemplazar:
- `to-[#6d58f0]` → `to-nr-accent-dark`
- `from-[#0d1424]` → `from-nr-bg-card-alt`
- `to-[#171035]` → `to-nr-bg-card`
- `from-[#0d1117]` → `from-nr-bg-card`

**F3. Fix KpiCard colores dinámicos en Dashboard**

En `Admin/Dashboard.tsx`, la clase `text-${color}` no es generada por Tailwind
porque usa interpolación dinámica. Reemplazar con un mapa estático:
```tsx
const colorMap: Record<string, string> = {
    accent: 'text-gradient',
    green:  'text-nr-green',
    gold:   'text-nr-gold',
    cyan:   'text-nr-cyan',
}
```
Y usar `colorMap[color] ?? 'text-nr-text'` en el className.

**F4. Reemplazar mesh-bg raw en Blog/Index**

En `Blog/Index.tsx`, reemplazar cualquier `<div className="mesh-bg ...">` inline
por el componente `<MeshBackground />` importado de `@/Components/Layout/MeshBackground`.

**F5. Cursor fallback**

En `resources/css/app.css`:
```css
body { cursor: none; }
body:not(.cursor-ready) { cursor: auto !important; }
```

En `resources/js/app.tsx`, después del setup inicial:
```tsx
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('cursor-ready')
})
```

**F6. Actualizar nr-faint para contraste WCAG**

En `tailwind.config.js`, cambiar:
```js
faint: '#475569',  // antes — falla WCAG AA (2.7:1)
faint: '#6B7280',  // ahora — pasa WCAG AA (4.6:1 contra #080B12)
```

---

## FASE G — EXPANSIÓN DE NICHO

**G1. Nuevas categorías en CategorySeeder**

Agregar estas 4 categorías al array en `CategorySeeder.php`:
```php
[
    'name'        => 'Desarrollo Web',
    'name_en'     => 'Web Dev',
    'color'       => '#3B82F6',
    'icon'        => '⟨/⟩',
    'order'       => 7,
    'description' => 'Laravel, React, Inertia, deploy y arquitectura web moderna.',
    'description_en' => 'Laravel, React, Inertia, deployment and modern web architecture.',
],
[
    'name'        => 'Productividad',
    'name_en'     => 'Productivity',
    'color'       => '#8B5CF6',
    'icon'        => '⊡',
    'order'       => 8,
    'description' => 'Herramientas y sistemas para trabajar mejor y en menos tiempo.',
    'description_en' => 'Tools and systems to work smarter and faster.',
],
[
    'name'        => 'Freelancing',
    'name_en'     => 'Freelancing',
    'color'       => '#14B8A6',
    'icon'        => '◆',
    'order'       => 9,
    'description' => 'Cómo conseguir clientes, cobrar en dólares y escalar como freelancer desde LATAM.',
    'description_en' => 'How to get clients, charge in USD and scale as a freelancer from LATAM.',
],
[
    'name'        => 'Automatización',
    'name_en'     => 'Automation',
    'color'       => '#EF4444',
    'icon'        => '⟳',
    'order'       => 10,
    'description' => 'Make, n8n, Zapier y flujos de trabajo que ahorran horas cada semana.',
    'description_en' => 'Make, n8n, Zapier and workflows that save hours every week.',
],
```

**G2. Nuevos afiliados en AffiliateSeeder**

Agregar al array en `AffiliateSeeder.php`:
```php
[
    'name'             => 'DigitalOcean',
    'url'              => 'https://m.do.co/c/TUREFCODE',
    'website'          => 'https://digitalocean.com',
    'description'      => 'Cloud hosting para developers. El mejor VPS para proyectos Laravel y Node.',
    'commission'       => '$200 USD por referido calificado',
    'commission_type'  => 'one_time',
    'commission_value' => 200,
    'cookie_duration'  => '90 días',
    'pros'             => ['Comisión altísima', 'Marca muy reconocida', 'Cookie de 90 días'],
    'cons'             => ['Pago único, no recurrente', 'El referido debe gastar $25+'],
    'rating'           => 4.8,
    'category'         => 'Cloud / Hosting',
    'badge'            => 'Lo uso en producción',
    'featured'         => true,
    'active'           => true,
],
[
    'name'             => 'Make.com',
    'url'              => 'https://make.com?ref=TUREFCODE',
    'website'          => 'https://make.com',
    'description'      => 'La mejor plataforma de automatización visual. Conéctalo todo con IA.',
    'commission'       => '20% recurrente',
    'commission_type'  => 'recurring',
    'commission_value' => 20,
    'cookie_duration'  => '30 días',
    'pros'             => ['Comisión recurrente', 'Producto con alta retención', 'Muy popular en LATAM'],
    'cons'             => ['Competencia alta con Zapier'],
    'rating'           => 4.7,
    'category'         => 'Automatización',
    'badge'            => 'Partner Oficial',
    'featured'         => true,
    'active'           => true,
],
[
    'name'             => 'Surfer SEO',
    'url'              => 'https://surferseo.com?ref=TUREFCODE',
    'website'          => 'https://surferseo.com',
    'description'      => 'La herramienta de SEO con IA que uso para optimizar cada artículo de NeuralRift.',
    'commission'       => '25% recurrente',
    'commission_type'  => 'recurring',
    'commission_value' => 25,
    'cookie_duration'  => '60 días',
    'pros'             => ['Comisión recurrente', 'Nicho SEO muy rentable', 'Alta conversión'],
    'cons'             => ['Precio alto puede frenar conversión'],
    'rating'           => 4.6,
    'category'         => 'SEO',
    'badge'            => 'Lo uso diariamente',
    'featured'         => false,
    'active'           => true,
],
[
    'name'             => 'Wise',
    'url'              => 'https://wise.com/invite/TUREFCODE',
    'website'          => 'https://wise.com',
    'description'      => 'La forma más barata de recibir dólares desde Colombia y LATAM como freelancer.',
    'commission'       => 'Bonus por referido activo',
    'commission_type'  => 'one_time',
    'commission_value' => 50,
    'cookie_duration'  => '30 días',
    'pros'             => ['Muy relevante para audiencia LATAM', 'Alta conversión', 'Producto que la gente necesita'],
    'cons'             => ['Comisión variable según país'],
    'rating'           => 4.9,
    'category'         => 'Finanzas',
    'badge'            => 'Lo uso personalmente',
    'featured'         => true,
    'active'           => true,
],
```

**G3. Actualizar TagSeeder con nuevos tags**

Agregar al array en `TagSeeder.php`:
```php
'Laravel', 'React', 'Inertia.js', 'Vite', 'Deploy',
'Freelance', 'Make.com', 'n8n', 'Zapier',
'Notion', 'Productividad', 'Automatización',
'DigitalOcean', 'Cobrar en dólares', 'LATAM',
```

**G4. Actualizar constantes del frontend**

En `resources/js/lib/constants.ts`:

Actualizar `SITE`:
```ts
export const SITE = {
    name:        'NeuralRift',
    tagline:     'Tecnología, IA y herramientas para construir mejor',
    taglineEn:   'Tech, AI & tools to build smarter',
    url:         'https://neuralrift.com',
    twitter:     '@neuralrift',
    description: 'Guías técnicas, reviews honestas y estrategias para developers y freelancers que quieren construir mejores productos con tecnología e IA.',
    descriptionEn: 'Technical guides, honest reviews and strategies for developers and freelancers building better products with tech and AI.',
    lang:        ['es', 'en'] as const,
}
```

Actualizar `CATEGORY_COLORS`:
```ts
export const CATEGORY_COLORS: Record<string, string> = {
    'IA Generativa':  '#7C6AF7',
    'Herramientas':   '#06B6D4',
    'Tutoriales':     '#10B981',
    'Reviews':        '#F59E0B',
    'Negocios':       '#EC4899',
    'Noticias':       '#F97316',
    'Desarrollo Web': '#3B82F6',  // nuevo
    'Productividad':  '#8B5CF6',  // nuevo
    'Freelancing':    '#14B8A6',  // nuevo
    'Automatización': '#EF4444',  // nuevo
}
```

Actualizar `ROTATING_WORDS` en `Home.tsx`:
```ts
const ROTATING_WORDS = [
    'Inteligencia Artificial',
    'Desarrollo Web',
    'Automatización',
    'Freelancing Digital',
    'Herramientas Tech',
]
```

**G5. Actualizar meta description global en HandleInertiaRequests**

En `app/Http/Middleware/HandleInertiaRequests.php`, actualizar `site`:
```php
'site' => [
    'name'           => 'NeuralRift',
    'tagline'        => 'Tecnología, IA y herramientas para construir mejor',
    'twitter'        => '@neuralrift',
    'description'    => 'Guías técnicas, reviews honestas y estrategias para developers y freelancers que quieren construir mejores productos con tecnología e IA.',
],
```

**G6. Nav — renombrar "Herramientas IA" a "Herramientas"**

En `resources/js/lib/constants.ts`, actualizar `NAV_LINKS`:
```ts
{ label: 'Herramientas', labelEn: 'Tools', href: '/herramientas' },
```

---

## FASE H — REFACTOR ARQUITECTURA (Service Layer + Repositories)

Implementar la estructura profesional completa:

**Repositories:**
- `app/Repositories/Contracts/PostRepositoryInterface.php`
- `app/Repositories/Contracts/AffiliateRepositoryInterface.php`
- `app/Repositories/Contracts/CategoryRepositoryInterface.php`
- `app/Repositories/PostRepository.php`
- `app/Repositories/AffiliateRepository.php`
- `app/Repositories/CategoryRepository.php`

Cada Repository implementa su Interface.
Los métodos deben cubrir todas las queries que actualmente están en Controllers.

Bind en `AppServiceProvider`:
```php
$this->app->bind(PostRepositoryInterface::class, PostRepository::class);
$this->app->bind(AffiliateRepositoryInterface::class, AffiliateRepository::class);
$this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
```

**Services:**
- `app/Services/PostService.php` — usa PostRepository, maneja lógica compleja de posts
- `app/Services/AffiliateService.php` — tracking, click handling, stats
- `app/Services/AnalyticsService.php` — agrega métricas del dashboard y analytics

**Eloquent Resources:**
- `app/Http/Resources/PostResource.php` — transforma Post para el frontend
- `app/Http/Resources/PostCollection.php` — paginación de posts
- `app/Http/Resources/AffiliateResource.php`
- `app/Http/Resources/CategoryResource.php`

Los Resources deben excluir campos sensibles (IPs, tokens) y formatear fechas.

**Form Requests pendientes:**
- `app/Http/Requests/StorePostRequest.php`
- `app/Http/Requests/UpdatePostRequest.php`
- `app/Http/Requests/StoreAffiliateRequest.php`
- `app/Http/Requests/UpdateAffiliateRequest.php`
- `app/Http/Requests/StoreCategoryRequest.php`
- `app/Http/Requests/UpdateCategoryRequest.php`
- `app/Http/Requests/StoreImageUploadRequest.php`
  (validar: image, mimes:jpg,jpeg,png,webp, max:5120)

**Policies:**
- `app/Policies/PostPolicy.php`: viewAny, view, create, update, delete, publish, duplicate
- `app/Policies/AffiliatePolicy.php`: viewAny, create, update, delete, toggleActive
- `app/Policies/CategoryPolicy.php`: viewAny, create, update, delete

Registrar en `AuthServiceProvider` o directamente en `AppServiceProvider`.
Usar `$this->authorize()` en todos los métodos de controllers admin.

**Custom hooks frontend pendientes:**
- `resources/js/hooks/useNewsletterForm.ts` — extraer lógica de submit de NewsletterWidget
- `resources/js/hooks/usePostFilters.ts` — extraer lógica de filtros de Blog/Index
- `resources/js/hooks/useAdminTable.ts` — extraer lógica de filtros/búsqueda de Posts/Index

---

## ORDEN DE EJECUCIÓN Y VERIFICACIÓN

Implementa en este orden exacto:

```
FASE A → FASE B → FASE C → FASE D → FASE E → FASE F → FASE G → FASE H
```

Después de cada fase, verificar:
```bash
php artisan test          # si hay tests
php artisan route:list --path=admin  # verificar rutas admin protegidas
npm run build             # 0 errores TypeScript
```

Después de FASE G, correr:
```bash
php artisan migrate:fresh --seed   # aplicar índices y seeders actualizados
```

Al finalizar TODO, mostrar resumen organizado por fase:
- Archivo creado o modificado
- Qué cambió y por qué
- Si algo no fue implementado, explicar por qué y proponer alternativa

---

## NOTAS IMPORTANTES

- El diseño visual (glassmorphism, gradient text en logo, nodos constelación,
  Playfair Display, colores accent/cyan) NO debe modificarse. Solo tocar CSS
  si un fix de accesibilidad lo requiere y siempre preservando la estética.
- Si encuentras código duplicado o muerto además de lo listado, elimínalo.
- Si encuentras un patrón que viola SOLID además de lo listado, refactorízalo.
- Prioriza no romper funcionalidad existente. Si un refactor es de alto riesgo,
  hazlo en un paso separado con un comentario explicando el cambio.
