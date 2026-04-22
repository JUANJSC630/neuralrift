import { Head } from '@inertiajs/react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import MeshBackground from '@/Components/Layout/MeshBackground'
import NewsletterWidget from '@/Components/Blog/NewsletterWidget'
import { SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'

const SKILLS = [
    'IA Generativa',
    'Prompt Engineering',
    'React / Next.js',
    'Laravel',
    'SEO Técnico',
    'Marketing de Afiliados',
    'Automatización',
    'TypeScript',
]

export default function About() {
    const { t } = useLocale()

    const STATS = [
        { value: '50+', label: t('about.stats.articles') },
        { value: '5K+', label: t('about.stats.readers') },
        { value: '500+', label: t('about.stats.subscribers') },
        { value: '20+', label: t('about.stats.countries') },
    ]

    return (
        <>
            <Head title={`${t('nav.about')} — ${SITE.name}`}>
                <meta
                    name="description"
                    content={t('about.bio')}
                />
            </Head>

            <Navbar />

            <main id="main-content" className="min-h-screen bg-nr-bg pt-[70px]">
                {/* Hero */}
                <section className="relative overflow-hidden border-b border-white/[0.05] py-20">
                    <MeshBackground />
                    <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12">
                        <div className="flex flex-col items-center gap-12 md:flex-row">
                            {/* Avatar */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="flex-shrink-0"
                            >
                                <div className="relative">
                                    <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br from-nr-accent to-nr-cyan font-display text-6xl font-bold text-white">
                                        J
                                    </div>
                                    <div className="glow-accent-lg absolute inset-0 -z-10 rounded-3xl opacity-40 blur-xl" />
                                </div>
                            </motion.div>

                            {/* Text */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-nr-accent">
                                    {t('about.greeting')}
                                </span>
                                <h1 className="text-gradient mb-2 pb-4 font-display text-4xl font-black md:text-5xl">
                                    Juan Jose
                                </h1>
                                <p className="mb-5 text-lg leading-relaxed text-nr-muted">
                                    {t('about.bio')}
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {[
                                        {
                                            label: 'Twitter/X',
                                            href: `https://twitter.com/${SITE.twitter.replace('@', '')}`,
                                        },
                                    ].map(s => (
                                        <a
                                            key={s.label}
                                            href={s.href}
                                            target="_blank"
                                            rel="noopener"
                                            className="glass rounded-xl px-4 py-2 text-xs font-medium text-nr-muted transition-all duration-200 hover:border-white/20 hover:text-nr-text"
                                        >
                                            {s.label} ↗
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-4xl space-y-16 px-6 py-16 md:px-12">
                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 gap-4 md:grid-cols-4"
                    >
                        {STATS.map(stat => (
                            <div key={stat.label} className="glass rounded-2xl p-5 text-center">
                                <div className="text-gradient mb-1 font-display text-3xl font-black">
                                    {stat.value}
                                </div>
                                <div className="text-xs text-nr-faint">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Story */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-6 font-display text-2xl font-bold text-nr-text">
                            {t('about.why_title')}
                        </h2>
                        <div className="space-y-4 leading-relaxed text-nr-muted">
                            <p>{t('about.why_p1')}</p>
                            <p>{t('about.why_p2')}</p>
                            <p>{t('about.why_p3')}</p>
                        </div>
                    </motion.div>

                    {/* Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-6 font-display text-2xl font-bold text-nr-text">
                            {t('about.skills_title')}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {SKILLS.map((skill, i) => (
                                <motion.span
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass rounded-xl px-4 py-2 text-sm text-nr-muted transition-all duration-200 hover:border-nr-accent/30 hover:text-nr-accent"
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass rounded-2xl p-8 text-center"
                    >
                        <h2 className="mb-3 font-display text-2xl font-bold text-nr-text">
                            {t('about.collab_title')}
                        </h2>
                        <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-nr-muted">
                            {t('about.collab_text')}
                        </p>
                        <a
                            href="mailto:hola@neuralrift.com"
                            className="glow-accent inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-nr-accent to-nr-accent-dark px-6 py-3 text-sm font-semibold text-white transition-all duration-200 will-change-transform hover:-translate-y-0.5"
                        >
                            ✉ hola@neuralrift.com
                        </a>
                    </motion.div>

                    <NewsletterWidget />
                </div>
            </main>

            <Footer />
        </>
    )
}
