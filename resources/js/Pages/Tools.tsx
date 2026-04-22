import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import AffiliateWidget from '@/Components/Blog/AffiliateWidget'
import { SITE } from '@/lib/constants'
import type { Affiliate } from '@/types'

interface Props {
    affiliates: Affiliate[]
    grouped: Record<string, Affiliate[]>
}

export default function Tools({ affiliates, grouped }: Props) {
    const categories = Object.keys(grouped).filter(Boolean)
    const [active, setActive] = useState<string | null>(null)

    const displayed = active ? (grouped[active] ?? []) : affiliates

    return (
        <>
            <Head title={`Herramientas IA — ${SITE.name}`}>
                <meta
                    name="description"
                    content="Las mejores herramientas de inteligencia artificial. Reviews honestas y links de afiliado."
                />
            </Head>

            <Navbar />

            <main className="min-h-screen bg-nr-bg pt-[70px]">
                <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-nr-accent">
                            Herramientas recomendadas
                        </span>
                        <h1 className="mb-4 font-display text-4xl font-black text-nr-text md:text-5xl">
                            Las mejores herramientas IA
                        </h1>
                        <p className="mx-auto max-w-xl text-nr-muted">
                            Solo recomiendo herramientas que uso o he probado personalmente. Algunos
                            links son de afiliado.
                        </p>
                    </div>

                    {/* Category filter pills */}
                    {categories.length > 1 && (
                        <div className="mb-12 flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setActive(null)}
                                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                                    !active
                                        ? 'border border-nr-accent/30 bg-nr-accent/20 text-nr-accent'
                                        : 'glass text-nr-faint hover:text-nr-muted'
                                }`}
                            >
                                Todas ({affiliates.length})
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActive(cat)}
                                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
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
                        <div className="py-24 text-center text-nr-faint">
                            <div className="mb-4 text-4xl opacity-20">⚡</div>
                            <p>Próximamente...</p>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <p className="mx-auto mt-16 max-w-lg text-center text-xs leading-relaxed text-nr-faint">
                        Este sitio contiene links de afiliado. Si compras a través de ellos recibo
                        una comisión sin costo adicional para ti. Solo recomiendo productos que uso
                        o he evaluado personalmente.
                    </p>
                </section>
            </main>

            <Footer />
        </>
    )
}
