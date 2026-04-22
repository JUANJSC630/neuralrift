// resources/js/lib/i18n.ts
// Centralized translations for the bilingual UI

export type Locale = 'es' | 'en'

const translations = {
    // ── Navbar / Layout ──────────────────────────────
    'nav.blog': { es: 'Blog', en: 'Blog' },
    'nav.categories': { es: 'Categorías', en: 'Categories' },
    'nav.tools': { es: 'Herramientas IA', en: 'AI Tools' },
    'nav.newsletter': { es: 'Newsletter', en: 'Newsletter' },
    'nav.about': { es: 'Sobre mí', en: 'About' },
    'nav.subscribe': { es: '✦ Suscribirse', en: '✦ Subscribe' },
    'nav.skip': { es: 'Saltar al contenido', en: 'Skip to content' },
    'nav.openMenu': { es: 'Abrir menú', en: 'Open menu' },
    'nav.closeMenu': { es: 'Cerrar menú', en: 'Close menu' },
    'nav.changeLang': { es: 'Switch to English', en: 'Cambiar a Español' },

    // ── Footer ───────────────────────────────────────
    'footer.navigation': { es: 'Navegación', en: 'Navigation' },
    'footer.legal': { es: 'Legal', en: 'Legal' },
    'footer.privacy': { es: 'Privacidad', en: 'Privacy' },
    'footer.terms': { es: 'Términos', en: 'Terms' },
    'footer.cookies': { es: 'Cookies', en: 'Cookies' },
    'footer.affiliates': { es: 'Afiliados', en: 'Affiliates' },
    'footer.affiliate_disclosure': {
        es: 'Este blog contiene links de afiliado. Si compras a través de ellos recibo una comisión sin costo adicional para ti.',
        en: 'This blog contains affiliate links. If you purchase through them I earn a commission at no extra cost to you.',
    },
    'footer.tagline': {
        es: 'Guías en profundidad, reviews honestas y estrategias para navegar la revolución de la IA. Sin ruido, sin hype.',
        en: 'In-depth guides, honest reviews and strategies to navigate the AI revolution. No noise, no hype.',
    },
    'footer.made': { es: 'Hecho con ☕ desde Colombia', en: 'Made with ☕ from Colombia' },

    // ── Home page ────────────────────────────────────
    'home.badge': { es: 'Nuevo artículo publicado hoy', en: 'New article published today' },
    'home.headline_prefix': { es: 'El futuro de', en: 'The future of' },
    'home.headline_suffix': { es: 'empieza aquí', en: 'starts here' },
    'home.subheadline': {
        es: 'Guías en profundidad, reviews honestas y estrategias para navegar la revolución de la IA. Semanalmente, sin ruido.',
        en: 'In-depth guides, honest reviews and strategies to navigate the AI revolution. Weekly, no noise.',
    },
    'home.cta_blog': { es: 'Explorar artículos →', en: 'Explore articles →' },
    'home.cta_newsletter': { es: 'Newsletter gratuita ✉', en: 'Free newsletter ✉' },
    'home.recent_title': { es: 'Artículos recientes', en: 'Recent articles' },
    'home.recent_subtitle': { es: 'Lo último del mundo de la IA', en: 'Latest from the AI world' },
    'home.view_all': { es: 'Ver todos →', en: 'View all →' },
    'home.view_all_articles': { es: 'Ver todos los artículos →', en: 'View all articles →' },
    'home.tools_label': { es: 'Herramientas que uso', en: 'Tools I use' },
    'home.tools_title': { es: 'Las mejores herramientas IA', en: 'The best AI tools' },
    'home.tools_subtitle': {
        es: 'Solo recomiendo herramientas que uso personalmente. Algunos links son de afiliado.',
        en: 'I only recommend tools I personally use. Some links are affiliate links.',
    },

    // ── Rotating words (Home hero) ───────────────────
    'home.rotating.0': { es: 'Inteligencia Artificial', en: 'Artificial Intelligence' },
    'home.rotating.1': { es: 'Modelos de Lenguaje', en: 'Language Models' },
    'home.rotating.2': { es: 'Automatización IA', en: 'AI Automation' },
    'home.rotating.3': { es: 'El Futuro Digital', en: 'The Digital Future' },

    // ── Blog listing ─────────────────────────────────
    'blog.all_articles': { es: 'Todos los artículos', en: 'All articles' },
    'blog.title': { es: 'Blog', en: 'Blog' },
    'blog.subtitle': {
        es: 'Guías, análisis y estrategias sobre el mundo de la IA.',
        en: 'Guides, analysis and strategies about the AI world.',
    },
    'blog.search_placeholder': { es: 'Buscar artículos...', en: 'Search articles...' },
    'blog.search': { es: 'Buscar', en: 'Search' },
    'blog.sort_recent': { es: 'Más recientes', en: 'Most recent' },
    'blog.sort_popular': { es: 'Más populares', en: 'Most popular' },
    'blog.sort_shortest': { es: 'Más cortos', en: 'Shortest' },
    'blog.all_categories': { es: 'Todas', en: 'All' },
    'blog.clear_filters': { es: '✕ Limpiar', en: '✕ Clear' },
    'blog.no_results': { es: 'No se encontraron artículos.', en: 'No articles found.' },

    // ── Blog post ────────────────────────────────────
    'post.home': { es: 'Inicio', en: 'Home' },
    'post.blog': { es: 'Blog', en: 'Blog' },
    'post.featured': { es: '★ Destacado', en: '★ Featured' },
    'post.views': { es: 'vistas', en: 'views' },
    'post.share_cta': { es: '¿Te resultó útil? Compártelo', en: 'Found it useful? Share it' },
    'post.tools_mentioned': { es: 'Herramientas mencionadas', en: 'Tools mentioned' },
    'post.related': { es: 'Artículos relacionados', en: 'Related articles' },
    'post.sidebar_newsletter_title': { es: '¿Te gusta el contenido?', en: 'Enjoying the content?' },
    'post.sidebar_newsletter_text': {
        es: 'Únete a la newsletter semanal de IA.',
        en: 'Join the weekly AI newsletter.',
    },
    'post.sidebar_subscribe': { es: 'Suscribirse', en: 'Subscribe' },
    'post.featured_badge': { es: '★ ARTÍCULO DESTACADO', en: '★ FEATURED ARTICLE' },

    // ── Category ─────────────────────────────────────
    'category.articles_count': { es: 'artículos', en: 'articles' },

    // ── Tools page ───────────────────────────────────
    'tools.label': { es: 'Herramientas recomendadas', en: 'Recommended tools' },
    'tools.title': { es: 'Las mejores herramientas IA', en: 'The best AI tools' },
    'tools.subtitle': {
        es: 'Solo recomiendo herramientas que uso o he probado personalmente. Algunos links son de afiliado.',
        en: 'I only recommend tools I use or have personally tested. Some links are affiliate links.',
    },
    'tools.all': { es: 'Todas', en: 'All' },
    'tools.cta': { es: 'Ver herramienta →', en: 'View tool →' },

    // ── About page ───────────────────────────────────
    'about.greeting': { es: 'Hola, soy', en: "Hi, I'm" },
    'about.bio': {
        es: 'Desarrollador y apasionado de la IA desde Colombia. Escribo sobre tecnología, herramientas y cómo monetizar en la era de la inteligencia artificial.',
        en: 'Developer and AI enthusiast from Colombia. I write about technology, tools and how to monetize in the age of artificial intelligence.',
    },
    'about.why_title': { es: 'Por qué NeuralRift', en: 'Why NeuralRift' },
    'about.why_p1': {
        es: 'Empecé NeuralRift porque me frustré con el ruido que rodea a la inteligencia artificial. Demasiado hype, demasiadas promesas vacías, muy poco análisis honesto.',
        en: 'I started NeuralRift because I was frustrated with the noise surrounding artificial intelligence. Too much hype, too many empty promises, too little honest analysis.',
    },
    'about.why_p2': {
        es: 'Como desarrollador, tengo acceso directo a estas herramientas y puedo evaluarlas técnicamente — no solo marketinescamente. Aquí encontrarás análisis reales basados en uso real.',
        en: "As a developer, I have direct access to these tools and can evaluate them technically — not just from a marketing perspective. Here you'll find real analysis based on real usage.",
    },
    'about.why_p3': {
        es: 'El objetivo es simple: ayudarte a navegar la revolución de la IA sin perder tiempo ni dinero en herramientas que no valen la pena.',
        en: "The goal is simple: help you navigate the AI revolution without wasting time or money on tools that aren't worth it.",
    },
    'about.skills_title': { es: 'Áreas de expertise', en: 'Areas of expertise' },
    'about.collab_title': { es: '¿Colaboraciones?', en: 'Collaborations?' },
    'about.collab_text': {
        es: 'Estoy abierto a reviews patrocinadas, colaboraciones y menciones de herramientas que realmente valgan la pena. Solo trabajo con productos que usaría yo mismo.',
        en: "I'm open to sponsored reviews, collaborations and mentions of tools that are truly worth it. I only work with products I'd use myself.",
    },
    'about.stats.articles': { es: 'Artículos publicados', en: 'Published articles' },
    'about.stats.readers': { es: 'Lectores mensuales', en: 'Monthly readers' },
    'about.stats.subscribers': { es: 'Suscriptores', en: 'Subscribers' },
    'about.stats.countries': { es: 'Países', en: 'Countries' },

    // ── Newsletter ───────────────────────────────────
    'newsletter.label': { es: 'Newsletter gratuita', en: 'Free newsletter' },
    'newsletter.title_1': { es: 'La IA no espera.', en: "AI doesn't wait." },
    'newsletter.title_2': { es: 'Tú tampoco deberías.', en: 'Neither should you.' },
    'newsletter.subtitle': {
        es: 'Cada semana: un artículo en profundidad, una herramienta que vale la pena y una estrategia que puedes aplicar hoy. Sin spam.',
        en: 'Every week: an in-depth article, a tool worth trying and a strategy you can apply today. No spam.',
    },
    'newsletter.benefit_1': { es: '📖 1 artículo semanal', en: '📖 1 weekly article' },
    'newsletter.benefit_2': { es: '🛠 Herramientas IA', en: '🛠 AI tools' },
    'newsletter.benefit_3': {
        es: '💰 Estrategias de monetización',
        en: '💰 Monetization strategies',
    },
    'newsletter.success': {
        es: '¡Genial! Revisa tu email para confirmar.',
        en: 'Great! Check your email to confirm.',
    },
    'newsletter.error': {
        es: 'Algo salió mal. Intenta de nuevo.',
        en: 'Something went wrong. Try again.',
    },
    'newsletter.placeholder': { es: 'tu@email.com', en: 'you@email.com' },
    'newsletter.sending': { es: 'Enviando...', en: 'Sending...' },
    'newsletter.submit': { es: 'Suscribirme →', en: 'Subscribe →' },
    'newsletter.no_spam': {
        es: 'Sin spam. Baja cuando quieras.',
        en: 'No spam. Unsubscribe anytime.',
    },

    // ── PostCard ──────────────────────────────────────
    'postcard.views': { es: 'vistas', en: 'views' },

    // ── Misc / shared ────────────────────────────────
    'misc.back_home': { es: '← Volver al inicio', en: '← Back to home' },
    'misc.view_blog': { es: 'Ver blog ↗', en: 'View blog ↗' },
    'misc.rss': { es: 'RSS Feed', en: 'RSS Feed' },
    'misc.sitemap': { es: 'Sitemap', en: 'Sitemap' },
} as const

