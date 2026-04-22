import { Link } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import CustomCursor from '@/Components/Layout/CustomCursor'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [lang, setLang] = useState<'es' | 'en'>('es')
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <>
            {/* Skip link */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:border focus:border-nr-accent/50 focus:bg-nr-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-nr-text"
            >
                Saltar al contenido
            </a>

            <nav
                className={cn(
                    'fixed left-0 right-0 top-0 z-50 flex h-[70px] items-center px-6 md:px-12',
                    'transition-all duration-300',
                    scrolled
                        ? 'glass-strong border-b border-white/[0.08]'
                        : 'border-b border-transparent bg-transparent',
                )}
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="flex-shrink-0 font-display text-xl font-black tracking-tight"
                >
                    <span className="text-gradient">NeuralRift</span>
                </Link>

                {/* Links desktop */}
                <ul className="hidden flex-1 items-center justify-center gap-8 md:flex">
                    {NAV_LINKS.map(link => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="group relative text-sm font-medium text-nr-muted transition-colors hover:text-nr-text"
                            >
                                {lang === 'es' ? link.label : link.labelEn}
                                <span className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-nr-accent transition-transform duration-300 group-hover:scale-x-100" />
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Actions */}
                <div className="ml-auto flex items-center gap-3">
                    {/* Lang toggle */}
                    <button
                        onClick={() => setLang(l => (l === 'es' ? 'en' : 'es'))}
                        className="glass hidden items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-nr-faint transition-colors hover:text-nr-muted md:flex"
                    >
                        <span className={lang === 'es' ? 'text-nr-accent' : ''}>ES</span>
                        <span className="text-nr-faint/40">/</span>
                        <span className={lang === 'en' ? 'text-nr-accent' : ''}>EN</span>
                    </button>

                    {/* CTA */}
                    <a
                        href="/#newsletter"
                        className="glow-accent hover:glow-accent-lg inline-flex min-h-[44px] flex-shrink-0 items-center rounded-full bg-gradient-to-r from-nr-accent to-nr-accent-dark px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                    >
                        ✦ Suscribirse
                    </a>

                    {/* Mobile hamburger */}
                    <button
                        className="ml-1 flex min-h-[44px] min-w-[44px] items-center justify-center text-nr-muted hover:text-nr-text md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav"
                        aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
                    >
                        <span className="text-2xl leading-none" aria-hidden="true">
                            {mobileOpen ? '✕' : '☰'}
                        </span>
                    </button>
                </div>

                {/* Gradient line bottom */}
                <div className="absolute bottom-0 left-0 h-0.5 w-1/3 rounded-full bg-gradient-to-r from-nr-accent to-nr-cyan" />

                {/* Mobile menu */}
                {mobileOpen && (
                    <div
                        id="mobile-nav"
                        className="glass-strong absolute left-0 right-0 top-full flex flex-col gap-3 border-b border-white/[0.08] px-6 py-4 md:hidden"
                    >
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="py-1 text-sm font-medium text-nr-muted transition-colors hover:text-nr-text"
                                onClick={() => setMobileOpen(false)}
                            >
                                {lang === 'es' ? link.label : link.labelEn}
                            </Link>
                        ))}
                        <div className="mt-1 border-t border-white/[0.06] pt-2">
                            <button
                                onClick={() => setLang(l => (l === 'es' ? 'en' : 'es'))}
                                className="glass flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-nr-faint transition-colors hover:text-nr-muted"
                                aria-label={`Cambiar idioma a ${lang === 'es' ? 'inglés' : 'español'}`}
                            >
                                <span className={lang === 'es' ? 'text-nr-accent' : ''}>ES</span>
                                <span className="text-nr-faint/40">/</span>
                                <span className={lang === 'en' ? 'text-nr-accent' : ''}>EN</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Cursor global — montado aquí para cubrir todas las páginas públicas */}
            <CustomCursor />
        </>
    )
}
