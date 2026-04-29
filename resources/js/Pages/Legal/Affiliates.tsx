import { Head, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import { SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'

export default function AffiliatesPolicy() {
    const { locale, t, localePath } = useLocale()
    const isEn = locale === 'en'
    const LAST_UPDATED = t('misc.last_updated')

    return (
        <>
            <Head title={`${isEn ? 'Affiliate Policy' : 'Política de Afiliados'} — ${SITE.name}`}>
                <meta
                    name="description"
                    content={
                        isEn
                            ? 'NeuralRift affiliate policy. Transparency about commissions and how we select the tools we recommend.'
                            : 'Política de afiliados de NeuralRift. Transparencia sobre comisiones y cómo seleccionamos las herramientas que recomendamos.'
                    }
                />
            </Head>

            <Navbar />

            <main id="main-content" className="min-h-screen bg-nr-bg pt-[70px]">
                {/* Hero */}
                <section className="relative overflow-hidden border-b border-white/[0.05]">
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(ellipse 70% 50% at 10% 50%, rgba(124,106,247,0.10) 0%, transparent 65%)',
                        }}
                    />
                    <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 md:px-12">
                        <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-nr-faint">
                            <Link
                                href={localePath('/')}
                                className="transition-colors hover:text-nr-muted"
                            >
                                {t('post.home')}
                            </Link>
                            <span>›</span>
                            <span className="text-nr-muted">{t('footer.affiliates')}</span>
                        </nav>

                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-nr-accent">
                                {isEn ? 'Transparency' : 'Transparencia'}
                            </span>
                            <h1 className="font-display text-4xl font-black text-nr-text md:text-5xl">
                                {isEn ? 'Affiliate Policy' : 'Política de Afiliados'}
                            </h1>
                            <p className="mt-3 text-sm text-nr-faint">
                                {t('misc.last_updated_label')} {LAST_UPDATED}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Content */}
                <div className="mx-auto max-w-3xl px-6 py-14 md:px-12">
                    {/* Highlight card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="glass mb-12 rounded-2xl border border-nr-accent/20 p-6"
                    >
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 text-2xl">💡</span>
                            <div>
                                <p className="font-semibold text-nr-text">
                                    {isEn
                                        ? 'Transparency commitment'
                                        : 'Compromiso de transparencia'}
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-nr-muted">
                                    {isEn
                                        ? 'NeuralRift may receive a commission when you purchase through links on this site. This has no additional cost to you and never influences my recommendations.'
                                        : 'NeuralRift puede recibir una comisión cuando compras a través de los enlaces de este sitio. Esto no tiene ningún costo adicional para ti y nunca influye en mis recomendaciones.'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-10 text-sm leading-relaxed text-nr-muted">
                        <Section
                            title={
                                isEn
                                    ? 'What is an affiliate link?'
                                    : '¿Qué es un enlace de afiliado?'
                            }
                        >
                            <p>
                                {isEn
                                    ? 'An affiliate link is a special URL that identifies that the visitor arrived at a product through NeuralRift. If that visitor makes a purchase, the product provider pays me a commission — without affecting the price you pay.'
                                    : 'Un enlace de afiliado es una URL especial que identifica que el visitante llegó a un producto a través de NeuralRift. Si ese visitante realiza una compra, el proveedor del producto me paga una comisión — sin que esto afecte el precio que pagas tú.'}
                            </p>
                        </Section>

                        <Section
                            title={
                                isEn ? 'How we select tools' : 'Cómo seleccionamos las herramientas'
                            }
                        >
                            <p>
                                {isEn
                                    ? 'I only recommend tools that meet all these criteria:'
                                    : 'Solo recomiendo herramientas que cumplen todos estos criterios:'}
                            </p>
                            <ul className="mt-4 space-y-2 pl-4">
                                <Item>
                                    {isEn ? (
                                        <>
                                            <strong className="text-nr-text">
                                                I have used them personally
                                            </strong>{' '}
                                            or evaluated them in depth before recommending them.
                                        </>
                                    ) : (
                                        <>
                                            <strong className="text-nr-text">
                                                Las he usado personalmente
                                            </strong>{' '}
                                            o las he evaluado en profundidad antes de recomendarlas.
                                        </>
                                    )}
                                </Item>
                                <Item>
                                    {isEn
                                        ? 'They offer real value and solve a concrete problem for my readers.'
                                        : 'Ofrecen valor real y resuelven un problema concreto para mis lectores.'}
                                </Item>
                                <Item>
                                    {isEn
                                        ? 'They have a good reputation, active support and a sustainable business model.'
                                        : 'Tienen buena reputación, soporte activo y modelo de negocio sostenible.'}
                                </Item>
                                <Item>
                                    {isEn
                                        ? "I don't recommend tools I wouldn't use myself, regardless of the commission offered."
                                        : 'No recomiendo herramientas que no usaría yo mismo, independientemente de la comisión ofrecida.'}
                                </Item>
                            </ul>
                        </Section>

                        <Section
                            title={
                                isEn
                                    ? 'Identification of affiliate content'
                                    : 'Identificación de contenido de afiliado'
                            }
                        >
                            <p>
                                {isEn ? (
                                    <>
                                        Affiliate links are present in the{' '}
                                        <Link
                                            href={localePath('/herramientas')}
                                            className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                        >
                                            AI Tools
                                        </Link>{' '}
                                        section and in some blog articles. When an article contains
                                        affiliate links, it is indicated at the beginning of the
                                        article.
                                    </>
                                ) : (
                                    <>
                                        Los enlaces de afiliado están presentes en la sección de{' '}
                                        <Link
                                            href={localePath('/herramientas')}
                                            className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                        >
                                            Herramientas IA
                                        </Link>{' '}
                                        y en algunos artículos del blog. Cuando un artículo contiene
                                        enlaces de afiliado, se indica al inicio del mismo.
                                    </>
                                )}
                            </p>
                            <p className="mt-3">
                                {isEn
                                    ? 'The site footer always includes the notice: "This blog contains affiliate links. If you buy through them I receive a commission at no additional cost to you."'
                                    : 'El footer del sitio incluye siempre el aviso: "Este blog contiene links de afiliado. Si compras a través de ellos recibo una comisión sin costo adicional para ti."'}
                            </p>
                        </Section>

                        <Section
                            title={
                                isEn
                                    ? 'Active affiliate programs'
                                    : 'Programas de afiliados activos'
                            }
                        >
                            <p>
                                {isEn ? (
                                    <>
                                        I currently participate in affiliate programs of the
                                        platforms listed in the{' '}
                                        <Link
                                            href={localePath('/herramientas')}
                                            className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                        >
                                            AI Tools
                                        </Link>{' '}
                                        section. This list is updated as I add or remove tools.
                                    </>
                                ) : (
                                    <>
                                        Actualmente participo en programas de afiliados de las
                                        plataformas que aparecen en la sección de{' '}
                                        <Link
                                            href={localePath('/herramientas')}
                                            className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                        >
                                            Herramientas IA
                                        </Link>
                                        . Esta lista se actualiza a medida que incorporo o retiro
                                        herramientas.
                                    </>
                                )}
                            </p>
                        </Section>

                        <Section title={isEn ? 'Your purchase decision' : 'Tu decisión de compra'}>
                            <p>
                                {isEn
                                    ? "My reviews and information are designed to help you make the best decision for your situation, not to maximize commissions. If a tool has equally good free alternatives for your use case, I'll tell you."
                                    : 'Mis reviews e información están diseñadas para ayudarte a tomar la mejor decisión para tu caso, no para maximizar comisiones. Si una herramienta tiene alternativas gratuitas igualmente buenas para tu situación, te lo diré.'}
                            </p>
                        </Section>

                        <Section title={isEn ? 'Contact' : 'Contacto'}>
                            <p>
                                {isEn ? (
                                    <>
                                        If you have questions about a specific recommendation or
                                        want to propose a collaboration, write to me at{' '}
                                        <a
                                            href={`mailto:${SITE.email}`}
                                            className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                        >
                                            {SITE.email}
                                        </a>
                                        .
                                    </>
                                ) : (
                                    <>
                                        Si tienes preguntas sobre una recomendación específica o
                                        quieres proponer una colaboración, escríbeme a{' '}
                                        <a
                                            href={`mailto:${SITE.email}`}
                                            className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                        >
                                            {SITE.email}
                                        </a>
                                        .
                                    </>
                                )}
                            </p>
                        </Section>
                    </div>

                    <div className="mt-14 border-t border-white/[0.06] pt-8">
                        <Link
                            href={localePath('/')}
                            className="text-sm text-nr-faint transition-colors hover:text-nr-muted"
                        >
                            {t('misc.back_home')}
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <h2 className="mb-4 font-display text-xl font-bold text-nr-text">{title}</h2>
            {children}
        </motion.section>
    )
}

function Item({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex gap-2">
            <span className="mt-0.5 flex-shrink-0 text-nr-accent">·</span>
            <span>{children}</span>
        </li>
    )
}
