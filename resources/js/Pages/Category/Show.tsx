import { Head, Link, router } from '@inertiajs/react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import PostCard from '@/Components/Blog/PostCard'
import PostCardFeatured from '@/Components/Blog/PostCardFeatured'
import { CATEGORY_COLORS, SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'
import type { Category, Post, PaginatedData } from '@/types'

interface Props {
    category: Category
    posts: PaginatedData<Post>
    featured: Post | null
}

export default function CategoryShow({ category, posts, featured }: Props) {
    const color = CATEGORY_COLORS[category.name] ?? category.color ?? '#7C6AF7'
    const { locale, t, localePath } = useLocale()
    const isEn = locale === 'en'
    const catName = isEn && category.name_en ? category.name_en : category.name
    const catDesc = isEn && category.description_en ? category.description_en : category.description

    return (
        <>
            <Head title={`${catName} — ${SITE.name}`}>
                <meta
                    name="description"
                    content={catDesc ?? `${catName} articles`}
                />
            </Head>

            <Navbar />

            <main className="min-h-screen bg-nr-bg pt-[70px]">
                {/* Hero with category-colored gradient */}
                <section className="relative overflow-hidden border-b border-white/[0.05]">
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: `radial-gradient(ellipse 70% 60% at 15% 50%, ${color}18 0%, transparent 70%)`,
                        }}
                    />
                    <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-12">
                        {/* Breadcrumb */}
                        <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-nr-faint">
                            <Link href={localePath('/')} className="transition-colors hover:text-nr-muted">
                                {t('post.home')}
                            </Link>
                            <span>›</span>
                            <Link href={localePath('/blog')} className="transition-colors hover:text-nr-muted">
                                {t('post.blog')}
                            </Link>
                            <span>›</span>
                            <span style={{ color }}>{catName}</span>
                        </nav>

                        <div className="flex flex-wrap items-center gap-5">
                            {category.icon && <span className="text-5xl">{category.icon}</span>}
                            <div className="min-w-0 flex-1">
                                <motion.h1
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="font-display text-4xl font-black md:text-5xl"
                                    style={{ color }}
                                >
                                    {catName}
                                </motion.h1>
                                {catDesc && (
                                    <p className="mt-2 max-w-lg text-nr-muted">
                                        {catDesc}
                                    </p>
                                )}
                            </div>
                            <span className="glass shrink-0 rounded-lg px-3 py-1.5 font-mono text-xs text-nr-faint">
                                {posts.total} {t('category.articles_count')}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-6 py-12 md:px-12">
                    {/* Featured post */}
                    {featured && (
                        <div className="mb-12">
                            <PostCardFeatured post={featured} />
                        </div>
                    )}

                    {/* Grid — exclude featured to avoid duplicate */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.data
                            .filter(p => p.id !== featured?.id)
                            .map((post, i) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.06 }}
                                >
                                    <PostCard post={post} />
                                </motion.div>
                            ))}
                    </div>

                    {/* Pagination with category-themed active page */}
                    {posts.last_page > 1 && (
                        <div className="mt-12 flex justify-center gap-2">
                            {posts.links.map((link, i) =>
                                link.url ? (
                                    <button
                                        key={i}
                                        onClick={() => router.get(link.url!)}
                                        className="glass rounded-lg px-4 py-2 text-sm text-nr-faint transition-colors hover:text-nr-muted"
                                        style={
                                            link.active
                                                ? {
                                                      background: `${color}25`,
                                                      border: `1px solid ${color}40`,
                                                      color,
                                                  }
                                                : {}
                                        }
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="px-4 py-2 text-sm text-nr-faint/30"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ),
                            )}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </>
    )
}
