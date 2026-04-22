import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '@/Components/Layout/AdminLayout'
import { formatDate } from '@/lib/utils'
import type { Post, Category, PaginatedData } from '@/types'

interface Filters {
    status?: string
    category?: string
    search?: string
}

interface Props {
    posts: PaginatedData<Post>
    categories: Category[]
    filters: Filters
}

const STATUS_COLORS: Record<string, string> = {
    published: 'text-nr-green bg-nr-green/10 border-nr-green/20',
    draft: 'text-nr-faint bg-white/5 border-white/10',
    scheduled: 'text-nr-gold bg-nr-gold/10 border-nr-gold/20',
    review: 'text-nr-cyan bg-nr-cyan/10 border-nr-cyan/20',
}

const STATUS_LABELS: Record<string, string> = {
    published: 'Publicado',
    draft: 'Borrador',
    scheduled: 'Programado',
    review: 'Revisión',
}

export default function PostsIndex({ posts, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '')

    const applyFilter = (key: string, value: string) => {
        router.get(
            '/admin/posts',
            { ...filters, [key]: value || undefined },
            { preserveState: true },
        )
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        applyFilter('search', search)
    }

    const handleDelete = (id: number) => {
        if (!confirm('¿Eliminar este artículo?')) return
        router.delete(`/admin/posts/${id}`)
    }

    const handlePublish = (id: number) => {
        router.post(`/admin/posts/${id}/publish`)
    }

    return (
        <AdminLayout title="Artículos">
            <Head title="Admin — Artículos" />

            <div className="space-y-5">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-3">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar por título..."
                            className="flex-1 px-3 py-2 glass rounded-lg text-sm text-nr-text
                                       placeholder-nr-faint border border-white/[0.08]
                                       focus:border-nr-accent/50 outline-none"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg text-sm font-medium glass
                                           text-nr-muted hover:text-nr-text transition-colors"
                        >
                            Buscar
                        </button>
                    </form>

                    <select
                        value={filters.status ?? ''}
                        onChange={e => applyFilter('status', e.target.value)}
                        className="px-3 py-2 glass rounded-lg text-sm text-nr-muted
                                       border border-white/[0.08] outline-none bg-transparent"
                    >
                        <option value="">Todos los estados</option>
                        <option value="published">Publicados</option>
                        <option value="draft">Borrador</option>
                        <option value="scheduled">Programados</option>
                        <option value="review">En revisión</option>
                    </select>

                    <select
                        value={filters.category ?? ''}
                        onChange={e => applyFilter('category', e.target.value)}
                        className="px-3 py-2 glass rounded-lg text-sm text-nr-muted
                                       border border-white/[0.08] outline-none bg-transparent"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <Link
                        href="/admin/posts/create"
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-white
                                     bg-gradient-to-r from-nr-accent to-[#6d58f0]
                                     hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                    >
                        + Nuevo
                    </Link>
                </div>

                {/* Table */}
                <div className="glass rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {[
                                    '',
                                    'Título',
                                    'Estado',
                                    'Categoría',
                                    'Publicado',
                                    'Vistas',
                                    '',
                                ].map((h, i) => (
                                    <th
                                        key={i}
                                        className="px-4 py-3 text-left text-xs font-semibold
                                                           text-nr-faint uppercase tracking-wider"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {posts.data.map(post => (
                                <tr
                                    key={post.id}
                                    className="hover:bg-white/[0.02] transition-colors group"
                                >
                                    {/* Cover thumbnail */}
                                    <td className="px-4 py-3 w-12">
                                        {post.cover_image ? (
                                            <img
                                                src={post.cover_image}
                                                alt=""
                                                className="w-10 h-10 rounded-lg object-cover opacity-80"
                                            />
                                        ) : (
                                            <div
                                                className="w-10 h-10 rounded-lg glass flex items-center
                                                            justify-center text-nr-faint/30 text-lg"
                                            >
                                                ◈
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 max-w-xs">
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="text-nr-text hover:text-nr-accent transition-colors
                                                         font-medium line-clamp-1"
                                        >
                                            {post.title}
                                        </Link>
                                        <span className="text-[10px] font-mono text-nr-faint/60">
                                            {post.lang?.toUpperCase()}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                                                          border ${STATUS_COLORS[post.status] ?? ''}`}
                                        >
                                            {STATUS_LABELS[post.status] ?? post.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-xs text-nr-faint">
                                        {post.category?.name ?? '—'}
                                    </td>

                                    <td className="px-4 py-3 text-xs text-nr-faint font-mono whitespace-nowrap">
                                        {post.published_at ? formatDate(post.published_at) : '—'}
                                    </td>

                                    <td className="px-4 py-3 text-xs text-nr-faint font-mono">
                                        {post.views_count.toLocaleString()}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div
                                            className="flex items-center gap-1.5 justify-end
                                                        opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            {post.status !== 'published' && (
                                                <button
                                                    onClick={() => handlePublish(post.id)}
                                                    className="text-xs text-nr-green hover:text-nr-green/80
                                                                   transition-colors px-2 py-1 glass rounded"
                                                >
                                                    Publicar
                                                </button>
                                            )}
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="text-xs text-nr-faint hover:text-nr-accent
                                                             transition-colors px-2 py-1 glass rounded"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="text-xs text-nr-faint hover:text-nr-red
                                                               transition-colors px-2 py-1 glass rounded"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {posts.data.length === 0 && (
                        <div className="text-center py-16 text-nr-faint text-sm">
                            No hay artículos que coincidan.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-nr-faint">
                            {posts.from}–{posts.to} de {posts.total} artículos
                        </span>
                        <div className="flex gap-2">
                            {posts.links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors
                                              ${
                                                  link.active
                                                      ? 'bg-nr-accent text-white'
                                                      : 'glass text-nr-faint hover:text-nr-muted'
                                              }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 text-nr-faint/30 text-xs"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
