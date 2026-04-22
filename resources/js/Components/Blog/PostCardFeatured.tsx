import { Link } from '@inertiajs/react'
import { formatDate, readTime } from '@/lib/utils'
import { CATEGORY_COLORS } from '@/lib/constants'
import type { Post } from '@/types'

export default function PostCardFeatured({ post }: { post: Post }) {
    const catColor = post.category ? (CATEGORY_COLORS[post.category.name] ?? '#7C6AF7') : '#7C6AF7'

    return (
        <div className="border-gradient-animated">
            <Link
                href={`/blog/${post.slug}`}
                className="group block relative min-h-[280px] sm:min-h-[400px] rounded-[17px] overflow-hidden
                             bg-gradient-to-br from-nr-bg3 to-nr-surface
                             flex items-end transition-colors duration-300"
            >
                {/* Glow orbs */}
                <div
                    className="absolute -top-10 -left-10 w-72 h-72 rounded-full
                                bg-nr-accent/10 blur-2xl pointer-events-none"
                />
                <div
                    className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full
                                bg-nr-cyan/[0.08] blur-2xl pointer-events-none"
                />

                {/* Grid pattern bg */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                             repeating-linear-gradient(45deg, rgba(124,106,247,.025) 0, rgba(124,106,247,.025) 1px, transparent 1px, transparent 44px),
                             repeating-linear-gradient(-45deg, rgba(6,182,212,.025) 0, rgba(6,182,212,.025) 1px, transparent 1px, transparent 44px)
                         `,
                    }}
                />

                {/* Badge */}
                <div
                    className="absolute top-4 right-5 px-2 py-1 glass rounded font-mono
                                    text-[10px] text-nr-faint"
                >
                    ★ ARTÍCULO DESTACADO
                </div>

                {/* Cover image */}
                {post.cover_image && (
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-20
                                   group-hover:opacity-25 transition-opacity duration-500"
                    />
                )}

                {/* Contenido */}
                <div className="relative z-10 p-8 md:p-12 max-w-2xl">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {post.category && (
                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                                style={{
                                    background: `${catColor}20`,
                                    border: `1px solid ${catColor}35`,
                                    color: catColor,
                                }}
                            >
                                {post.category.name}
                            </span>
                        )}
                        {(post.lang === 'es' || post.lang === 'both') && (
                            <span
                                className="px-2 py-0.5 rounded text-[10px] font-mono
                                                 bg-nr-accent/20 border border-nr-accent/30 text-nr-accent"
                            >
                                ES
                            </span>
                        )}
                        {(post.lang === 'en' || post.lang === 'both') && (
                            <span
                                className="px-2 py-0.5 rounded text-[10px] font-mono
                                                 bg-nr-cyan/20 border border-nr-cyan/30 text-nr-cyan"
                            >
                                EN
                            </span>
                        )}
                    </div>

                    {/* Título */}
                    <h2
                        className="font-display text-2xl md:text-4xl font-bold leading-[1.15]
                                       text-nr-text mb-4 group-hover:text-nr-accent transition-colors duration-300"
                    >
                        {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p
                            className="text-nr-muted text-sm md:text-base leading-relaxed
                                          mb-6 line-clamp-2"
                        >
                            {post.excerpt}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-5 flex-wrap">
                        {post.author && (
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-7 h-7 rounded-full bg-gradient-to-br
                                                    from-nr-accent to-nr-cyan flex items-center
                                                    justify-center text-xs font-bold text-white flex-shrink-0"
                                >
                                    {post.author.name[0]}
                                </div>
                                <span className="text-sm text-nr-muted">{post.author.name}</span>
                            </div>
                        )}
                        <span className="font-mono text-xs text-nr-faint">
                            {formatDate(post.published_at ?? post.created_at)}
                        </span>
                        <span className="font-mono text-xs text-nr-faint">
                            ⏱ {readTime(post.read_time)}
                        </span>
                        <span className="font-mono text-xs text-nr-faint">
                            👁 {post.views_count.toLocaleString()}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    )
}
