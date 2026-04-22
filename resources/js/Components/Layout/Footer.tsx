import { Link } from '@inertiajs/react'
import { NAV_LINKS } from '@/lib/constants'

export default function Footer() {
    return (
        <footer className="border-t border-white/[0.06] bg-nr-bg3 mt-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="font-display text-2xl font-black text-nr-accent mb-3">
                            NeuralRift
                        </div>
                        <p className="text-sm text-nr-muted leading-relaxed max-w-sm">
                            Guías en profundidad, reviews honestas y estrategias para navegar la
                            revolución de la IA. Sin ruido, sin hype.
                        </p>
                        {/* Social */}
                        <div className="flex gap-3 mt-6">
                            {['Twitter/X', 'LinkedIn', 'YouTube'].map(s => (
                                <a
                                    key={s}
                                    href="#"
                                    className="px-3 py-1.5 glass rounded-lg text-xs text-nr-faint
                                              hover:text-nr-accent hover:border-nr-accent/30
                                              transition-all duration-200"
                                >
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4
                            className="text-xs font-semibold text-nr-faint uppercase
                                       tracking-widest mb-4"
                        >
                            Navegación
                        </h4>
                        <ul className="space-y-2.5">
                            {NAV_LINKS.map(link => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-nr-muted hover:text-nr-text
                                                     transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4
                            className="text-xs font-semibold text-nr-faint uppercase
                                       tracking-widest mb-4"
                        >
                            Legal
                        </h4>
                        <ul className="space-y-2.5">
                            {['Privacidad', 'Términos', 'Cookies', 'Afiliados'].map(l => (
                                <li key={l}>
                                    <a
                                        href="#"
                                        className="text-sm text-nr-muted
                                                           hover:text-nr-text transition-colors"
                                    >
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <p className="text-xs text-nr-faint mt-6 leading-relaxed">
                            Este blog contiene links de afiliado. Si compras a través de ellos
                            recibo una comisión sin costo adicional para ti.
                        </p>
                    </div>
                </div>

                <div
                    className="border-t border-white/[0.05] mt-12 pt-8 flex flex-col
                                md:flex-row items-center justify-between gap-4"
                >
                    <p className="text-xs text-nr-faint">
                        © {new Date().getFullYear()} NeuralRift. Hecho con ☕ desde Colombia.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="/feed.xml"
                            className="text-xs text-nr-faint hover:text-nr-orange transition-colors"
                        >
                            RSS Feed
                        </a>
                        <a
                            href="/sitemap.xml"
                            className="text-xs text-nr-faint hover:text-nr-text transition-colors"
                        >
                            Sitemap
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
