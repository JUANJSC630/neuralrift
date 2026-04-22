import { Link } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useLocale } from '@/hooks/useLocale'
import { getNavLinks, LOCALE_ROUTES, altLocale } from '@/lib/i18n'
import CustomCursor from '@/Components/Layout/CustomCursor'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const { locale, t, localePath } = useLocale()
    const navLinks = getNavLinks(locale)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Build the URL for the opposite locale
    const getSwitchUrl = () => {
        if (typeof window === 'undefined') return locale === 'es' ? '/en' : '/'
        const path = window.location.pathname
        const map = LOCALE_ROUTES[locale] ?? {}

        // Exact match first
        if (map[path]) return map[path]

        // Blog post: /blog/slug ↔ /en/blog/slug
        if (locale === 'es' && path.startsWith('/blog/')) return `/en${path}`
        if (locale === 'en' && path.startsWith('/en/blog/')) return path.replace('/en', '')

        // Category: /categoria/slug ↔ /en/category/slug
        if (locale === 'es' && path.startsWith('/categoria/'))
            return `/en/category/${path.split('/').pop()}`
        if (locale === 'en' && path.startsWith('/en/category/'))
            return `/categoria/${path.split('/').pop()}`

        // Default
        return locale === 'es' ? '/en' : '/'
    }

    const other = altLocale(locale)

    return (
        <>
            {/* Skip link */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:border focus:border-nr-accent/50 focus:bg-nr-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-nr-text"
            >
                {t('nav.skip')}
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
                    href={localePath('/')}
                    className="flex-shrink-0 font-display text-xl font-black tracking-tight"
                >
                    <span className="text-gradient">NeuralRift</span>
                </Link>

                {/* Links desktop */}
                <ul className="hidden flex-1 items-center justify-center gap-8 md:flex">
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="group relative text-sm font-medium text-nr-muted transition-colors hover:text-nr-text"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-nr-accent transition-transform duration-300 group-hover:scale-x-100" />
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Actions */}
                <div className="ml-auto flex items-center gap-3">
                    {/* Lang toggle — real navigation */}
                    <Link
                        href={getSwitchUrl()}
                        className="glass hidden items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-nr-faint transition-colors hover:text-nr-muted md:flex"
                        aria-label={t('nav.changeLang')}
                    >
                        <span className={locale === 'es' ? 'text-nr-accent' : ''}>ES</span>
                        <span className="text-nr-faint/40">/</span>
                        <span className={locale === 'en' ? 'text-nr-accent' : ''}>EN</span>
                    </Link>

                    {/* CTA */}
                    <Link
                        href={locale === 'es' ? '/#newsletter' : '/en#newsletter'}
                        className="glow-accent hover:glow-accent-lg inline-flex min-h-[44px] flex-shrink-0 items-center rounded-full bg-gradient-to-r from-nr-accent to-nr-accent-dark px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                    >
                        {t('nav.subscribe')}
                    </Link>

                    {/* Mobile hamburger */}
                    <button
                        className="ml-1 flex min-h-[44px] min-w-[44px] items-center justify-center text-nr-muted hover:text-nr-text md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav"
                        aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
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
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="py-1 text-sm font-medium text-nr-muted transition-colors hover:text-nr-text"
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-1 border-t border-white/[0.06] pt-2">
                            <Link
                                href={getSwitchUrl()}
                                className="glass flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-nr-faint transition-colors hover:text-nr-muted"
                                aria-label={t('nav.changeLang')}
                                onClick={() => setMobileOpen(false)}
                            >
                                <span className={locale === 'es' ? 'text-nr-accent' : ''}>ES</span>
                                <span className="text-nr-faint/40">/</span>
                                <span className={locale === 'en' ? 'text-nr-accent' : ''}>EN</span>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Cursor global — montado aquí para cubrir todas las páginas públicas */}
            <CustomCursor />
        </>
    )
}
