import { Link } from '@inertiajs/react'
import { SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'
import { getNavLinks, getLegalLinks } from '@/lib/i18n'

const SOCIAL_LINKS = [
    { label: 'Twitter/X', href: `https://twitter.com/${SITE.twitter.replace('@', '')}` },
]

export default function Footer() {
    const { locale, t } = useLocale()
    const navLinks = getNavLinks(locale)
    const legalLinks = getLegalLinks(locale)

    return (
        <footer className="mt-24 border-t border-white/[0.06] bg-nr-bg3">
            <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="text-gradient mb-3 font-display text-2xl font-black">
                            NeuralRift
                        </div>
                        <p className="max-w-sm text-sm leading-relaxed text-nr-muted">
                            {t('footer.tagline')}
                        </p>
                        {/* Social */}
                        <div className="mt-6 flex gap-3">
                            {SOCIAL_LINKS.map(s => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass rounded-lg px-3 py-1.5 text-xs text-nr-faint transition-all duration-200 hover:border-nr-accent/30 hover:text-nr-accent"
                                >
                                    {s.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-nr-faint">
                            {t('footer.navigation')}
                        </h4>
                        <ul className="space-y-2.5">
                            {navLinks.map(link => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-nr-muted transition-colors hover:text-nr-text"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-nr-faint">
                            {t('footer.legal')}
                        </h4>
                        <ul className="space-y-2.5">
                            {legalLinks.map(l => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="text-sm text-nr-muted transition-colors hover:text-nr-text"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 text-xs leading-relaxed text-nr-faint">
                            {t('footer.affiliate_disclosure')}
                        </p>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] pt-8 md:flex-row">
                    <p className="text-xs text-nr-faint">
                        © {new Date().getFullYear()} NeuralRift. {t('footer.made')}
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="/feed.xml"
                            className="text-xs text-nr-faint transition-colors hover:text-nr-orange"
                        >
                            {t('misc.rss')}
                        </a>
                        <a
                            href="/sitemap.xml"
                            className="text-xs text-nr-faint transition-colors hover:text-nr-text"
                        >
                            {t('misc.sitemap')}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
