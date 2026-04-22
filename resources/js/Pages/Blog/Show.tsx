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

    const title = lang === 'en' && post.title_en ? post.title_en : post.title
    const raw = lang === 'en' && post.content_en ? post.content_en : post.content
    const content = renderContent(raw)
    const excerpt = lang === 'en' && post.excerpt_en ? post.excerpt_en : post.excerpt

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

            <main className="pt-[70px] min-h-screen bg-nr-bg">
                {/* Hero */}
                <section
                    className="relative overflow-hidden border-b border-white/[0.05]"
                    style={{
                        background: `linear-gradient(135deg, ${catColor}12 0%, transparent 60%)`,
                    }}
                >
                    <div className="absolute inset-0 mesh-bg pointer-events-none opacity-60" />
                    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-2 text-xs text-nr-faint font-mono mb-6">
                            <Link href="/" className="hover:text-nr-muted transition-colors">
                                Inicio
                            </Link>
                            <span>›</span>
                            <Link href="/blog" className="hover:text-nr-muted transition-colors">
                                Blog
                            </Link>
                            {post.category && (
                                <>
                                    <span>›</span>
                                    <Link
                                        href={`/categorias/${post.category.slug}`}
                                        className="hover:text-nr-muted transition-colors"
                                    >
                                        {post.category.name}
                                    </Link>
                                </>
                            )}
                        </nav>

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
                            <div>
                                {/* Badges */}
                                <div className="flex flex-wrap items-center gap-2 mb-5">
                                    {post.category && (
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-semibold
                                                         uppercase tracking-wider"
                                            style={{
                                                background: `${catColor}20`,
                                                border: `1px solid ${catColor}35`,
                                                color: catColor,
                                            }}
                                        >
                                            {post.category.name}
                                        </span>
                                    )}
                                    {post.featured && (
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-semibold
                                                         text-nr-gold bg-nr-gold/10 border border-nr-gold/20"
                                        >
                                            ★ Destacado
                                        </span>
                                    )}
                                    {post.lang === 'both' && lang === 'es' && post.slug_en && (
                                        <Link
                                            href={`/en/blog/${post.slug_en}`}
                                            className="px-3 py-1 rounded-full text-xs font-semibold glass
                                                         text-nr-cyan border-nr-cyan/20 hover:border-nr-cyan/40
                                                         transition-colors"
                                        >
                                            🌐 EN
                                        </Link>
                                    )}
                                </div>

                                {/* Title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="font-display text-3xl md:text-5xl font-black
                                               text-nr-text leading-tight mb-6"
                                >
                                    {title}
                                </motion.h1>

                                {/* Meta */}
                                <div className="flex items-center gap-4 flex-wrap mb-6">
                                    {post.author && (
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-8 h-8 rounded-full bg-gradient-to-br
                                                            from-nr-accent to-nr-cyan flex items-center
                                                            justify-center text-xs font-bold text-white"
                                            >
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
                                        👁 {post.views_count.toLocaleString()} vistas
                                    </span>
                                </div>

                                <ShareButtons url={postUrl} title={title} />
                            </div>

                            {/* Cover image right column (desktop) */}
                            {post.cover_image && (
                                <div className="hidden lg:block w-64 xl:w-80 shrink-0">
                                    <img
                                        src={post.cover_image}
                                        alt={title}
                                        className="rounded-2xl object-cover w-full aspect-[4/3]"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Cover image mobile */}
                {post.cover_image && (
                    <div className="lg:hidden max-w-3xl mx-auto px-6 md:px-12 pt-8">
                        <img
                            src={post.cover_image}
                            alt={title}
                            className="w-full rounded-2xl object-cover max-h-[300px]"
                        />
                    </div>
                )}

                {/* Content + Sidebar */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                        {/* Article body */}
                        <article>
                            {/* Mobile ToC */}
                            <div className="lg:hidden mb-8">
                                <TableOfContents content={content} />
                            </div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {post.tags.map(tag => (
                                        <Link
                                            key={tag.id}
                                            href={`/blog?tag=${tag.slug}`}
                                            className="px-3 py-1 rounded-full text-xs glass
                                                         text-nr-faint hover:text-nr-muted transition-colors"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Excerpt as lead */}
                            {excerpt && (
                                <p
                                    className="text-lg md:text-xl text-nr-muted italic leading-[1.7] mb-8
                                              px-5 py-3 bg-nr-accent/[0.05] rounded-lg"
                                >
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
                            <div
                                className="mt-12 pt-8 border-t border-white/[0.06]
                                            flex items-center justify-between flex-wrap gap-4"
                            >
                                <span className="text-sm text-nr-faint">
                                    ¿Te resultó útil? Compártelo
                                </span>
                                <ShareButtons url={postUrl} title={title} />
                            </div>

                            {/* Author bio */}
                            {post.author && (
                                <div className="mt-10 bg-nr-surface border border-white/[0.08] rounded-2xl p-6 flex items-start gap-4">
                                    <div
                                        className="w-12 h-12 rounded-full bg-gradient-to-br
                                                    from-nr-accent to-nr-cyan flex items-center
                                                    justify-center text-lg font-bold text-white shrink-0"
                                    >
                                        {post.author.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-nr-text">
                                            {post.author.name}
                                        </p>
                                        {post.author.bio && (
                                            <p className="text-sm text-nr-faint mt-1">
                                                {post.author.bio}
                                            </p>
                                        )}
                                        {post.author.twitter && (
                                            <a
                                                href={`https://twitter.com/${post.author.twitter}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-nr-accent mt-2 inline-block
                                                          hover:underline"
                                            >
                                                @{post.author.twitter}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Remaining affiliates */}
                            {restAffiliates.length > 0 && (
                                <section className="mt-12 pt-10 border-t border-white/[0.06]">
                                    <h2 className="font-display text-xl font-bold text-nr-text mb-6">
                                        Herramientas mencionadas
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <div className="bg-nr-surface border border-white/[0.08] rounded-2xl p-5">
                                    <p className="text-sm font-semibold text-nr-text mb-1">
                                        ¿Te gusta el contenido?
                                    </p>
                                    <p className="text-xs text-nr-faint mb-4">
                                        Únete a la newsletter semanal de IA.
                                    </p>
                                    <form
                                        onSubmit={e => e.preventDefault()}
                                        className="flex flex-col gap-2"
                                    >
                                        <label
                                            htmlFor="sidebar-newsletter-email"
                                            className="sr-only"
                                        >
                                            Tu dirección de email
                                        </label>
                                        <input
                                            id="sidebar-newsletter-email"
                                            type="email"
                                            placeholder="tu@email.com"
                                            className="w-full px-3 py-2 glass rounded-lg text-sm
                                                       text-nr-text placeholder-nr-faint outline-none
                                                       focus:border-nr-accent/50 transition-colors"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full py-2 rounded-lg text-sm font-semibold
                                                           text-white bg-gradient-to-r from-nr-accent
                                                           to-nr-accent-dark hover:-translate-y-0.5
                                                           transition-all duration-200"
                                        >
                                            Suscribirse
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
                    <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
                        <div className="border-t border-white/[0.06] pt-16">
                            <h2 className="font-display text-2xl font-bold text-nr-text mb-8">
                                Artículos relacionados
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <section className="max-w-4xl mx-auto px-6 md:px-12 pb-24">
                    <NewsletterWidget />
                </section>
            </main>

            <Footer />
        </>
    )
}
