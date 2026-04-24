import { Head, Link } from '@inertiajs/react'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import PostCard from '@/Components/Blog/PostCard'
import AffiliateWidget from '@/Components/Blog/AffiliateWidget'
import NewsletterWidget from '@/Components/Blog/NewsletterWidget'
import ReadingProgress from '@/Components/Blog/ReadingProgress'
import TableOfContents from '@/Components/Blog/TableOfContents'
import ShareButtons from '@/Components/Blog/ShareButtons'
import CommentSection from '@/Components/Blog/CommentSection'
import { formatDate, readTime } from '@/lib/utils'
import { renderContent } from '@/lib/tiptap'
import { CATEGORY_COLORS, SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'
import LikeButton from '@/Components/Blog/LikeButton'
import type { Post, Comment as CommentType } from '@/types'

interface Props {
    post: Post
    comments: CommentType[]
    related: Post[]
    schema?: Record<string, unknown>
    lang?: 'es' | 'en'
    canonical?: string
    alternates?: { es: string; en: string | null }
}

export default function BlogShow({
    post,
    comments,
    related,
    schema,
    lang = 'es',
    canonical,
    alternates: _alternates,
}: Props) {
    const catColor = post.category
        ? (CATEGORY_COLORS[post.category.name] ?? post.category.color ?? '#7C6AF7')
        : '#7C6AF7'
    const { locale, t, localePath } = useLocale()
    // Only treat as English if both the user's locale AND the post's lang field support it
    const isEn = locale === 'en' && (post.lang === 'en' || post.lang === 'both')

    const title = isEn && post.title_en ? post.title_en : post.title
    const raw = isEn && post.content_en ? post.content_en : post.content
    const content = renderContent(raw)
    const excerpt = isEn && post.excerpt_en ? post.excerpt_en : post.excerpt
    const catName = isEn && post.category?.name_en ? post.category.name_en : post.category?.name

    const postUrl =
        typeof window !== 'undefined' ? window.location.href : `${SITE.url}/blog/${post.slug}`

    const [featuredAffiliate, ...restAffiliates] = post.affiliates ?? []

    // Client-side re-render fallback: ensures hljs syntax highlighting even when
    // SSR output differs slightly from client output (hydration mismatch).
    const proseRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!proseRef.current) return
        const rendered = renderContent(raw)
        // Only update if we got actual HTML back (not the original JSON/string)
        if (rendered && rendered !== raw && rendered.includes('<')) {
            proseRef.current.innerHTML = rendered
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Track view via API
    useEffect(() => {
        const xsrf = document.cookie
            .split('; ')
            .find(r => r.startsWith('XSRF-TOKEN='))
            ?.split('=')[1]

        fetch(`/api/views/${post.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': xsrf ? decodeURIComponent(xsrf) : '',
            },
        }).catch(() => {})
    }, [post.id])

    return (
        <>
            <Head title={`${title} — ${SITE.name}`}>
                <meta name="description" content={excerpt ?? ''} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={excerpt ?? ''} />
                <meta property="og:type" content="article" />
                <meta property="og:locale" content={isEn ? 'en_US' : 'es_CO'} />
                <meta property="og:site_name" content={SITE.name} />
                {canonical && <meta property="og:url" content={canonical} />}
                {(post.og_image || post.cover_image) && (
                    <meta property="og:image" content={post.og_image || post.cover_image!} />
                )}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={SITE.twitter} />
                {!post.indexable && <meta name="robots" content="noindex" />}
                {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
            </Head>

            <ReadingProgress />
            <Navbar />

            <main id="main-content" className="min-h-screen bg-nr-bg pt-[70px]">
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
                        <nav className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-nr-faint">
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
                                        {formatDate(
                                            post.published_at ?? post.created_at,
                                            'd MMM yyyy',
                                            locale,
                                        )}
                                    </span>
                                    <span className="font-mono text-xs text-nr-faint">
                                        ⏱ {readTime(post.read_time, locale)}
                                    </span>
                                    <span className="font-mono text-xs text-nr-faint">
                                        👁 {post.views_count.toLocaleString()} {t('post.views')}
                                    </span>
                                    <LikeButton
                                        postId={post.id}
                                        initialCount={post.likes_count}
                                        size="sm"
                                    />
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
                        <article className="min-w-0">
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
                                ref={proseRef}
                                className="nr-prose"
                                suppressHydrationWarning
                                dangerouslySetInnerHTML={{ __html: content }}
                            />

                            {/* Like CTA */}
                            <div className="mt-12 flex justify-center border-t border-white/[0.06] pt-10">
                                <LikeButton
                                    postId={post.id}
                                    initialCount={post.likes_count}
                                    size="lg"
                                />
                            </div>

                            {/* Share footer */}
                            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-8">
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

                            {/* Comments */}
                            <CommentSection
                                postId={post.id}
                                comments={comments}
                                commentsCount={post.comments_count ?? 0}
                                allowComments={post.allow_comments}
                            />
                        </article>

                        {/* Sticky sidebar */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-[90px] space-y-6">
                                <TableOfContents content={content} />

                                <NewsletterWidget compact />

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
