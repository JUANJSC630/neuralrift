import { Head, Link } from '@inertiajs/react'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import { SITE } from '@/lib/constants'
import type { Category } from '@/types'

interface Props {
    categories: (Category & { posts_count: number })[]
}

export default function CategoryIndex({ categories }: Props) {
    return (
        <>
            <Head title={`Categorías — ${SITE.name}`}>
                <meta
                    name="description"
                    content="Explora todos los temas de inteligencia artificial y tecnología."
                />
            </Head>

            <Navbar />

            <main className="pt-[70px] min-h-screen bg-nr-bg">
                <section className="max-w-5xl mx-auto px-6 md:px-12 py-20">
                    {/* Header */}
                    <div className="mb-14">
                        <span className="text-xs font-mono text-nr-faint uppercase tracking-widest">
                            Explorar
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl font-black mt-2 text-gradient">
                            Categorías
                        </h1>
                        <p className="text-nr-muted mt-3 max-w-lg">
                            Todos los temas que cubro en NeuralRift, desde modelos de lenguaje hasta
                            automatización.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {categories.map(cat => (
                            <Link
                                key={cat.id}
                                href={`/categoria/${cat.slug}`}
                                className="glass rounded-2xl p-6 group hover:border-white/[0.14]
                                             transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {cat.icon ? (
                                            <span className="text-2xl">{cat.icon}</span>
                                        ) : (
                                            <div
                                                className="w-8 h-8 rounded-lg"
                                                style={{ background: cat.color + '33' }}
                                            />
                                        )}
                                        <div
                                            className="w-1 h-8 rounded-full flex-shrink-0"
                                            style={{ background: cat.color }}
                                        />
                                    </div>
                                    <span
                                        className="text-xs font-mono text-nr-faint glass
                                                     px-2 py-0.5 rounded-md"
                                    >
                                        {cat.posts_count}
                                    </span>
                                </div>

                                <h2
                                    className="font-display font-bold text-lg text-nr-text
                                               group-hover:text-white transition-colors"
                                    style={{ color: cat.color }}
                                >
                                    {cat.name}
                                </h2>
                                {cat.name_en && (
                                    <p className="text-xs text-nr-faint mt-0.5">{cat.name_en}</p>
                                )}
                                {cat.description && (
                                    <p className="text-sm text-nr-muted mt-2 line-clamp-2 leading-relaxed">
                                        {cat.description}
                                    </p>
                                )}

                                <div
                                    className="mt-4 text-xs text-nr-faint group-hover:text-nr-accent
                                                transition-colors flex items-center gap-1"
                                >
                                    Ver artículos
                                    <span className="group-hover:translate-x-1 transition-transform">
                                        →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {categories.length === 0 && (
                        <div className="text-center py-20 text-nr-faint">
                            Aún no hay categorías publicadas.
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </>
    )
}
