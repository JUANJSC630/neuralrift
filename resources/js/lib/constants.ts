// resources/js/lib/constants.ts

export const CATEGORY_COLORS: Record<string, string> = {
    'IA Generativa': '#7C6AF7',
    Herramientas: '#06B6D4',
    Tutoriales: '#10B981',
    Reviews: '#F59E0B',
    Negocios: '#EC4899',
    Noticias: '#F97316',
}

export const SITE = {
    name: 'NeuralRift',
    tagline: 'El futuro de la IA empieza aquí',
    url: 'https://neuralrift.com',
    twitter: '@neuralrift',
    description:
        'Guías en profundidad, reviews honestas y estrategias para navegar la revolución de la IA.',
    lang: ['es', 'en'] as const,
}

export const NAV_LINKS = [
    { label: 'Blog', labelEn: 'Blog', href: '/blog' },
    { label: 'Categorías', labelEn: 'Categories', href: '/categorias' },
    { label: 'Herramientas IA', labelEn: 'AI Tools', href: '/herramientas' },
    { label: 'Newsletter', labelEn: 'Newsletter', href: '/#newsletter' },
    { label: 'Sobre mí', labelEn: 'About', href: '/sobre-mi' },
]

export const ADMIN_NAV = [
    { icon: '◈', label: 'Dashboard', href: '/admin' },
    { icon: '✦', label: 'Artículos', href: '/admin/posts' },
    { icon: '⊞', label: 'Categorías', href: '/admin/categories' },
    { icon: '⚡', label: 'Afiliados', href: '/admin/affiliates' },
    { icon: '◉', label: 'Newsletter', href: '/admin/newsletter' },
    { icon: '≋', label: 'Analytics', href: '/admin/analytics' },
    { icon: '⚙', label: 'Ajustes', href: '/admin/settings' },
]
