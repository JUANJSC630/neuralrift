import AdminLayout from '@/Components/Layout/AdminLayout'
import { Head, router, Link } from '@inertiajs/react'
import { useState } from 'react'
import { formatDate, cn } from '@/lib/utils'
import ConfirmModal from '@/Components/ConfirmModal'
import type { PaginatedData } from '@/types'

interface AdminComment {
    id: number
    author_name: string
    author_email: string
    body: string
    status: 'pending' | 'approved' | 'spam'
    depth: number
    created_at: string
    ip_address: string | null
    post: { id: number; title: string; slug: string } | null
    parent: { id: number; author_name: string } | null
}

interface Counts {
    pending: number
    approved: number
    spam: number
}

interface Props {
    comments: PaginatedData<AdminComment>
    filters: { status?: string; search?: string }
    counts: Counts
}

const STATUS_STYLES = {
    pending: 'border-nr-gold/30 bg-nr-gold/10 text-nr-gold',
    approved: 'border-nr-green/30 bg-nr-green/10 text-nr-green',
    spam: 'border-nr-red/30 bg-nr-red/10 text-nr-red',
} as const

const STATUS_LABELS = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    spam: 'Spam',
} as const

export default function Comments({ comments, filters, counts }: Props) {
    const [search, setSearch] = useState(filters.search ?? '')
    const [deleteTarget, setDeleteTarget] = useState<AdminComment | null>(null)

    const applyFilter = (key: string, value: string) => {
        router.get(
            '/admin/comments',
            { ...filters, [key]: value || undefined },
            { preserveState: true, replace: true },
        )
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        applyFilter('search', search)
    }

    const approve = (id: number) => {
        router.post(`/admin/comments/${id}/approve`, {}, { preserveScroll: true })
    }

    const markSpam = (id: number) => {
        router.post(`/admin/comments/${id}/spam`, {}, { preserveScroll: true })
    }

    const confirmDelete = () => {
        if (!deleteTarget) return
        router.post(`/admin/comments/${deleteTarget.id}`, { _method: 'DELETE' }, { preserveScroll: true })
        setDeleteTarget(null)
    }

    const total = counts.pending + counts.approved + counts.spam

    return (
        <AdminLayout title="Comentarios">
            <Head title="Comentarios — Admin" />

            {/* KPIs */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                    { label: 'Total', value: total, color: 'text-nr-text', filter: '' },
                    {
                        label: 'Pendientes',
                        value: counts.pending,
                        color: 'text-nr-gold',
                        filter: 'pending',
                    },
                    {
                        label: 'Aprobados',
                        value: counts.approved,
                        color: 'text-nr-green',
                        filter: 'approved',
                    },
                    { label: 'Spam', value: counts.spam, color: 'text-nr-red', filter: 'spam' },
                ].map(stat => (
                    <button
                        key={stat.label}
                        onClick={() => applyFilter('status', stat.filter)}
                        className={cn(
                            'glass rounded-2xl p-4 text-center transition-all hover:border-white/20',
                            filters.status === stat.filter && 'ring-1 ring-nr-accent/30',
                        )}
                    >
                        <div className={`font-display text-2xl font-bold ${stat.color} mb-1`}>
                            {stat.value}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                            {stat.label}
                        </div>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="glass mb-5 rounded-2xl p-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por nombre, email o contenido..."
                        className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-nr-text placeholder-nr-faint outline-none focus:border-nr-accent/40"
                    />
                    <button
                        type="submit"
                        className="glass rounded-lg px-3 py-2 text-xs text-nr-muted transition-colors hover:text-nr-text"
                    >
                        Buscar
                    </button>
                </form>
            </div>

            {/* Comments list */}
            <div className="space-y-3">
                {comments.data.length === 0 && (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-sm text-nr-faint">No hay comentarios.</p>
                    </div>
                )}

                {comments.data.map(comment => (
                    <div key={comment.id} className="glass group rounded-2xl p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                {/* Author + Status */}
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-semibold text-nr-text">
                                        {comment.author_name}
                                    </span>
                                    <span className="font-mono text-[11px] text-nr-faint">
                                        {comment.author_email}
                                    </span>
                                    <span
                                        className={cn(
                                            'rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase',
                                            STATUS_STYLES[comment.status],
                                        )}
                                    >
                                        {STATUS_LABELS[comment.status]}
                                    </span>
                                    {comment.parent && (
                                        <span className="text-[11px] text-nr-faint">
                                            ↩ respuesta a{' '}
                                            <span className="text-nr-muted">
                                                {comment.parent.author_name}
                                            </span>
                                        </span>
                                    )}
                                </div>

                                {/* Body */}
                                <p className="mb-2 whitespace-pre-line text-sm text-nr-muted">
                                    {comment.body}
                                </p>

                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-3 text-[11px] text-nr-faint">
                                    <span>{formatDate(comment.created_at)}</span>
                                    {comment.post && (
                                        <Link
                                            href={`/blog/${comment.post.slug}`}
                                            className="text-nr-accent hover:underline"
                                            target="_blank"
                                        >
                                            {comment.post.title}
                                        </Link>
                                    )}
                                    {comment.ip_address && <span>IP: {comment.ip_address}</span>}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex shrink-0 gap-1.5">
                                {comment.status !== 'approved' && (
                                    <button
                                        onClick={() => approve(comment.id)}
                                        className="rounded-lg bg-nr-green/10 px-3 py-1.5 text-xs font-medium text-nr-green transition-colors hover:bg-nr-green/20"
                                        title="Aprobar"
                                    >
                                        ✓ Aprobar
                                    </button>
                                )}
                                {comment.status !== 'spam' && (
                                    <button
                                        onClick={() => markSpam(comment.id)}
                                        className="rounded-lg bg-nr-gold/10 px-3 py-1.5 text-xs font-medium text-nr-gold transition-colors hover:bg-nr-gold/20"
                                        title="Spam"
                                    >
                                        ⚠ Spam
                                    </button>
                                )}
                                <button
                                    onClick={() => setDeleteTarget(comment)}
                                    className="rounded-lg bg-nr-red/10 px-3 py-1.5 text-xs font-medium text-nr-red transition-colors hover:bg-nr-red/20"
                                    title="Eliminar"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {comments.last_page > 1 && (
                <div className="mt-6 flex items-center justify-center gap-1">
                    {comments.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() =>
                                link.url && router.get(link.url, {}, { preserveState: true })
                            }
                            className={cn(
                                'rounded-lg px-3 py-1.5 text-xs transition-colors',
                                link.active
                                    ? 'bg-nr-accent text-white'
                                    : 'text-nr-faint hover:text-nr-muted',
                                !link.url && 'cursor-not-allowed opacity-30',
                            )}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            {/* Delete confirm modal */}
            <ConfirmModal
                show={!!deleteTarget}
                title="Eliminar comentario"
                message={`¿Eliminar el comentario de "${deleteTarget?.author_name}"? Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </AdminLayout>
    )
}
