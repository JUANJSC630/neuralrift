import { Head } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import MeshBackground from '@/Components/Layout/MeshBackground'
import PostCard from '@/Components/Blog/PostCard'
import PostCardFeatured from '@/Components/Blog/PostCardFeatured'
import AffiliateWidget from '@/Components/Blog/AffiliateWidget'
import NewsletterWidget from '@/Components/Blog/NewsletterWidget'
import { SITE } from '@/lib/constants'
import type { Post, Affiliate } from '@/types'

interface Props {
    featured: Post | null
    recent: Post[]
    popular: Post[]
    affiliates: Affiliate[]
}

const ROTATING_WORDS = [
    'Inteligencia Artificial',
    'Modelos de Lenguaje',
    'Automatización IA',
    'El Futuro Digital',
]

export default function Home({ featured, recent, affiliates }: Props) {
    const [wordIndex, setWordIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex(i => (i + 1) % ROTATING_WORDS.length)
        }, 2800)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <Head title={`${SITE.name} — ${SITE.tagline}`}>
                <meta name="description" content={SITE.description} />
                <meta property="og:title" content={SITE.name} />
                <meta property="og:description" content={SITE.description} />
                <meta property="og:type" content="website" />
            </Head>

            <Navbar />

            <main id="main-content">
                {/* ── HERO ─────────────────────────────────── */}
                <section
                    className="relative min-h-[680px] flex items-center justify-center
                                    overflow-hidden bg-nr-bg pt-[70px]"
                >
                    <MeshBackground />

                    {/* Contenido hero */}
                    <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full
                                       border border-nr-gold/30 mb-8"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-nr-gold animate-glow-pulse" />
                            <span className="text-xs font-semibold text-nr-gold tracking-widest uppercase">
                                Nuevo artículo publicado hoy
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="font-display text-5xl md:text-7xl lg:text-[82px]
                                       font-black leading-[1.06] tracking-tight text-nr-text mb-6"
                        >
                            El futuro de{' '}
                            <motion.span
                                key={wordIndex}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.4 }}
                                className="text-nr-accent"
                                aria-hidden="true"
                            >
                                {ROTATING_WORDS[wordIndex]}
                            </motion.span>
                            {/* sr-only live region — static element so screen readers pick up changes */}
                            <span className="sr-only" aria-live="polite" aria-atomic="true">
                                {ROTATING_WORDS[wordIndex]}
                            </span>
                            <span className="text-nr-accent animate-blink font-thin opacity-80">
                                |
                            </span>
                            <br />
                            empieza aquí
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="text-lg md:text-xl text-nr-muted leading-[1.7]
                                       max-w-[60ch] mx-auto mb-10"
                        >
                            Guías en profundidad, reviews honestas y estrategias para navegar la
                            revolución de la IA. Semanalmente, sin ruido.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <a
                                href="/blog"
                                className="w-full sm:w-auto px-10 py-4 rounded-full font-semibold
                                          text-white bg-gradient-to-r from-nr-accent to-nr-accent-dark
                                          glow-accent hover:glow-accent-lg hover:-translate-y-0.5
                                          transition-all duration-300 text-center"
                            >
                                Explorar artículos →
                            </a>
                            <a
                                href="#newsletter"
                                className="w-full sm:w-auto px-10 py-4 rounded-full font-medium
                                          glass hover:bg-white/[0.08] transition-all duration-300
                                          text-nr-text text-center"
                            >
                                Newsletter gratuita ✉
                            </a>
                        </motion.div>

                        {/* Scroll indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="flex flex-col items-center gap-1.5 mt-16 opacity-40"
                        >
                            <div className="w-px h-8 bg-gradient-to-b from-transparent to-nr-accent" />
                            <span className="text-[10px] font-mono text-nr-muted tracking-[0.16em]">
                                SCROLL
                            </span>
                        </motion.div>
                    </div>
                </section>

                {/* ── FEATURED POST ───────────────────────── */}
                {featured && (
                    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                        <PostCardFeatured post={featured} />
                    </section>
                )}

                {/* ── POSTS RECIENTES ─────────────────────── */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="font-display text-3xl font-bold text-nr-text leading-tight">
                                Artículos recientes
                            </h2>
                            <p className="text-nr-muted text-sm mt-1">
                                Lo último del mundo de la IA
                            </p>
                        </div>
                        <a
                            href="/blog"
                            className="text-sm text-nr-accent hover:text-nr-accent/80
                                      transition-colors font-medium"
                        >
                            Ver todos →
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recent.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                            >
                                <PostCard post={post} />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── HERRAMIENTAS AFILIADAS ──────────────── */}
                {affiliates.length > 0 && (
                    <section className="bg-nr-bg3 border-t border-nr-accent/[0.18] border-b border-white/[0.05] py-20">
                        <div className="max-w-7xl mx-auto px-6 md:px-12">
                            <div className="text-center mb-12">
                                <span
                                    className="text-xs font-mono text-nr-accent tracking-widest
                                                 uppercase mb-3 block"
                                >
                                    Herramientas que uso
                                </span>
                                <h2 className="font-display text-3xl font-bold text-nr-text leading-tight">
                                    Las mejores herramientas IA
                                </h2>
                                <p className="text-nr-muted mt-2 text-sm max-w-lg mx-auto">
                                    Solo recomiendo herramientas que uso personalmente. Algunos
                                    links son de afiliado.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {affiliates.map((affiliate, i) => (
                                    <motion.div
                                        key={affiliate.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.08 }}
                                    >
                                        <AffiliateWidget affiliate={affiliate} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── NEWSLETTER ──────────────────────────── */}
                <section id="newsletter" className="max-w-4xl mx-auto px-6 md:px-12 py-24">
                    <NewsletterWidget />
                </section>
            </main>

            <Footer />
        </>
    )
}
