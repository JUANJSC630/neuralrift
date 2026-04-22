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
                <div className="flex flex-col gap-3 md:flex-row">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar por título..."
                            className="glass flex-1 rounded-lg border border-white/[0.08] px-3 py-2 text-sm text-nr-text placeholder-nr-faint outline-none focus:border-nr-accent/50"
                        />
                        <button
                            type="submit"
                            className="glass rounded-lg px-4 py-2 text-sm font-medium text-nr-muted transition-colors hover:text-nr-text"
                        >
                            Buscar
                        </button>
                    </form>

                    <select
                        value={filters.status ?? ''}
                        onChange={e => applyFilter('status', e.target.value)}
                        className="glass rounded-lg border border-white/[0.08] bg-transparent px-3 py-2 text-sm text-nr-muted outline-none"
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
                        className="glass rounded-lg border border-white/[0.08] bg-transparent px-3 py-2 text-sm text-nr-muted outline-none"
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
                        className="whitespace-nowrap rounded-lg bg-gradient-to-r from-nr-accent to-[#6d58f0] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                    >
                        + Nuevo
                    </Link>
                </div>

                {/* Table */}
                <div className="glass overflow-hidden rounded-2xl">
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
                                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-nr-faint"
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
                                    className="group transition-colors hover:bg-white/[0.02]"
                                >
                                    {/* Cover thumbnail */}
                                    <td className="w-12 px-4 py-3">
                                        {post.cover_image ? (
                                            <img
                                                src={post.cover_image}
                                                alt=""
                                                className="h-10 w-10 rounded-lg object-cover opacity-80"
                                            />
                                        ) : (
                                            <div className="glass flex h-10 w-10 items-center justify-center rounded-lg text-lg text-nr-faint/30">
                                                ◈
                                            </div>
                                        )}
                                    </td>

                                    <td className="max-w-xs px-4 py-3">
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="line-clamp-1 font-medium text-nr-text transition-colors hover:text-nr-accent"
                                        >
                                            {post.title}
                                        </Link>
                                        <span className="font-mono text-[10px] text-nr-faint/60">
                                            {post.lang?.toUpperCase()}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[post.status] ?? ''}`}
                                        >
                                            {STATUS_LABELS[post.status] ?? post.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-xs text-nr-faint">
                                        {post.category?.name ?? '—'}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-nr-faint">
                                        {post.published_at ? formatDate(post.published_at) : '—'}
                                    </td>

                                    <td className="px-4 py-3 font-mono text-xs text-nr-faint">
                                        {post.views_count.toLocaleString()}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                            {post.status !== 'published' && (
                                                <button
                                                    onClick={() => handlePublish(post.id)}
                                                    className="glass rounded px-2 py-1 text-xs text-nr-green transition-colors hover:text-nr-green/80"
                                                >
                                                    Publicar
                                                </button>
                                            )}
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="glass rounded px-2 py-1 text-xs text-nr-faint transition-colors hover:text-nr-accent"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="glass rounded px-2 py-1 text-xs text-nr-faint transition-colors hover:text-nr-red"
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
                        <div className="py-16 text-center text-sm text-nr-faint">
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
                                        className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                                            link.active
                                                ? 'bg-nr-accent text-white'
                                                : 'glass text-nr-faint hover:text-nr-muted'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 text-xs text-nr-faint/30"
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
