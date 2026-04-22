import { Head, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import { SITE } from '@/lib/constants'

const LAST_UPDATED = '22 de abril de 2026'

export default function Privacy() {
    return (
        <>
            <Head title={`Política de Privacidad — ${SITE.name}`}>
                <meta
                    name="description"
                    content="Política de privacidad de NeuralRift. Cómo recopilamos, usamos y protegemos tu información."
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
                            <Link href="/" className="transition-colors hover:text-nr-muted">
                                Inicio
                            </Link>
                            <span>›</span>
                            <span className="text-nr-muted">Privacidad</span>
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
                                Política de Privacidad
                            </h1>
                            <p className="mt-3 text-sm text-nr-faint">
                                Última actualización: {LAST_UPDATED}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Content */}
                <div className="mx-auto max-w-3xl px-6 py-14 md:px-12">
                    <div className="space-y-10 text-sm leading-relaxed text-nr-muted">
                        <Section title="1. Información que recopilamos">
                            <p>
                                En <strong className="text-nr-text">NeuralRift</strong> recopilamos
                                únicamente la información necesaria para ofrecerte el servicio:
                            </p>
                            <ul className="mt-4 space-y-2 pl-4">
                                <Item>
                                    <strong className="text-nr-text">Suscripción al newsletter:</strong>{' '}
                                    solo tu dirección de correo electrónico, que usamos para
                                    enviarte el contenido al que te suscribiste.
                                </Item>
                                <Item>
                                    <strong className="text-nr-text">Datos de uso anónimos:</strong>{' '}
                                    páginas visitadas y tiempo de lectura, sin asociarlos a ningún
                                    dato personal identificable.
                                </Item>
                                <Item>
                                    <strong className="text-nr-text">Cookies técnicas:</strong>{' '}
                                    necesarias para el correcto funcionamiento del sitio (sesión,
                                    preferencias de idioma).
                                </Item>
                            </ul>
                        </Section>

                        <Section title="2. Cómo usamos tu información">
                            <ul className="space-y-2 pl-4">
                                <Item>Enviarte el newsletter al que te suscribiste voluntariamente.</Item>
                                <Item>Mejorar el contenido y la experiencia del sitio.</Item>
                                <Item>Analizar qué artículos son más útiles para los lectores.</Item>
                            </ul>
                            <p className="mt-4">
                                Nunca vendemos, alquilamos ni compartimos tu información personal con
                                terceros con fines comerciales.
                            </p>
                        </Section>

                        <Section title="3. Links de afiliado">
                            <p>
                                NeuralRift contiene enlaces de afiliado a productos y servicios que
                                recomiendo. Si realizas una compra a través de estos enlaces, puedo
                                recibir una comisión sin costo adicional para ti. Esto no influye en
                                mis opiniones ni recomendaciones.
                            </p>
                        </Section>

                        <Section title="4. Cookies">
                            <p>
                                Usamos cookies estrictamente necesarias para el funcionamiento del
                                sitio. No usamos cookies de seguimiento de terceros ni publicidad
                                comportamental. Consulta nuestra{' '}
                                <Link
                                    href="/cookies"
                                    className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                >
                                    Política de Cookies
                                </Link>{' '}
                                para más detalles.
                            </p>
                        </Section>

                        <Section title="5. Retención de datos">
                            <p>
                                Conservamos tu dirección de correo mientras estés suscrito al
                                newsletter. Puedes darte de baja en cualquier momento usando el
                                enlace al final de cualquier correo que te enviemos. Tras la baja,
                                eliminamos tu dirección en un plazo máximo de 30 días.
                            </p>
                        </Section>

                        <Section title="6. Tus derechos">
                            <ul className="space-y-2 pl-4">
                                <Item>Acceder a los datos que tenemos sobre ti.</Item>
                                <Item>Solicitar la corrección o eliminación de tus datos.</Item>
                                <Item>Oponerte al tratamiento de tus datos.</Item>
                            </ul>
                            <p className="mt-4">
                                Para ejercer cualquiera de estos derechos, escríbenos a{' '}
                                <a
                                    href={`mailto:hola@${SITE.url.replace('https://', '')}`}
                                    className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                >
                                    hola@neuralrift.com
                                </a>
                                .
                            </p>
                        </Section>

                        <Section title="7. Cambios en esta política">
                            <p>
                                Podemos actualizar esta política ocasionalmente. Te notificaremos
                                sobre cambios significativos por correo si eres suscriptor. La fecha
                                de última actualización siempre aparece en la cabecera.
                            </p>
                        </Section>
                    </div>

                    {/* Back link */}
                    <div className="mt-14 border-t border-white/[0.06] pt-8">
                        <Link
                            href="/"
                            className="text-sm text-nr-faint transition-colors hover:text-nr-muted"
                        >
                            ← Volver al inicio
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
