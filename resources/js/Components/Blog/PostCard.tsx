import { Link } from '@inertiajs/react'
import { formatDate, readTime } from '@/lib/utils'
import { CATEGORY_COLORS } from '@/lib/constants'
import type { Post } from '@/types'

export default function PostCard({ post }: { post: Post }) {
    const catColor = post.category ? (CATEGORY_COLORS[post.category.name] ?? '#7C6AF7') : '#7C6AF7'

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group block glass rounded-2xl overflow-hidden
                         hover:border-white/[0.18]
                         hover:-translate-y-1 will-change-transform
                         transition-[transform,border-color] duration-300 h-full"
        >
            {/* Imagen */}
            <div
                className="relative h-48 bg-gradient-to-br from-nr-surface to-nr-bg2
                            overflow-hidden flex items-center justify-center"
            >
                {post.cover_image ? (
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        width="800"
                        height="450"
                        className="w-full h-full object-cover
                                    group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="text-nr-faint font-mono text-xs text-center leading-loose">
                        <div className="text-3xl mb-2 opacity-20">◈</div>
                        NeuralRift
                    </div>
                )}
                {/* Lang badge */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                    {(post.lang === 'es' || post.lang === 'both') && (
                        <span
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold
                                         bg-nr-accent/20 border border-nr-accent/30 text-nr-accent"
                        >
                            ES
                        </span>
                    )}
                    {(post.lang === 'en' || post.lang === 'both') && (
                        <span
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold
                                         bg-nr-cyan/20 border border-nr-cyan/30 text-nr-cyan"
                        >
                            EN
                        </span>
                    )}
                </div>
            </div>

            {/* Contenido */}
            <div className="p-5">
                {/* Categoría */}
                {post.category && (
                    <span
                        className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold
                                     uppercase tracking-wider mb-3"
                        style={{
                            background: `${catColor}20`,
                            border: `1px solid ${catColor}35`,
                            color: catColor,
                        }}
                    >
                        {post.category.name}
                    </span>
                )}

                {/* Título */}
                <h3
                    className="font-display text-lg font-bold text-nr-text leading-snug
                               mb-3 group-hover:text-nr-accent transition-colors duration-300
                               line-clamp-2"
                >
                    {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-sm text-nr-muted leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                    </p>
                )}

                {/* Meta */}
                <div
                    className="flex items-center gap-3 text-xs text-nr-faint font-mono
                                pt-4 border-t border-white/[0.05]"
                >
                    <span>{formatDate(post.published_at ?? post.created_at)}</span>
                    <span className="text-white/10">·</span>
                    <span>{readTime(post.read_time)}</span>
                    <span className="text-white/10">·</span>
                    <span>{post.views_count.toLocaleString()} vistas</span>
                </div>
            </div>
        </Link>
    )
}
