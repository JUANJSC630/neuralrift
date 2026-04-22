import { Head, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import PostCard from '@/Components/Blog/PostCard'
import { CATEGORY_COLORS, SITE } from '@/lib/constants'
import type { Post, Category, PaginatedData, PageProps } from '@/types'

interface Filters {
    category?: string
    tag?: string
    search?: string
    sort?: string
}

interface Props {
    posts: PaginatedData<Post>
    filters: Filters
    lang: 'es' | 'en'
}

const SORT_OPTIONS = [
    { value: 'recent', label: 'Más recientes' },
    { value: 'popular', label: 'Más populares' },
    { value: 'shortest', label: 'Más cortos' },
]

export default function BlogIndex({ posts, filters, lang }: Props) {
    const { categories } = usePage<PageProps>().props
    const [search, setSearch] = useState(filters.search ?? '')
    const isEn = lang === 'en'

    const navigate = (params: Partial<Filters & { search?: string }>) => {
        router.get('/blog', { ...filters, ...params }, { preserveState: true })
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        navigate({ search })
    }

    const clearFilters = () => {
        setSearch('')
        router.get('/blog', {}, { preserveState: false })
    }

    const hasActiveFilters = !!(filters.search || filters.tag || filters.category)

    return (
        <>
            <Head title={`Blog — ${SITE.name}`}>
                <meta
                    name="description"
                    content="Artículos en profundidad sobre IA, herramientas y estrategias."
                />
            </Head>

            <Navbar />

            <main className="pt-[70px] min-h-screen bg-nr-bg">
                {/* Hero */}
                <section className="relative overflow-hidden border-b border-white/[0.05]">
                    <div className="mesh-bg absolute inset-0 pointer-events-none" />
                    <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="text-xs font-mono text-nr-accent tracking-widest uppercase">
                                {isEn ? 'All articles' : 'Todos los artículos'} · {posts.total}
                            </span>
                            <h1 className="font-display text-5xl md:text-6xl font-black text-nr-text mt-2">
                                Blog
                            </h1>
                            <p className="text-nr-muted mt-3 max-w-xl text-lg">
                                {isEn
                                    ? 'Guides, analysis and strategies about the AI world.'
                                    : 'Guías, análisis y estrategias sobre el mundo de la IA.'}
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                    {/* Search + Sort */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={isEn ? 'Search articles...' : 'Buscar artículos...'}
                                className="flex-1 px-4 py-2.5 glass rounded-xl text-sm text-nr-text
                                           placeholder-nr-faint focus:border-nr-accent/50 outline-none
                                           transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                                               bg-gradient-to-r from-nr-accent to-nr-accent-dark
                                               hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {isEn ? 'Search' : 'Buscar'}
                            </button>
                        </form>

                        <div
                            className="flex gap-2 overflow-x-auto flex-shrink-0
                                        [scrollbar-width:none] [-ms-overflow-style:none]
                                        [&::-webkit-scrollbar]:hidden"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => navigate({ sort: opt.value })}
                                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                                            ${
                                                (filters.sort ?? 'recent') === opt.value
                                                    ? 'bg-nr-accent/20 border border-nr-accent/30 text-nr-accent'
                                                    : 'glass text-nr-faint hover:text-nr-muted'
                                            }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category pills */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-10">
                            <button
                                onClick={() => navigate({ category: undefined })}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all
                                    ${
                                        !filters.category
                                            ? 'bg-nr-accent/20 border border-nr-accent/30 text-nr-accent'
                                            : 'glass text-nr-faint hover:text-nr-muted'
                                    }`}
                            >
                                Todas
                            </button>
                            {categories.map((cat: Category) => {
                                const color = CATEGORY_COLORS[cat.name] ?? cat.color ?? '#7C6AF7'
                                const isActive = filters.category === cat.slug
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => navigate({ category: cat.slug })}
                                        className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                                        style={
                                            isActive
                                                ? {
                                                      background: `${color}25`,
                                                      border: `1px solid ${color}40`,
                                                      color,
                                                  }
                                                : {
                                                      background: 'rgba(255,255,255,0.04)',
                                                      border: '1px solid rgba(255,255,255,0.08)',
                                                      color: '#6B7C94',
                                                  }
                                        }
                                    >
                                        {cat.name}
                                    </button>
                                )
                            })}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="px-3 py-1.5 rounded-full text-xs glass
                                               text-nr-faint hover:text-nr-red transition-colors"
                                >
                                    ✕ Limpiar
                                </button>
                            )}
                        </div>
                    )}

                    {/* Grid */}
                    {posts.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.data.map((post, i) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.06 }}
                                >
                                    <PostCard post={post} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 text-nr-faint">
                            <div className="text-4xl mb-4 opacity-20">◈</div>
                            <p>No se encontraron artículos.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-12">
                            {posts.links.map((link, i) =>
                                link.url ? (
                                    <button
                                        key={i}
                                        onClick={() => router.get(link.url!)}
                                        className={`px-4 py-2 rounded-lg text-sm transition-colors
                                                ${
                                                    link.active
                                                        ? 'bg-nr-accent text-white'
                                                        : 'glass text-nr-faint hover:text-nr-muted'
                                                }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="px-4 py-2 rounded-lg text-sm text-nr-faint/30"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ),
                            )}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </>
    )
}
