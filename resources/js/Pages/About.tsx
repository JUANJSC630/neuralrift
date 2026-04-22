import { Head } from '@inertiajs/react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import MeshBackground from '@/Components/Layout/MeshBackground'
import NewsletterWidget from '@/Components/Blog/NewsletterWidget'
import { SITE } from '@/lib/constants'

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

const STATS = [
    { value: '50+', label: 'Artículos publicados' },
    { value: '5K+', label: 'Lectores mensuales' },
    { value: '500+', label: 'Suscriptores' },
    { value: '20+', label: 'Países' },
]

export default function About() {
    return (
        <>
            <Head title={`Sobre mí — ${SITE.name}`}>
                <meta
                    name="description"
                    content="Desarrollador y apasionado de la IA. Escribo sobre tecnología, herramientas y negocios digitales."
                />
            </Head>

            <Navbar />

            <main className="min-h-screen bg-nr-bg pt-[70px]">
                {/* Hero */}
                <section className="relative overflow-hidden py-20 border-b border-white/[0.05]">
                    <MeshBackground />
                    <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            {/* Avatar */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="flex-shrink-0"
                            >
                                <div className="relative">
                                    <div
                                        className="w-40 h-40 rounded-3xl bg-gradient-to-br
                                                    from-nr-accent to-nr-cyan flex items-center
                                                    justify-center text-6xl font-bold text-white
                                                    font-display"
                                    >
                                        J
                                    </div>
                                    <div
                                        className="absolute inset-0 rounded-3xl glow-accent-lg
                                                    opacity-40 blur-xl -z-10"
                                    />
                                </div>
                            </motion.div>

                            {/* Text */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <span
                                    className="text-xs font-mono text-nr-accent tracking-widest
                                                 uppercase block mb-3"
                                >
                                    Hola, soy
                                </span>
                                <h1
                                    className="font-display text-4xl md:text-5xl font-black
                                               text-nr-text mb-2"
                                >
                                    Juan Jose
                                </h1>
                                <p className="text-nr-muted text-lg mb-5 leading-relaxed">
                                    Desarrollador y apasionado de la IA desde Colombia. Escribo
                                    sobre tecnología, herramientas y cómo monetizar en la era de la
                                    inteligencia artificial.
                                </p>

                                <div className="flex gap-3 flex-wrap">
                                    {[
                                        {
                                            label: 'Twitter/X',
                                            href: `https://twitter.com/${SITE.twitter.replace('@', '')}`,
                                        },
                                        { label: 'LinkedIn', href: '#' },
                                        { label: 'GitHub', href: '#' },
                                    ].map(s => (
                                        <a
                                            key={s.label}
                                            href={s.href}
                                            target="_blank"
                                            rel="noopener"
                                            className="px-4 py-2 glass rounded-xl text-xs font-medium
                                                      text-nr-muted hover:text-nr-text
                                                      hover:border-white/20 transition-all duration-200"
                                        >
                                            {s.label} ↗
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 space-y-16">
                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {STATS.map(stat => (
                            <div key={stat.label} className="glass rounded-2xl p-5 text-center">
                                <div className="text-3xl font-black font-display text-gradient mb-1">
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
                        <h2 className="font-display text-2xl font-bold text-nr-text mb-6">
                            Por qué NeuralRift
                        </h2>
                        <div className="space-y-4 text-nr-muted leading-relaxed">
                            <p>
                                Empecé NeuralRift porque me frustré con el ruido que rodea a la
                                inteligencia artificial. Demasiado hype, demasiadas promesas vacías,
                                muy poco análisis honesto.
                            </p>
                            <p>
                                Como desarrollador, tengo acceso directo a estas herramientas y
                                puedo evaluarlas técnicamente — no solo marketinescamente. Aquí
                                encontrarás análisis reales basados en uso real.
                            </p>
                            <p>
                                El objetivo es simple: ayudarte a navegar la revolución de la IA sin
                                perder tiempo ni dinero en herramientas que no valen la pena.
                            </p>
                        </div>
                    </motion.div>

                    {/* Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-display text-2xl font-bold text-nr-text mb-6">
                            Áreas de expertise
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {SKILLS.map((skill, i) => (
                                <motion.span
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="px-4 py-2 glass rounded-xl text-sm text-nr-muted
                                               border border-white/[0.08] hover:border-nr-accent/30
                                               hover:text-nr-accent transition-all duration-200"
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
                        <h2 className="font-display text-2xl font-bold text-nr-text mb-3">
                            ¿Colaboraciones?
                        </h2>
                        <p className="text-nr-muted text-sm leading-relaxed mb-6 max-w-md mx-auto">
                            Estoy abierto a reviews patrocinadas, colaboraciones y menciones de
                            herramientas que realmente valgan la pena. Solo trabajo con productos
                            que usaría yo mismo.
                        </p>
                        <a
                            href="mailto:hola@neuralrift.com"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                                      font-semibold text-sm text-white
                                      bg-gradient-to-r from-nr-accent to-[#6d58f0]
                                      glow-accent hover:-translate-y-0.5 transition-all duration-200"
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
