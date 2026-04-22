// resources/js/lib/constants.ts

export const CATEGORY_COLORS: Record<string, string> = {
    'IA Generativa': '#7C6AF7',
    Herramientas: '#06B6D4',
    Tutoriales: '#10B981',
    Reviews: '#F59E0B',
    Negocios: '#EC4899',
    Noticias: '#F97316',
    'Desarrollo Web': '#3B82F6',
    Productividad: '#8B5CF6',
    Freelancing: '#14B8A6',
    Automatización: '#EF4444',
}

export const SITE = {
    name: 'NeuralRift',
    tagline: 'Tecnología, IA y herramientas para construir mejor',
    taglineEn: 'Tech, AI & tools to build smarter',
    url: 'https://neuralrift.com',
    twitter: '@neuralrift',
    description:
        'Guías técnicas, reviews honestas y estrategias para developers y freelancers que quieren construir mejores productos con tecnología e IA.',
    descriptionEn:
        'Technical guides, honest reviews and strategies for developers and freelancers building better products with tech and AI.',
    lang: ['es', 'en'] as const,
}

export const NAV_LINKS = [
    { label: 'Blog', labelEn: 'Blog', href: '/blog' },
    { label: 'Categorías', labelEn: 'Categories', href: '/categorias' },
    { label: 'Herramientas', labelEn: 'Tools', href: '/herramientas' },
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
