import { Head, router } from '@inertiajs/react'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import AffiliateWidget from '@/Components/Blog/AffiliateWidget'
import { SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'
import type { Affiliate, PaginatedData } from '@/types'

const PER_PAGE = 9

interface Props {
    affiliates: PaginatedData<Affiliate>
    categories: string[]
    filters: { category?: string }
}

export default function Tools({ affiliates, categories, filters }: Props) {
    const { t } = useLocale()
    const [items, setItems] = useState<Affiliate[]>(affiliates.data)
    const [loading, setLoading] = useState(false)
    const sentinelRef = useRef<HTMLDivElement>(null)

    const currentPage = affiliates.current_page
    const lastPage = affiliates.last_page
    const activeCategory = filters.category

    // Accumulate pages via router event — setState in a callback avoids the sync-setState warning
    useEffect(() => {
        return router.on('success', event => {
            const page = (event.detail.page.props as { affiliates?: PaginatedData<Affiliate> })
                .affiliates
            if (!page) return
            setLoading(false)
            if (page.current_page === 1) {
                setItems(page.data)
            } else {
                setItems(prev => [...prev, ...page.data])
            }
        })
    }, [])

    // Infinite scroll — re-created whenever loading or page state changes
    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel || currentPage >= lastPage) return

        const observer = new IntersectionObserver(
            entries => {
                if (!entries[0].isIntersecting || loading) return
                setLoading(true)
                router.get(
                    window.location.pathname,
                    activeCategory
                        ? { category: activeCategory, page: currentPage + 1 }
                        : { page: currentPage + 1 },
                    { preserveState: true, only: ['affiliates'], preserveScroll: true },
                )
            },
            { rootMargin: '300px' },
        )
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [loading, currentPage, lastPage, activeCategory])

    const setCategory = (cat: string | null) => {
        router.get(window.location.pathname, cat ? { category: cat } : {}, {
            preserveState: true,
            only: ['affiliates', 'filters'],
            preserveScroll: false,
        })
    }

    const atEnd = currentPage >= lastPage

    return (
        <>
            <Head title={`${t('tools.title')} — ${SITE.name}`}>
                <meta name="description" content={t('tools.subtitle')} />
            </Head>

            <Navbar />

            <main id="main-content" className="min-h-screen bg-nr-bg pt-[70px]">
                <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-nr-accent">
                            {t('tools.label')}
                        </span>
                        <h1 className="mb-4 font-display text-4xl font-black text-nr-text md:text-5xl">
                            {t('tools.title')}
                        </h1>
                        <p className="mx-auto max-w-xl text-nr-muted">{t('tools.subtitle')}</p>
                    </div>

                    {/* Category filter pills */}
                    {categories.length > 0 && (
                        <div className="mb-12 flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setCategory(null)}
                                className={`inline-flex min-h-[44px] items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                                    !activeCategory
                                        ? 'border border-nr-accent/30 bg-nr-accent/20 text-nr-accent'
                                        : 'glass text-nr-faint hover:text-nr-muted'
                                }`}
                            >
                                {t('tools.all')} ({affiliates.total})
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`inline-flex min-h-[44px] items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                                        activeCategory === cat
                                            ? 'border border-nr-accent/30 bg-nr-accent/20 text-nr-accent'
                                            : 'glass text-nr-faint hover:text-nr-muted'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Grid */}
                    {items.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                                {items.map((affiliate, i) => (
                                    <motion.div
                                        key={affiliate.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: (i % PER_PAGE) * 0.06 }}
                                    >
                                        <AffiliateWidget affiliate={affiliate} />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Sentinel */}
                            <div ref={sentinelRef} className="mt-14 flex justify-center">
                                {loading && (
                                    <div className="flex items-center gap-3 text-sm text-nr-faint">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-nr-accent/30 border-t-nr-accent" />
                                        Cargando más herramientas...
                                    </div>
                                )}
                                {!loading && atEnd && affiliates.total > PER_PAGE && (
                                    <p className="font-mono text-xs text-nr-faint">
                                        {affiliates.total} herramientas · fin del listado
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="mb-4 text-4xl opacity-20">⚡</div>
                            <p className="text-sm text-nr-faint" role="status">
                                No hay herramientas disponibles en esta categoría.
                            </p>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <p className="mx-auto mt-16 max-w-lg text-center text-xs leading-relaxed text-nr-faint">
                        {t('footer.affiliate_disclosure')}
                    </p>
                </section>
            </main>

            <Footer />
        </>
    )
}
