import type { Affiliate } from '@/types'

export default function AffiliateWidget({ affiliate }: { affiliate: Affiliate }) {
    return (
        <div
            className="glass rounded-2xl p-5 hover:border-white/[0.18]
                        hover:-translate-y-1 will-change-transform
                        transition-[transform,border-color] duration-300 flex flex-col h-full group"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {affiliate.logo ? (
                        <img
                            src={affiliate.logo}
                            alt={affiliate.name}
                            loading="lazy"
                            decoding="async"
                            width="40"
                            height="40"
                            className="w-10 h-10 rounded-xl object-contain bg-white/5 p-1"
                        />
                    ) : (
                        <div
                            className="w-10 h-10 rounded-xl bg-gradient-to-br
                                        from-nr-accent/20 to-nr-cyan/20 flex items-center
                                        justify-center text-nr-accent font-bold text-lg"
                        >
                            {affiliate.name[0]}
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-nr-text text-sm">{affiliate.name}</h3>
                        {affiliate.category && (
                            <span className="text-xs text-nr-faint">{affiliate.category}</span>
                        )}
                    </div>
                </div>
                {affiliate.badge && (
                    <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold
                                     bg-nr-gold/15 border border-nr-gold/25 text-nr-gold
                                     whitespace-nowrap"
                    >
                        {affiliate.badge}
                    </span>
                )}
            </div>

            {/* Descripción */}
            {affiliate.description && (
                <p className="text-xs text-nr-muted leading-relaxed mb-4 flex-1 line-clamp-2">
                    {affiliate.description}
                </p>
            )}

            {/* Comisión */}
            {affiliate.commission && (
                <div className="flex items-center gap-1.5 mb-4">
                    <span className="text-xs text-nr-green font-mono font-semibold">
                        ✓ {affiliate.commission}
                    </span>
                </div>
            )}

            {/* Rating */}
            {affiliate.rating && (
                <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span
                            key={i}
                            className={`text-xs ${i < Math.floor(affiliate.rating!) ? 'text-nr-gold' : 'text-nr-faint'}`}
                        >
                            ★
                        </span>
                    ))}
                    <span className="text-xs text-nr-faint ml-1">{affiliate.rating}</span>
                </div>
            )}

            {/* CTA */}
            <a
                href={`/herramientas/${affiliate.slug}/click`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block text-center py-2.5 rounded-xl text-sm font-semibold
                          bg-gradient-to-r from-nr-accent/20 to-nr-cyan/20
                          border border-nr-accent/25 text-nr-accent
                          hover:from-nr-accent hover:to-nr-accent-dark hover:text-white
                          hover:border-transparent hover:glow-accent
                          transition-all duration-300 mt-auto"
            >
                Ver herramienta →
            </a>
        </div>
    )
}
