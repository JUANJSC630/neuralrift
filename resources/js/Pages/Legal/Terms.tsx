import { Head, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import { SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'

export default function Terms() {
    const { locale, t, localePath } = useLocale()
    const isEn = locale === 'en'
    const LAST_UPDATED = isEn ? 'April 22, 2026' : '22 de abril de 2026'

    return (
        <>
            <Head title={`${isEn ? 'Terms of Use' : 'Términos de Uso'} — ${SITE.name}`}>
                <meta
                    name="description"
                    content={isEn ? 'NeuralRift terms of use. Rules and limitations of the site.' : 'Términos y condiciones de uso de NeuralRift. Reglas y limitaciones del sitio.'}
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
                        {/* Breadcrumb */}
                        <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-nr-faint">
                            <Link href={localePath('/')} className="transition-colors hover:text-nr-muted">
                                {t('post.home')}
                            </Link>
                            <span>›</span>
                            <span className="text-nr-muted">{t('footer.terms')}</span>
                        </nav>

                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-nr-accent">
                                Legal
                            </span>
                            <h1 className="font-display text-4xl font-black text-nr-text md:text-5xl">
                                {isEn ? 'Terms of Use' : 'Términos de Uso'}
                            </h1>
                            <p className="mt-3 text-sm text-nr-faint">
                                {isEn ? 'Last updated:' : 'Última actualización:'} {LAST_UPDATED}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Content */}
                <div className="mx-auto max-w-3xl px-6 py-14 md:px-12">
                    <div className="space-y-10 text-sm leading-relaxed text-nr-muted">
                        <Section title="1. Aceptación de los términos">
                            <p>
                                Al acceder y usar{' '}
                                <strong className="text-nr-text">NeuralRift</strong> ({SITE.url}),
                                aceptas estos términos en su totalidad. Si no estás de acuerdo con
                                alguna parte, por favor no uses el sitio.
                            </p>
                        </Section>

                        <Section title="2. Uso del contenido">
                            <p>
                                Todo el contenido publicado en NeuralRift — artículos, imágenes,
                                código y recursos — está protegido por derechos de autor.
                            </p>
                            <ul className="mt-4 space-y-2 pl-4">
                                <Item>
                                    Puedes leer, compartir y referenciar el contenido con atribución
                                    clara al autor y enlace a la fuente original.
                                </Item>
                                <Item>
                                    Queda prohibida la reproducción total o parcial con fines
                                    comerciales sin autorización expresa.
                                </Item>
                                <Item>
                                    El código de ejemplo publicado en los artículos puede usarse
                                    libremente en proyectos personales y comerciales.
                                </Item>
                            </ul>
                        </Section>

                        <Section title="3. Exactitud de la información">
                            <p>
                                El contenido de NeuralRift tiene fines informativos y educativos. Me
                                esfuerzo por mantenerlo actualizado y preciso, pero el campo de la IA
                                evoluciona rápidamente. No garantizo que toda la información esté
                                libre de errores u omisiones.
                            </p>
                            <p className="mt-3">
                                Nada en este sitio constituye asesoramiento financiero, legal o
                                profesional. Consulta siempre con un especialista antes de tomar
                                decisiones importantes.
                            </p>
                        </Section>

                        <Section title="4. Links de afiliado y externos">
                            <p>
                                NeuralRift contiene enlaces a sitios externos y links de afiliado.
                                No somos responsables del contenido, precisión ni prácticas de
                                privacidad de esos sitios. La presencia de un enlace no implica
                                respaldo.
                            </p>
                            <p className="mt-3">
                                Revisa nuestra{' '}
                                <Link
                                    href="/afiliados"
                                    className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                >
                                    Política de Afiliados
                                </Link>{' '}
                                para entender cómo funcionan las comisiones.
                            </p>
                        </Section>

                        <Section title="5. Limitación de responsabilidad">
                            <p>
                                NeuralRift y su autor no serán responsables por daños directos,
                                indirectos, incidentales o consecuentes derivados del uso o
                                imposibilidad de uso del sitio o de cualquier información contenida
                                en él.
                            </p>
                        </Section>

                        <Section title="6. Modificaciones">
                            <p>
                                Podemos modificar estos términos en cualquier momento. Los cambios
                                entran en vigor en el momento de su publicación. El uso continuado
                                del sitio tras la publicación de cambios implica la aceptación de
                                los nuevos términos.
                            </p>
                        </Section>

                        <Section title="7. Ley aplicable">
                            <p>
                                Estos términos se rigen por las leyes de la República de Colombia.
                                Cualquier disputa se someterá a la jurisdicción de los tribunales
                                competentes de Colombia.
                            </p>
                        </Section>

                        <Section title="8. Contacto">
                            <p>
                                Si tienes preguntas sobre estos términos, escríbenos a{' '}
                                <a
                                    href="mailto:hola@neuralrift.com"
                                    className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                >
                                    hola@neuralrift.com
                                </a>
                                .
                            </p>
                        </Section>
                    </div>

                    {/* Back link */}
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

function Section({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
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
