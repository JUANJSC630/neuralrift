import { Head, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import { SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'

export default function Cookies() {
    const { locale, t, localePath } = useLocale()
    const isEn = locale === 'en'
    const LAST_UPDATED = t('misc.last_updated')

    const COOKIE_TABLE = [
        {
            name: 'neuralrift_session',
            type: isEn ? 'Session' : 'Sesión',
            purpose: isEn
                ? 'Keeps the authenticated user session active.'
                : 'Mantiene la sesión activa del usuario autenticado.',
            duration: isEn ? 'Session' : 'Sesión',
        },
        {
            name: 'XSRF-TOKEN',
            type: isEn ? 'Security' : 'Seguridad',
            purpose: isEn
                ? 'Protection against CSRF attacks on forms.'
                : 'Protección contra ataques CSRF en formularios.',
            duration: isEn ? 'Session' : 'Sesión',
        },
        {
            name: 'nr_lang',
            type: isEn ? 'Preference' : 'Preferencia',
            purpose: isEn
                ? 'Remembers the selected language (ES / EN).'
                : 'Recuerda el idioma seleccionado (ES / EN).',
            duration: isEn ? '1 year' : '1 año',
        },
    ]

    return (
        <>
            <Head title={`${isEn ? 'Cookie Policy' : 'Política de Cookies'} — ${SITE.name}`}>
                <meta
                    name="description"
                    content={
                        isEn
                            ? 'NeuralRift cookie policy. What cookies we use and why.'
                            : 'Política de cookies de NeuralRift. Qué cookies usamos y para qué.'
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
                            <span className="text-nr-muted">{t('footer.cookies')}</span>
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
                                {isEn ? 'Cookie Policy' : 'Política de Cookies'}
                            </h1>
                            <p className="mt-3 text-sm text-nr-faint">
                                {t('misc.last_updated_label')} {LAST_UPDATED}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Content */}
                <div className="mx-auto max-w-3xl px-6 py-14 md:px-12">
                    <div className="space-y-10 text-sm leading-relaxed text-nr-muted">
                        <Section title={isEn ? 'What are cookies?' : '¿Qué son las cookies?'}>
                            <p>
                                {isEn
                                    ? 'Cookies are small text files that websites store in your browser. They allow the site to remember your preferences and improve your browsing experience.'
                                    : 'Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador. Permiten que el sitio recuerde tus preferencias y mejore tu experiencia de uso.'}
                            </p>
                        </Section>

                        <Section title={isEn ? 'Cookies we use' : 'Cookies que usamos'}>
                            <p className="mb-6">
                                {isEn ? (
                                    <>
                                        NeuralRift uses exclusively technical and preference
                                        cookies, strictly necessary for the site to function.{' '}
                                        <strong className="text-nr-text">
                                            We do not use advertising, tracking, or third-party
                                            analytics cookies.
                                        </strong>
                                    </>
                                ) : (
                                    <>
                                        NeuralRift usa exclusivamente cookies técnicas y de
                                        preferencia, estrictamente necesarias para el funcionamiento
                                        del sitio.{' '}
                                        <strong className="text-nr-text">
                                            No usamos cookies de publicidad, rastreo ni analítica de
                                            terceros.
                                        </strong>
                                    </>
                                )}
                            </p>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-white/[0.08]">
                                            <th className="py-3 pr-4 text-left font-semibold uppercase tracking-wider text-nr-faint">
                                                Cookie
                                            </th>
                                            <th className="py-3 pr-4 text-left font-semibold uppercase tracking-wider text-nr-faint">
                                                {isEn ? 'Type' : 'Tipo'}
                                            </th>
                                            <th className="py-3 pr-4 text-left font-semibold uppercase tracking-wider text-nr-faint">
                                                {isEn ? 'Purpose' : 'Propósito'}
                                            </th>
                                            <th className="py-3 text-left font-semibold uppercase tracking-wider text-nr-faint">
                                                {isEn ? 'Duration' : 'Duración'}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {COOKIE_TABLE.map(row => (
                                            <tr
                                                key={row.name}
                                                className="border-b border-white/[0.04]"
                                            >
                                                <td className="py-3 pr-4 font-mono text-nr-accent">
                                                    {row.name}
                                                </td>
                                                <td className="py-3 pr-4 text-nr-text">
                                                    {row.type}
                                                </td>
                                                <td className="py-3 pr-4">{row.purpose}</td>
                                                <td className="py-3 text-nr-text">
                                                    {row.duration}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section
                            title={isEn ? 'How to control cookies' : 'Cómo controlar las cookies'}
                        >
                            <p>
                                {isEn
                                    ? 'You can control and delete cookies from your browser settings. Please note that disabling certain cookies may affect the functionality of the site.'
                                    : 'Puedes controlar y eliminar las cookies desde la configuración de tu navegador. Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.'}
                            </p>
                            <ul className="mt-4 space-y-2 pl-4">
                                <Item>
                                    <a
                                        href="https://support.google.com/chrome/answer/95647"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                    >
                                        Google Chrome
                                    </a>
                                </Item>
                                <Item>
                                    <a
                                        href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                    >
                                        Mozilla Firefox
                                    </a>
                                </Item>
                                <Item>
                                    <a
                                        href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-nr-accent transition-colors hover:text-nr-accent/80"
                                    >
                                        Safari
                                    </a>
                                </Item>
                            </ul>
                        </Section>

                        <Section
                            title={isEn ? 'Changes to this policy' : 'Cambios en esta política'}
                        >
                            <p>
                                {isEn
                                    ? 'We may update this policy when necessary. The last updated date always appears in the header of this page.'
                                    : 'Podemos actualizar esta política cuando sea necesario. La fecha de última actualización siempre aparece en la cabecera de esta página.'}
                            </p>
                        </Section>

                        <Section title={isEn ? 'Contact' : 'Contacto'}>
                            <p>
                                {isEn ? (
                                    <>
                                        If you have questions about our cookie policy, write to us
                                        at{' '}
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
                                        Si tienes preguntas sobre nuestra política de cookies,
                                        escríbenos a{' '}
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
