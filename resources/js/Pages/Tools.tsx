import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import AffiliateWidget from '@/Components/Blog/AffiliateWidget'
import { SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'
import type { Affiliate } from '@/types'

interface Props {
    affiliates: Affiliate[]
    grouped: Record<string, Affiliate[]>
}

export default function Tools({ affiliates, grouped }: Props) {
    const categories = Object.keys(grouped).filter(Boolean)
    const [active, setActive] = useState<string | null>(null)
    const { t } = useLocale()

    const displayed = active ? (grouped[active] ?? []) : affiliates

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
                    {categories.length > 1 && (
                        <div className="mb-12 flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setActive(null)}
                                className={`inline-flex min-h-[44px] items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                                    !active
                                        ? 'border border-nr-accent/30 bg-nr-accent/20 text-nr-accent'
                                        : 'glass text-nr-faint hover:text-nr-muted'
                                }`}
                            >
                                {t('tools.all')} ({affiliates.length})
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActive(cat)}
                                    className={`inline-flex min-h-[44px] items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                                        active === cat
                                            ? 'border border-nr-accent/30 bg-nr-accent/20 text-nr-accent'
                                            : 'glass text-nr-faint hover:text-nr-muted'
                                    }`}
                                >
                                    {cat} ({grouped[cat].length})
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Grid */}
                    {displayed.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {displayed.map((affiliate, i) => (
                                <motion.div
                                    key={affiliate.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.06 }}
                                >
                                    <AffiliateWidget affiliate={affiliate} />
                                </motion.div>
                            ))}
                        </div>
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
