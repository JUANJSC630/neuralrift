import { Link } from '@inertiajs/react'
import { formatDate, readTime } from '@/lib/utils'
import { CATEGORY_COLORS } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'
import type { Post } from '@/types'

export default function PostCard({ post }: { post: Post }) {
    const catColor = post.category ? (CATEGORY_COLORS[post.category.name] ?? '#7C6AF7') : '#7C6AF7'
    const { locale, t, localePath } = useLocale()
    const isEn = locale === 'en'
    const slug = isEn && post.slug_en ? post.slug_en : post.slug
    const title = isEn && post.title_en ? post.title_en : post.title
    const excerpt = isEn && post.excerpt_en ? post.excerpt_en : post.excerpt

    return (
        <Link
            href={`${localePath('/blog')}/${slug}`}
            className="glass group block h-full overflow-hidden rounded-2xl transition-[transform,border-color] duration-300 will-change-transform hover:-translate-y-1 hover:border-white/[0.18]"
        >
            {/* Imagen */}
            <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-nr-surface to-nr-bg2">
                {post.cover_image ? (
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        width="800"
                        height="450"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="text-center font-mono text-xs leading-loose text-nr-faint">
                        <div className="mb-2 text-3xl opacity-20">◈</div>
                        NeuralRift
                    </div>
                )}
                {/* Lang badge */}
                <div className="absolute right-3 top-3 flex gap-1.5">
                    {(post.lang === 'es' || post.lang === 'both') && (
                        <span className="rounded border border-nr-accent/30 bg-nr-accent/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-nr-accent">
                            ES
                        </span>
                    )}
                    {(post.lang === 'en' || post.lang === 'both') && (
                        <span className="rounded border border-nr-cyan/30 bg-nr-cyan/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-nr-cyan">
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
                        className="mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
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
                <h3 className="mb-3 line-clamp-2 font-display text-lg font-bold leading-snug text-nr-text transition-colors duration-300 group-hover:text-nr-accent">
                    {title}
                </h3>

                {/* Excerpt */}
                {excerpt && (
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-nr-muted">
                        {excerpt}
                    </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-3 border-t border-white/[0.05] pt-4 font-mono text-xs text-nr-faint">
                    <span>{formatDate(post.published_at ?? post.created_at)}</span>
                    <span className="text-white/10">·</span>
                    <span>{readTime(post.read_time)}</span>
                    <span className="text-white/10">·</span>
                    <span>{post.views_count.toLocaleString()} {t('postcard.views')}</span>
                </div>
            </div>
        </Link>
    )
}
