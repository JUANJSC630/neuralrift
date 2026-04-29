import type { Affiliate } from '@/types'

function getDomain(url: string) {
    try {
        return new URL(url).hostname.replace('www.', '')
    } catch {
        return null
    }
}

export default function AffiliateWidget({ affiliate }: { affiliate: Affiliate }) {
    const hasUrl = !!affiliate.url
    const websiteDomain = affiliate.website ? getDomain(affiliate.website) : null

    return (
        <div className="glass group flex h-full flex-col rounded-2xl p-5 transition-[transform,border-color] duration-300 will-change-transform hover:-translate-y-1 hover:border-white/[0.18]">
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {affiliate.logo ? (
                        <img
                            src={affiliate.logo}
                            alt={affiliate.name}
                            loading="lazy"
                            decoding="async"
                            width="40"
                            height="40"
                            className="h-10 w-10 rounded-xl bg-white/5 object-contain p-1"
                        />
                    ) : (
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-nr-accent/20 to-nr-cyan/20 text-lg font-bold text-nr-accent">
                            {affiliate.name[0]}
                        </div>
                    )}
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-nr-text">{affiliate.name}</h3>
                        <div className="flex items-center gap-1.5">
                            {affiliate.category && (
                                <span className="text-xs text-nr-faint">{affiliate.category}</span>
                            )}
                            {affiliate.category && websiteDomain && (
                                <span className="text-xs text-nr-faint/40">·</span>
                            )}
                            {websiteDomain && (
                                <span className="font-mono text-[10px] text-nr-faint/60">
                                    {websiteDomain}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {affiliate.badge && (
                    <span className="ml-2 whitespace-nowrap rounded-full border border-nr-gold/25 bg-nr-gold/15 px-2 py-0.5 text-[10px] font-semibold text-nr-gold">
                        {affiliate.badge}
                    </span>
                )}
            </div>

            {/* Descripción */}
            {affiliate.description && (
                <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-nr-muted">
                    {affiliate.description}
                </p>
            )}

            {/* Rating */}
            {affiliate.rating && (
                <div className="mb-4 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span
                            key={i}
                            className={`text-xs ${i < Math.floor(affiliate.rating!) ? 'text-nr-gold' : 'text-nr-faint/30'}`}
                        >
                            ★
                        </span>
                    ))}
                    <span className="ml-1 font-mono text-[10px] text-nr-faint">
                        {affiliate.rating.toFixed(1)}
                    </span>
                </div>
            )}

            {/* CTA */}
            {hasUrl || affiliate.website ? (
                <a
                    href={affiliate.website ?? `/herramientas/${affiliate.slug}/click`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    aria-label={`Ver ${affiliate.name}`}
                    className="mt-auto flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-nr-accent/25 bg-gradient-to-r from-nr-accent/20 to-nr-cyan/20 py-2.5 text-center text-sm font-semibold text-nr-accent transition-all duration-300 hover:border-transparent hover:from-nr-accent hover:to-nr-accent-dark hover:text-white"
                >
                    Ver herramienta →
                </a>
            ) : (
                <div className="mt-auto flex min-h-[44px] items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5 text-center text-sm text-nr-faint/50">
                    Próximamente
                </div>
            )}
        </div>
    )
}
