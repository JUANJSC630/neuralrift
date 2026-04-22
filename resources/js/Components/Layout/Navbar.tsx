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
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100]
                      focus:px-4 focus:py-2 focus:rounded-lg focus:bg-nr-surface focus:text-nr-text
                      focus:border focus:border-nr-accent/50 focus:text-sm focus:font-medium"
            >
                Saltar al contenido
            </a>

            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center px-6 md:px-12',
                    'transition-all duration-300',
                    scrolled
                        ? 'glass-strong border-b border-white/[0.08]'
                        : 'bg-transparent border-b border-transparent',
                )}
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="font-display text-xl font-black tracking-tight flex-shrink-0"
                >
                    <span className="text-gradient">NeuralRift</span>
                </Link>

                {/* Links desktop */}
                <ul className="hidden md:flex items-center gap-8 flex-1 justify-center">
                    {NAV_LINKS.map(link => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="text-sm font-medium text-nr-muted hover:text-nr-text
                                       transition-colors relative group"
                            >
                                {lang === 'es' ? link.label : link.labelEn}
                                <span
                                    className="absolute -bottom-1 left-0 right-0 h-px bg-nr-accent
                                             scale-x-0 group-hover:scale-x-100 transition-transform
                                             duration-300 origin-left"
                                />
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Actions */}
                <div className="ml-auto flex items-center gap-3">
                    {/* Lang toggle */}
                    <button
                        onClick={() => setLang(l => (l === 'es' ? 'en' : 'es'))}
                        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg
                               text-xs font-mono text-nr-faint hover:text-nr-muted transition-colors"
                    >
                        <span className={lang === 'es' ? 'text-nr-accent' : ''}>ES</span>
                        <span className="text-nr-faint/40">/</span>
                        <span className={lang === 'en' ? 'text-nr-accent' : ''}>EN</span>
                    </button>

                    {/* CTA */}
                    <a
                        href="/#newsletter"
                        className="px-4 py-2 rounded-full text-sm font-semibold text-white
                              bg-gradient-to-r from-nr-accent to-nr-accent-dark
                              glow-accent hover:glow-accent-lg transition-all duration-300
                              hover:-translate-y-0.5 flex-shrink-0 min-h-[44px] inline-flex
                              items-center"
                    >
                        ✦ Suscribirse
                    </a>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-nr-muted hover:text-nr-text ml-1 min-h-[44px] min-w-[44px]
                               flex items-center justify-center"
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
                <div
                    className="absolute bottom-0 left-0 w-1/3 h-0.5
                            bg-gradient-to-r from-nr-accent to-nr-cyan rounded-full"
                />

                {/* Mobile menu */}
                {mobileOpen && (
                    <div
                        id="mobile-nav"
                        className="absolute top-full left-0 right-0 glass-strong border-b
                                border-white/[0.08] py-4 px-6 flex flex-col gap-3 md:hidden"
                    >
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-nr-muted hover:text-nr-text
                                       transition-colors py-1"
                                onClick={() => setMobileOpen(false)}
                            >
                                {lang === 'es' ? link.label : link.labelEn}
                            </Link>
                        ))}
                        <div className="pt-2 mt-1 border-t border-white/[0.06]">
                            <button
                                onClick={() => setLang(l => (l === 'es' ? 'en' : 'es'))}
                                className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg
                                       text-xs font-mono text-nr-faint hover:text-nr-muted transition-colors"
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
