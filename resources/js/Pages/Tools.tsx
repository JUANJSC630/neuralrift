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

            <main className="pt-[70px] min-h-screen bg-nr-bg">
                <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="text-xs font-mono text-nr-accent tracking-widest uppercase mb-3 block">
                            Herramientas recomendadas
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl font-black text-nr-text mb-4">
                            Las mejores herramientas IA
                        </h1>
                        <p className="text-nr-muted max-w-xl mx-auto">
                            Solo recomiendo herramientas que uso o he probado personalmente. Algunos
                            links son de afiliado.
                        </p>
                    </div>

                    {/* Category filter pills */}
                    {categories.length > 1 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-12">
                            <button
                                onClick={() => setActive(null)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
                                    ${
                                        !active
                                            ? 'bg-nr-accent/20 border border-nr-accent/30 text-nr-accent'
                                            : 'glass text-nr-faint hover:text-nr-muted'
                                    }`}
                            >
                                Todas ({affiliates.length})
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActive(cat)}
                                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
                                            ${
                                                active === cat
                                                    ? 'bg-nr-accent/20 border border-nr-accent/30 text-nr-accent'
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                        <div className="text-center py-24 text-nr-faint">
                            <div className="text-4xl mb-4 opacity-20">⚡</div>
                            <p>Próximamente...</p>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <p className="text-xs text-nr-faint text-center mt-16 max-w-lg mx-auto leading-relaxed">
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
