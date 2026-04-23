import { Head, Link } from '@inertiajs/react'
import Navbar from '@/Components/Layout/Navbar'
import Footer from '@/Components/Layout/Footer'
import { SITE } from '@/lib/constants'
import { useLocale } from '@/hooks/useLocale'
import type { Category } from '@/types'

interface Props {
    categories: (Category & { posts_count: number })[]
}

export default function CategoryIndex({ categories }: Props) {
    const { locale, t } = useLocale()
    const isEn = locale === 'en'

    return (
        <>
            <Head title={`${t('category.title')} — ${SITE.name}`}>
                <meta name="description" content={t('category.meta_description')} />
            </Head>

            <Navbar />

            <main className="min-h-screen bg-nr-bg pt-[70px]">
                <section className="mx-auto max-w-5xl px-6 py-20 md:px-12">
                    {/* Header */}
                    <div className="mb-14">
                        <span className="font-mono text-xs uppercase tracking-widest text-nr-faint">
                            {t('category.explore_label')}
                        </span>
                        <h1 className="text-gradient mt-2 font-display text-4xl font-black md:text-5xl">
                            {t('category.title')}
                        </h1>
                        <p className="mt-3 max-w-lg text-nr-muted">{t('category.subtitle')}</p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map(cat => {
                            const catName = isEn && cat.name_en ? cat.name_en : cat.name
                            const catDesc =
                                isEn && cat.description_en ? cat.description_en : cat.description

                            return (
                                <Link
                                    key={cat.id}
                                    href={
                                        isEn ? `/en/category/${cat.slug}` : `/categoria/${cat.slug}`
                                    }
                                    className="glass group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14]"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            {cat.icon ? (
                                                <span className="text-2xl">{cat.icon}</span>
                                            ) : (
                                                <div
                                                    className="h-8 w-8 rounded-lg"
                                                    style={{ background: cat.color + '33' }}
                                                />
                                            )}
                                            <div
                                                className="h-8 w-1 flex-shrink-0 rounded-full"
                                                style={{ background: cat.color }}
                                            />
                                        </div>
                                        <span className="glass rounded-md px-2 py-0.5 font-mono text-xs text-nr-faint">
                                            {cat.posts_count}
                                        </span>
                                    </div>

                                    <h2
                                        className="font-display text-lg font-bold text-nr-text transition-colors group-hover:text-white"
                                        style={{ color: cat.color }}
                                    >
                                        {catName}
                                    </h2>
                                    {isEn && cat.name_en && (
                                        <p className="mt-0.5 text-xs text-nr-faint">{cat.name}</p>
                                    )}
                                    {!isEn && cat.name_en && (
                                        <p className="mt-0.5 text-xs text-nr-faint">
                                            {cat.name_en}
                                        </p>
                                    )}
                                    {catDesc && (
                                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-nr-muted">
                                            {catDesc}
                                        </p>
                                    )}

                                    <div className="mt-4 flex items-center gap-1 text-xs text-nr-faint transition-colors group-hover:text-nr-accent">
                                        {t('category.view_articles')}
                                        <span className="transition-transform group-hover:translate-x-1">
                                            →
                                        </span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {categories.length === 0 && (
                        <div className="py-20 text-center text-nr-faint">{t('category.empty')}</div>
                    )}
                </section>
            </main>

            <Footer />
        </>
    )
}