type TranslationKey = keyof typeof translations

/**
 * Get translated string for the given key and locale.
 */
export function t(key: TranslationKey, locale: Locale): string {
    const entry = translations[key]
    return entry?.[locale] ?? entry?.es ?? key
}

/**
 * Build locale-aware paths.
 * ES: /blog  |  EN: /en/blog
 */
export function localePath(path: string, locale: Locale): string {
    if (locale === 'es') return path
    return `/en${path}`
}

/**
 * Get the alternate locale.
 */
export function altLocale(locale: Locale): Locale {
    return locale === 'es' ? 'en' : 'es'
}

/**
 * Get the URL-based path map for locale switching.
 * Maps ES paths to EN paths and vice versa.
 */
export const LOCALE_ROUTES: Record<string, Record<string, string>> = {
    es: {
        '/': '/en',
        '/blog': '/en/blog',
        '/categorias': '/en/categories',
        '/herramientas': '/en/tools',
        '/sobre-mi': '/en/about',
        '/privacidad': '/en/privacy',
        '/terminos': '/en/terms',
        '/cookies': '/en/cookies',
        '/afiliados': '/en/affiliates',
    },
    en: {
        '/en': '/',
        '/en/blog': '/blog',
        '/en/categories': '/categorias',
        '/en/tools': '/herramientas',
        '/en/about': '/sobre-mi',
        '/en/privacy': '/privacidad',
        '/en/terms': '/terminos',
        '/en/cookies': '/cookies',
        '/en/affiliates': '/afiliados',
    },
}

/**
 * Nav links for a given locale.
 */
export function getNavLinks(locale: Locale) {
    return [
        { label: t('nav.blog', locale), href: localePath('/blog', locale) },
        {
            label: t('nav.categories', locale),
            href: locale === 'es' ? '/categorias' : '/en/categories',
        },
        { label: t('nav.tools', locale), href: locale === 'es' ? '/herramientas' : '/en/tools' },
        {
            label: t('nav.newsletter', locale),
            href: locale === 'es' ? '/#newsletter' : '/en#newsletter',
        },
        { label: t('nav.about', locale), href: locale === 'es' ? '/sobre-mi' : '/en/about' },
    ]
}

/**
 * Legal links for a given locale.
 */
export function getLegalLinks(locale: Locale) {
    return [
        {
            label: t('footer.privacy', locale),
            href: locale === 'es' ? '/privacidad' : '/en/privacy',
        },
        { label: t('footer.terms', locale), href: locale === 'es' ? '/terminos' : '/en/terms' },
        { label: t('footer.cookies', locale), href: locale === 'es' ? '/cookies' : '/en/cookies' },
        {
            label: t('footer.affiliates', locale),
            href: locale === 'es' ? '/afiliados' : '/en/affiliates',
        },
    ]
}
