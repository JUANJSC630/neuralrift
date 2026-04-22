import { Head, Link, router } from '@inertiajs/react'
import { motion } from 'framer-motion'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import PostCard from '@/Components/Blog/PostCard'
import PostCardFeatured from '@/Components/Blog/PostCardFeatured'
import { CATEGORY_COLORS, SITE } from '@/lib/constants'
import type { Category, Post, PaginatedData } from '@/types'

interface Props {
    category: Category
    posts: PaginatedData<Post>
    featured: Post | null
}

export default function CategoryShow({ category, posts, featured }: Props) {
    const color = CATEGORY_COLORS[category.name] ?? category.color ?? '#7C6AF7'

    return (
        <>
            <Head title={`${category.name} — ${SITE.name}`}>
                <meta
                    name="description"
                    content={category.description ?? `Artículos de ${category.name}`}
                />
            </Head>

            <Navbar />

            <main className="pt-[70px] min-h-screen bg-nr-bg">
                {/* Hero with category-colored gradient */}
                <section className="relative overflow-hidden border-b border-white/[0.05]">
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse 70% 60% at 15% 50%, ${color}18 0%, transparent 70%)`,
                        }}
                    />
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
                            <span>›</span>
                            <span style={{ color }}>{category.name}</span>
                        </nav>

                        <div className="flex items-center gap-5 flex-wrap">
                            {category.icon && <span className="text-5xl">{category.icon}</span>}
                            <div className="flex-1 min-w-0">
                                <motion.h1
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="font-display text-4xl md:text-5xl font-black"
                                    style={{ color }}
                                >
                                    {category.name}
                                </motion.h1>
                                {category.description && (
                                    <p className="text-nr-muted mt-2 max-w-lg">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                            <span className="text-xs font-mono text-nr-faint glass px-3 py-1.5 rounded-lg shrink-0">
                                {posts.total} artículos
                            </span>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                    {/* Featured post */}
                    {featured && (
                        <div className="mb-12">
                            <PostCardFeatured post={featured} />
                        </div>
                    )}

                    {/* Grid — exclude featured to avoid duplicate */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div className="flex justify-center gap-2 mt-12">
                            {posts.links.map((link, i) =>
                                link.url ? (
                                    <button
                                        key={i}
                                        onClick={() => router.get(link.url!)}
                                        className="px-4 py-2 rounded-lg text-sm transition-colors
                                                       glass text-nr-faint hover:text-nr-muted"
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
                                        className="px-4 py-2 text-nr-faint/30 text-sm"
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
