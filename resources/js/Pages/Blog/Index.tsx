import { Head, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import PostCard from '@/Components/Blog/PostCard'
import { CATEGORY_COLORS, SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'
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

export default function BlogIndex({ posts, filters }: Props) {
    const { categories } = usePage<PageProps>().props
    const { locale, t, localePath } = useLocale()
    const [search, setSearch] = useState(filters.search ?? '')
    const blogPath = localePath('/blog')

    const SORT_OPTIONS = [
        { value: 'recent', label: t('blog.sort_recent') },
        { value: 'popular', label: t('blog.sort_popular') },
        { value: 'shortest', label: t('blog.sort_shortest') },
    ]

    const navigate = (params: Partial<Filters & { search?: string }>) => {
        router.get(blogPath, { ...filters, ...params }, { preserveState: true })
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        navigate({ search })
    }

    const clearFilters = () => {
        setSearch('')
        router.get(blogPath, {}, { preserveState: false })
    }

    const hasActiveFilters = !!(filters.search || filters.tag || filters.category)

    return (
        <>
            <Head title={`Blog — ${SITE.name}`}>
                <meta name="description" content={t('blog.subtitle')} />
            </Head>

            <Navbar />

            <main className="min-h-screen bg-nr-bg pt-[70px]">
                {/* Hero */}
                <section className="relative overflow-hidden border-b border-white/[0.05]">
                    <div className="mesh-bg pointer-events-none absolute inset-0" />
                    <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="font-mono text-xs uppercase tracking-widest text-nr-accent">
                                {t('blog.all_articles')} · {posts.total}
                            </span>
                            <h1 className="mt-2 font-display text-5xl font-black text-nr-text md:text-6xl">
                                Blog
                            </h1>
                            <p className="mt-3 max-w-xl text-lg text-nr-muted">
                                {t('blog.subtitle')}
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-6 py-12 md:px-12">
                    {/* Search + Sort */}
                    <div className="mb-8 flex flex-col gap-4 md:flex-row">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={t('blog.search_placeholder')}
                                className="glass flex-1 rounded-xl px-4 py-2.5 text-sm text-nr-text placeholder-nr-faint outline-none transition-colors focus:border-nr-accent/50"
                            />
                            <button
                                type="submit"
                                className="rounded-xl bg-gradient-to-r from-nr-accent to-nr-accent-dark px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                            >
                                {t('blog.search')}
                            </button>
                        </form>

                        <div className="flex flex-shrink-0 gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {SORT_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => navigate({ sort: opt.value })}
                                    className={`flex-shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                                        (filters.sort ?? 'recent') === opt.value
                                            ? 'border border-nr-accent/30 bg-nr-accent/20 text-nr-accent'
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
                        <div className="mb-10 flex flex-wrap gap-2">
                            <button
                                onClick={() => navigate({ category: undefined })}
                                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                                    !filters.category
                                        ? 'border border-nr-accent/30 bg-nr-accent/20 text-nr-accent'
                                        : 'glass text-nr-faint hover:text-nr-muted'
                                }`}
                            >
                                {t('blog.all_categories')}
                            </button>
                            {categories.map((cat: Category) => {
                                const color = CATEGORY_COLORS[cat.name] ?? cat.color ?? '#7C6AF7'
                                const isActive = filters.category === cat.slug
                                const catName =
                                    locale === 'en' && cat.name_en ? cat.name_en : cat.name
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => navigate({ category: cat.slug })}
                                        className="rounded-full px-4 py-1.5 text-xs font-semibold transition-all"
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
                                        {catName}
                                    </button>
                                )
                            })}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="glass rounded-full px-3 py-1.5 text-xs text-nr-faint transition-colors hover:text-nr-red"
                                >
                                    {t('blog.clear_filters')}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Grid */}
                    {posts.data.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                        <div className="py-24 text-center text-nr-faint">
                            <div className="mb-4 text-4xl opacity-20">◈</div>
                            <p>{t('blog.no_results')}</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="mt-12 flex justify-center gap-2">
                            {posts.links.map((link, i) =>
                                link.url ? (
                                    <button
                                        key={i}
                                        onClick={() => router.get(link.url!)}
                                        className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                                            link.active
                                                ? 'bg-nr-accent text-white'
                                                : 'glass text-nr-faint hover:text-nr-muted'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="rounded-lg px-4 py-2 text-sm text-nr-faint/30"
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
