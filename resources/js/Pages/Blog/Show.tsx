import { Head, Link } from '@inertiajs/react'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import PostCard from '@/Components/Blog/PostCard'
import AffiliateWidget from '@/Components/Blog/AffiliateWidget'
import NewsletterWidget from '@/Components/Blog/NewsletterWidget'
import ReadingProgress from '@/Components/Blog/ReadingProgress'
import TableOfContents from '@/Components/Blog/TableOfContents'
import ShareButtons from '@/Components/Blog/ShareButtons'
import { formatDate, readTime } from '@/lib/utils'
import { renderContent } from '@/lib/tiptap'
import { CATEGORY_COLORS, SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'
import type { Post } from '@/types'

interface Props {
    post: Post
    related: Post[]
    schema?: Record<string, unknown>
    lang?: 'es' | 'en'
}

export default function BlogShow({ post, related, schema, lang = 'es' }: Props) {
    const catColor = post.category
        ? (CATEGORY_COLORS[post.category.name] ?? post.category.color ?? '#7C6AF7')
        : '#7C6AF7'
    const { locale, t, localePath } = useLocale()
    const isEn = locale === 'en'

    const title = isEn && post.title_en ? post.title_en : post.title
    const raw = isEn && post.content_en ? post.content_en : post.content
    const content = renderContent(raw)
    const excerpt = isEn && post.excerpt_en ? post.excerpt_en : post.excerpt
    const catName = isEn && post.category?.name_en ? post.category.name_en : post.category?.name

    const postUrl =
        typeof window !== 'undefined' ? window.location.href : `${SITE.url}/blog/${post.slug}`

    const [featuredAffiliate, ...restAffiliates] = post.affiliates ?? []

    // Noop effect — view tracking is handled server-side on show()
    useEffect(() => {}, [post.id])

    return (
        <>
            <Head title={`${title} — ${SITE.name}`}>
                <meta name="description" content={excerpt ?? ''} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={excerpt ?? ''} />
                {post.og_image && <meta property="og:image" content={post.og_image} />}
                {!post.indexable && <meta name="robots" content="noindex" />}
                {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
            </Head>

            <ReadingProgress />
            <Navbar />

            <main className="min-h-screen bg-nr-bg pt-[70px]">
                {/* Hero */}
                <section
                    className="relative overflow-hidden border-b border-white/[0.05]"
                    style={{
                        background: `linear-gradient(135deg, ${catColor}12 0%, transparent 60%)`,
                    }}
                >
                    <div className="mesh-bg pointer-events-none absolute inset-0 opacity-60" />
                    <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-12">
                        {/* Breadcrumb */}
                        <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-nr-faint">
                            <Link
                                href={localePath('/')}
                                className="transition-colors hover:text-nr-muted"
                            >
                                {t('post.home')}
                            </Link>
                            <span>›</span>
                            <Link
                                href={localePath('/blog')}
                                className="transition-colors hover:text-nr-muted"
                            >
                                {t('post.blog')}
                            </Link>
                            {post.category && (
                                <>
                                    <span>›</span>
                                    <Link
                                        href={
                                            isEn
                                                ? `/en/category/${post.category.slug}`
                                                : `/categoria/${post.category.slug}`
                                        }
                                        className="transition-colors hover:text-nr-muted"
                                    >
                                        {catName}
                                    </Link>
                                </>
                            )}
                        </nav>

                        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_auto]">
                            <div>
                                {/* Badges */}
                                <div className="mb-5 flex flex-wrap items-center gap-2">
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
                                    {post.featured && (
                                        <span className="rounded-full border border-nr-gold/20 bg-nr-gold/10 px-3 py-1 text-xs font-semibold text-nr-gold">
                                            {t('post.featured')}
                                        </span>
                                    )}
                                    {post.lang === 'both' && lang === 'es' && post.slug_en && (
                                        <Link
                                            href={`/en/blog/${post.slug_en}`}
                                            className="glass rounded-full border-nr-cyan/20 px-3 py-1 text-xs font-semibold text-nr-cyan transition-colors hover:border-nr-cyan/40"
                                        >
                                            🌐 EN
                                        </Link>
                                    )}
                                    {post.lang === 'both' && lang === 'en' && (
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="glass rounded-full border-nr-accent/20 px-3 py-1 text-xs font-semibold text-nr-accent transition-colors hover:border-nr-accent/40"
                                        >
                                            🌐 ES
                                        </Link>
                                    )}
                                </div>

                                {/* Title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-6 font-display text-3xl font-black leading-tight text-nr-text md:text-5xl"
                                >
                                    {title}
                                </motion.h1>

                                {/* Meta */}
                                <div className="mb-6 flex flex-wrap items-center gap-4">
                                    {post.author && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-nr-accent to-nr-cyan text-xs font-bold text-white">
                                                {post.author.name[0]}
                                            </div>
                                            <span className="text-sm text-nr-muted">
                                                {post.author.name}
                                            </span>
                                        </div>
                                    )}
                                    <span className="font-mono text-xs text-nr-faint">
                                        {formatDate(post.published_at ?? post.created_at)}
                                    </span>
                                    <span className="font-mono text-xs text-nr-faint">
                                        ⏱ {readTime(post.read_time)}
                                    </span>
                                    <span className="font-mono text-xs text-nr-faint">
                                        👁 {post.views_count.toLocaleString()} {t('post.views')}
                                    </span>
                                </div>

                                <ShareButtons url={postUrl} title={title} />
                            </div>

                            {/* Cover image right column (desktop) */}
                            {post.cover_image && (
                                <div className="hidden w-64 shrink-0 lg:block xl:w-80">
                                    <img
                                        src={post.cover_image}
                                        alt={title}
                                        className="aspect-[4/3] w-full rounded-2xl object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Cover image mobile */}
                {post.cover_image && (
                    <div className="mx-auto max-w-3xl px-6 pt-8 md:px-12 lg:hidden">
                        <img
                            src={post.cover_image}
                            alt={title}
                            className="max-h-[300px] w-full rounded-2xl object-cover"
                        />
                    </div>
                )}

                {/* Content + Sidebar */}
                <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
                        {/* Article body */}
                        <article>
                            {/* Mobile ToC */}
                            <div className="mb-8 lg:hidden">
                                <TableOfContents content={content} />
                            </div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="mb-8 flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <Link
                                            key={tag.id}
                                            href={`${localePath('/blog')}?tag=${tag.slug}`}
                                            className="glass rounded-full px-3 py-1 text-xs text-nr-faint transition-colors hover:text-nr-muted"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Excerpt as lead */}
                            {excerpt && (
                                <p className="mb-8 rounded-lg bg-nr-accent/[0.05] px-5 py-3 text-lg italic leading-[1.7] text-nr-muted md:text-xl">
                                    {excerpt}
                                </p>
                            )}

                            {/* Featured affiliate before content */}
                            {featuredAffiliate && (
                                <div className="mb-8">
                                    <AffiliateWidget affiliate={featuredAffiliate} />
                                </div>
                            )}

                            {/* Post content */}
                            <div
                                className="nr-prose"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />

                            {/* Share footer */}
                            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-8">
                                <span className="text-sm text-nr-faint">{t('post.share_cta')}</span>
                                <ShareButtons url={postUrl} title={title} />
                            </div>

                            {/* Author bio */}
                            {post.author && (
                                <div className="mt-10 flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-nr-surface p-6">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nr-accent to-nr-cyan text-lg font-bold text-white">
                                        {post.author.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-nr-text">
                                            {post.author.name}
                                        </p>
                                        {post.author.bio && (
                                            <p className="mt-1 text-sm text-nr-faint">
                                                {post.author.bio}
                                            </p>
                                        )}
                                        {post.author.twitter && (
                                            <a
                                                href={`https://twitter.com/${post.author.twitter}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 inline-block text-xs text-nr-accent hover:underline"
                                            >
                                                @{post.author.twitter}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Remaining affiliates */}
                            {restAffiliates.length > 0 && (
                                <section className="mt-12 border-t border-white/[0.06] pt-10">
                                    <h2 className="mb-6 font-display text-xl font-bold text-nr-text">
                                        {t('post.tools_mentioned')}
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {restAffiliates.map(affiliate => (
                                            <AffiliateWidget
                                                key={affiliate.id}
                                                affiliate={affiliate}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </article>

                        {/* Sticky sidebar */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-[90px] space-y-6">
                                <TableOfContents content={content} />

                                {/* Newsletter compact */}
                                <div className="rounded-2xl border border-white/[0.08] bg-nr-surface p-5">
                                    <p className="mb-1 text-sm font-semibold text-nr-text">
                                        {t('post.sidebar_newsletter_title')}
                                    </p>
                                    <p className="mb-4 text-xs text-nr-faint">
                                        {t('post.sidebar_newsletter_text')}
                                    </p>
                                    <form
                                        onSubmit={e => e.preventDefault()}
                                        className="flex flex-col gap-2"
                                    >
                                        <label
                                            htmlFor="sidebar-newsletter-email"
                                            className="sr-only"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="sidebar-newsletter-email"
                                            type="email"
                                            placeholder={t('newsletter.placeholder')}
                                            className="glass w-full rounded-lg px-3 py-2 text-sm text-nr-text placeholder-nr-faint outline-none transition-colors focus:border-nr-accent/50"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full rounded-lg bg-gradient-to-r from-nr-accent to-nr-accent-dark py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                                        >
                                            {t('post.sidebar_subscribe')}
                                        </button>
                                    </form>
                                </div>

                                {/* Sidebar affiliates (first 2 of rest) */}
                                {restAffiliates.slice(0, 2).map(affiliate => (
                                    <AffiliateWidget key={affiliate.id} affiliate={affiliate} />
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Related posts */}
                {related.length > 0 && (
                    <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
                        <div className="border-t border-white/[0.06] pt-16">
                            <h2 className="mb-8 font-display text-2xl font-bold text-nr-text">
                                {t('post.related')}
                            </h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {related.map((p, i) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.1 }}
                                    >
                                        <PostCard post={p} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="mx-auto max-w-4xl px-6 pb-24 md:px-12">
                    <NewsletterWidget />
                </section>
            </main>

            <Footer />
        </>
    )
}
