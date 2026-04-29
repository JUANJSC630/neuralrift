import { Head, Link } from '@inertiajs/react'
import { motion, useReducedMotion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import MeshBackground from '@/Components/Layout/MeshBackground'
import PostCard from '@/Components/Blog/PostCard'
import PostCardFeatured from '@/Components/Blog/PostCardFeatured'
import AffiliateWidget from '@/Components/Blog/AffiliateWidget'
import NewsletterWidget from '@/Components/Blog/NewsletterWidget'
import { SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'
import type { Post, Affiliate } from '@/types'

interface Props {
    featured: Post | null
    recent: Post[]
    popular: Post[]
    affiliates: Affiliate[]
    canonical?: string
}

const NODES = [
    { x: '11%', y: '22%', size: 6, color: '#7C6AF7', delay: 0 },
    { x: '80%', y: '12%', size: 3, color: '#06B6D4', delay: 0.4 },
    { x: '90%', y: '65%', size: 4, color: '#7C6AF7', delay: 0.8 },
    { x: '7%', y: '75%', size: 3, color: '#06B6D4', delay: 1.2 },
    { x: '54%', y: '85%', size: 5, color: '#7C6AF7', delay: 0.6 },
    { x: '70%', y: '38%', size: 3, color: '#06B6D4', delay: 1.0 },
    { x: '33%', y: '55%', size: 4, color: '#7C6AF7', delay: 0.2 },
    { x: '44%', y: '18%', size: 3, color: '#06B6D4', delay: 1.4 },
]

const SVG_LINES = [
    ['11%', '22%', '33%', '55%'],
    ['33%', '55%', '54%', '85%'],
    ['80%', '12%', '70%', '38%'],
    ['70%', '38%', '90%', '65%'],
    ['44%', '18%', '70%', '38%'],
    ['33%', '55%', '70%', '38%'],
]

export default function Home({ featured, recent, affiliates, canonical }: Props) {
    const [wordIndex, setWordIndex] = useState(0)
    const prefersReducedMotion = useReducedMotion()
    const { locale, t, localePath } = useLocale()
    const words = [
        t('home.rotating.0'),
        t('home.rotating.1'),
        t('home.rotating.2'),
        t('home.rotating.3'),
        t('home.rotating.4'),
        t('home.rotating.5'),
        t('home.rotating.6'),
        t('home.rotating.7'),
        t('home.rotating.8'),
        t('home.rotating.9'),
        t('home.rotating.10'),
        t('home.rotating.11'),
        t('home.rotating.12'),
        t('home.rotating.13'),
        t('home.rotating.14'),
    ]

    useEffect(() => {
        if (prefersReducedMotion) return
        const interval = setInterval(() => {
            setWordIndex(i => (i + 1) % words.length)
        }, 2800)
        return () => clearInterval(interval)
    }, [words.length, prefersReducedMotion])

    return (
        <>
            <Head title={`${SITE.name} — ${SITE.tagline}`}>
                <meta name="description" content={SITE.description} />
                <meta property="og:title" content={SITE.name} />
                <meta property="og:description" content={SITE.description} />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'es_CO'} />
                <meta property="og:site_name" content={SITE.name} />
                {canonical && <meta property="og:url" content={canonical} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={SITE.twitter} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: SITE.name,
                        url: SITE.url,
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: `${SITE.url}/blog?search={search_term_string}`,
                            'query-input': 'required name=search_term_string',
                        },
                    })}
                </script>
            </Head>

            <Navbar />

            <main id="main-content">
                {/* ── HERO ─────────────────────────────────── */}
                <section className="relative flex min-h-[680px] items-center justify-center overflow-hidden bg-nr-bg pt-[200px]">
                    <MeshBackground />

                    {/* Constellation nodes */}
                    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                        {/* SVG connector lines — desktop only */}
                        <svg
                            className="absolute inset-0 hidden h-full w-full md:block"
                            style={{ opacity: 0.1 }}
                        >
                            {SVG_LINES.map(([x1, y1, x2, y2], i) => (
                                <line
                                    key={i}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke="#7C6AF7"
                                    strokeWidth="1"
                                />
                            ))}
                        </svg>

                        {/* Floating nodes */}
                        {NODES.map((node, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    left: node.x,
                                    top: node.y,
                                    width: node.size * 2,
                                    height: node.size * 2,
                                    background: node.color,
                                    boxShadow: `0 0 ${node.size * 4}px ${node.color}80`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0 }}
                                animate={
                                    prefersReducedMotion
                                        ? { opacity: 0.5 }
                                        : { opacity: [0.4, 0.9, 0.4], scale: [1, 1.2, 1], y: [0, -8, 0] }
                                }
                                transition={
                                    prefersReducedMotion
                                        ? { duration: 0.3, delay: node.delay * 0.2 }
                                        : { duration: 4, delay: node.delay, repeat: Infinity, ease: 'easeInOut' }
                                }
                            />
                        ))}
                    </div>

                    {/* Contenido hero */}
                    <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                        {/* Badge */}
                        {/* <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                            className="glass my-8 inline-flex items-center gap-2 rounded-full border border-nr-gold/30 px-4 py-1.5"
                        >
                            <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-nr-gold" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-nr-gold">
                                {t('home.badge')}
                            </span>
                        </motion.div> */}

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="mb-6 font-display text-5xl font-black leading-[1.06] tracking-tight text-nr-text md:text-7xl lg:text-[82px]"
                        >
                            <span className="block">{t('home.headline_prefix')}</span>
                            <motion.span
                                key={wordIndex}
                                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
                                transition={{ duration: prefersReducedMotion ? 0.2 : 0.4 }}
                                className="block whitespace-nowrap text-nr-accent"
                                aria-hidden="true"
                            >
                                {words[wordIndex]}
                                <span className="animate-blink font-thin opacity-80">|</span>
                            </motion.span>
                            <span className="sr-only" aria-live="polite" aria-atomic="true">
                                {words[wordIndex]}
                            </span>
                            <span className="block">{t('home.headline_suffix')}</span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="mx-auto mb-10 max-w-[60ch] text-lg leading-[1.7] text-nr-muted md:text-xl"
                        >
                            {t('home.subheadline')}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                        >
                            <Link
                                href={localePath('/blog')}
                                className="glow-accent hover:glow-accent-lg w-full rounded-full bg-gradient-to-r from-nr-accent to-nr-accent-dark px-10 py-4 text-center font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 sm:w-auto"
                            >
                                {t('home.cta_blog')}
                            </Link>
                            <a
                                href="#newsletter"
                                className="glass w-full rounded-full px-10 py-4 text-center font-medium text-nr-text transition-all duration-300 hover:bg-white/[0.08] sm:w-auto"
                            >
                                {t('home.cta_newsletter')}
                            </a>
                        </motion.div>

                        {/* Scroll indicator */}
                        <motion.div
                            aria-hidden="true"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="mt-16 flex flex-col items-center gap-1.5 opacity-40"
                        >
                            <div className="h-8 w-px bg-gradient-to-b from-transparent to-nr-accent" />
                            <span className="font-mono text-[10px] tracking-[0.16em] text-nr-muted">
                                SCROLL
                            </span>
                        </motion.div>
                    </div>
                </section>

                {/* ── FEATURED POST ───────────────────────── */}
                {featured && (
                    <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
                        <PostCardFeatured post={featured} />
                    </section>
                )}

                {/* ── POSTS RECIENTES ─────────────────────── */}
                <section className="mx-auto max-w-7xl px-6 pb-16 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="mb-10 flex items-center justify-between"
                    >
                        <div>
                            <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-nr-accent">
                                {t('home.recent_label')}
                            </span>
                            <h2 className="font-display text-3xl font-bold leading-tight text-nr-text">
                                {t('home.recent_title')}
                            </h2>
                            <p className="mt-1 text-sm text-nr-muted">
                                {t('home.recent_subtitle')}
                            </p>
                        </div>
                        <Link
                            href={localePath('/blog')}
                            className="glass hidden items-center rounded-full px-5 py-2.5 text-sm font-medium text-nr-accent transition-all hover:bg-white/[0.08] md:inline-flex"
                        >
                            {t('home.view_all')}
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

                    {/* "Ver todos" button — visible on mobile below grid */}
                    <div className="mt-8 flex justify-center md:hidden">
                        <Link
                            href={localePath('/blog')}
                            className="glass rounded-full px-6 py-3 text-sm font-medium text-nr-accent transition-colors hover:text-nr-accent/80"
                        >
                            {t('home.view_all_articles')}
                        </Link>
                    </div>
                </section>

                {/* ── HERRAMIENTAS AFILIADAS ──────────────── */}
                {affiliates.length > 0 && (
                    <section className="border-b border-t border-nr-accent/[0.18] border-white/[0.05] bg-nr-bg3 py-20">
                        <div className="mx-auto max-w-7xl px-6 md:px-12">
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                                className="mb-12 text-center"
                            >
                                <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-nr-accent">
                                    {t('home.tools_label')}
                                </span>
                                <h2 className="font-display text-3xl font-bold leading-tight text-nr-text">
                                    {t('home.tools_title')}
                                </h2>
                                <p className="mx-auto mt-2 max-w-lg text-sm text-nr-muted">
                                    {t('home.tools_subtitle')}
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                <section id="newsletter" className="mx-auto max-w-4xl px-6 py-24 md:px-12">
                    <NewsletterWidget />
                </section>
            </main>

            <Footer />
        </>
    )
}
