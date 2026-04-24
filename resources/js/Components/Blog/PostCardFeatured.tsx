import { Link } from '@inertiajs/react'
import { formatDate, readTime } from '@/lib/utils'
import { CATEGORY_COLORS } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'
import type { Post } from '@/types'

export default function PostCardFeatured({ post }: { post: Post }) {
    const catColor = post.category ? (CATEGORY_COLORS[post.category.name] ?? '#7C6AF7') : '#7C6AF7'
    const { locale, t, localePath } = useLocale()
    const isEn = locale === 'en'
    const slug = isEn && post.slug_en ? post.slug_en : post.slug
    const title = isEn && post.title_en ? post.title_en : post.title
    const excerpt = isEn && post.excerpt_en ? post.excerpt_en : post.excerpt
    const catName = isEn && post.category?.name_en ? post.category.name_en : post.category?.name

    return (
        <div className="border-gradient-animated">
            <Link
                href={`${localePath('/blog')}/${slug}`}
                className="group relative block flex min-h-[280px] items-end overflow-hidden rounded-[17px] bg-gradient-to-br from-nr-bg3 to-nr-surface transition-colors duration-300 sm:min-h-[400px]"
            >
                {/* Glow orbs */}
                <div className="pointer-events-none absolute -left-10 -top-10 h-72 w-72 rounded-full bg-nr-accent/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-nr-cyan/[0.08] blur-2xl" />

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
                <div className="glass absolute right-5 top-4 rounded px-2 py-1 font-mono text-[10px] text-nr-faint">
                    {t('post.featured_badge')}
                </div>

                {/* Cover image */}
                {post.cover_image && (
                    <img
                        src={post.cover_image}
                        alt={title}
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover opacity-20 transition-opacity duration-500 group-hover:opacity-25"
                    />
                )}

                {/* Contenido */}
                <div className="relative z-10 max-w-2xl p-8 md:p-12">
                    {/* Badges */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        {post.category && (
                            <span
                                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                                style={{
                                    background: `${catColor}20`,
                                    border: `1px solid ${catColor}35`,
                                    color: catColor,
                                }}
                            >
                                {catName}
                            </span>
                        )}
                        {(post.lang === 'es' || post.lang === 'both') && (
                            <span className="rounded border border-nr-accent/30 bg-nr-bg/80 px-2 py-0.5 font-mono text-[10px] text-nr-accent backdrop-blur-sm">
                                ES
                            </span>
                        )}
                        {(post.lang === 'en' || post.lang === 'both') && (
                            <span className="rounded border border-nr-cyan/30 bg-nr-bg/80 px-2 py-0.5 font-mono text-[10px] text-nr-cyan backdrop-blur-sm">
                                EN
                            </span>
                        )}
                    </div>

                    {/* Título */}
                    <h2 className="mb-4 font-display text-2xl font-bold leading-[1.15] text-nr-text transition-colors duration-300 group-hover:text-nr-accent md:text-4xl">
                        {title}
                    </h2>

                    {/* Excerpt */}
                    {excerpt && (
                        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-nr-muted md:text-base">
                            {excerpt}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-5">
                        {post.author && (
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nr-accent to-nr-cyan text-xs font-bold text-white">
                                    {post.author.name[0]}
                                </div>
                                <span className="text-sm text-nr-muted">{post.author.name}</span>
                            </div>
                        )}
                        <span className="font-mono text-xs text-nr-faint">
                            {formatDate(post.published_at ?? post.created_at, 'd MMM yyyy', locale)}
                        </span>
                        <span className="font-mono text-xs text-nr-faint">
                            ⏱ {readTime(post.read_time, locale)}
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
