import { Head, router } from '@inertiajs/react'
import { useState, useEffect, useRef, useCallback } from 'react'
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
    totalAll: number
    filters: { category?: string }
}

export default function Tools({ affiliates, categories, totalAll, filters }: Props) {
    const { t } = useLocale()

    // All pagination state is local — Inertia props only used for initial load & category changes
    const [items, setItems] = useState<Affiliate[]>(affiliates.data)
    const [currentPage, setCurrentPage] = useState(affiliates.current_page)
    const [lastPage, setLastPage] = useState(affiliates.last_page)
    const [totalItems, setTotalItems] = useState(affiliates.total)
    const [loading, setLoading] = useState(false)

    const sentinelRef = useRef<HTMLDivElement>(null)
    // Tracks the highest page already requested — prevents duplicates with fast scrolling
    const fetchingPageRef = useRef(affiliates.current_page)
    // Always-current category value for use inside fetch callbacks
    const categoryRef = useRef(filters.category)

    // Sync state when Inertia updates affiliates (category navigation)
    // Pattern: "adjusting state when a prop changes" — avoids setState-in-effect
    const [prevAffiliates, setPrevAffiliates] = useState(affiliates)
    if (affiliates !== prevAffiliates) {
        setPrevAffiliates(affiliates)
        setItems(affiliates.data)
        setCurrentPage(affiliates.current_page)
        setLastPage(affiliates.last_page)
        setTotalItems(affiliates.total)
        setLoading(false)
    }

    // Refs cannot be mutated during render — sync separately after commit
    useEffect(() => {
        categoryRef.current = filters.category
        fetchingPageRef.current = affiliates.current_page
    }, [affiliates, filters.category])

    // Fetch next page via plain JSON — URL does NOT change
    const fetchMore = useCallback(async (page: number, category?: string) => {
        const dataUrl = window.location.pathname.replace(/\/$/, '') + '/data'
        const params = new URLSearchParams({ page: String(page) })
        if (category) params.set('category', category)

        try {
            const res = await fetch(`${dataUrl}?${params}`, {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            })
            if (!res.ok) throw new Error(`${res.status}`)
            const data: PaginatedData<Affiliate> = await res.json()
            fetchingPageRef.current = data.current_page
            setItems(prev => [...prev, ...data.data])
            setCurrentPage(data.current_page)
            setLastPage(data.last_page)
            setLoading(false)
        } catch {
            // On error allow retrying the same page
            fetchingPageRef.current = page - 1
            setLoading(false)
        }
    }, [])

    // Infinite scroll observer — only re-created when currentPage or lastPage changes
    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel || currentPage >= lastPage) return

        fetchingPageRef.current = currentPage

        const observer = new IntersectionObserver(
            entries => {
                if (!entries[0].isIntersecting) return
                const nextPage = currentPage + 1
                if (nextPage <= fetchingPageRef.current) return
                fetchingPageRef.current = nextPage
                setLoading(true)
                fetchMore(nextPage, categoryRef.current)
            },
            { rootMargin: '600px' },
        )
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [currentPage, lastPage, fetchMore])

    // Category filter — intentionally changes URL so it's shareable/bookmarkable
    const setCategory = (cat: string | null) => {
        router.get(window.location.pathname, cat ? { category: cat } : {}, {
            preserveState: true,
            only: ['affiliates', 'filters'],
            preserveScroll: false,
        })
    }

    const activeCategory = filters.category
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
                                {t('tools.all')} {totalAll}
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
                                {loading &&
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div
                                            key={`skeleton-${i}`}
                                            className="glass flex h-full flex-col rounded-2xl p-5"
                                        >
                                            <div className="mb-3 flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-white/8 h-10 w-10 flex-shrink-0 animate-pulse rounded-xl" />
                                                    <div className="space-y-2">
                                                        <div className="bg-white/8 h-3.5 w-28 animate-pulse rounded-md" />
                                                        <div className="h-2.5 w-20 animate-pulse rounded-md bg-white/5" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-4 space-y-2">
                                                <div className="h-2.5 w-full animate-pulse rounded-md bg-white/5" />
                                                <div className="h-2.5 w-4/5 animate-pulse rounded-md bg-white/5" />
                                            </div>
                                            <div className="mt-auto h-11 animate-pulse rounded-xl bg-white/5" />
                                        </div>
                                    ))}
                            </div>

                            {/* Sentinel + status */}
                            <div ref={sentinelRef} className="mt-14 flex justify-center">
                                {!loading && atEnd && totalItems > PER_PAGE && (
                                    <p className="font-mono text-xs text-nr-faint">
                                        {totalItems} {t('tools.items')} · {t('tools.end')}
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="mb-4 text-4xl opacity-20">⚡</div>
                            <p className="text-sm text-nr-faint" role="status">
                                {t('tools.empty')}
                            </p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </>
    )
}
