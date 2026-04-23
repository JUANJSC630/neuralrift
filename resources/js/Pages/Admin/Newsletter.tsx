import AdminLayout from '@/Components/Layout/AdminLayout'
import ConfirmModal from '@/Components/ConfirmModal'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { formatDate, cn } from '@/lib/utils'
import type { PaginatedData, Subscriber } from '@/types'

interface Totals {
    all: number
    confirmed: number
    pending: number
    es: number
    en: number
}

interface Props {
    subscribers: PaginatedData<Subscriber>
    totals: Totals
    filters: { confirmed?: string; search?: string }
}

export default function Newsletter({ subscribers, totals, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '')
    const [pendingDelete, setPendingDelete] = useState<{ id: number; email: string } | null>(null)

    const applyFilter = (key: string, value: string) => {
        router.get(
            '/admin/newsletter',
            {
                ...filters,
                [key]: value || undefined,
            },
            { preserveState: true, replace: true },
        )
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        applyFilter('search', search)
    }

    const deleteSubscriber = (id: number, email: string) => {
        setPendingDelete({ id, email })
    }

    return (
        <>
        <AdminLayout title="Newsletter">
            <Head title="Newsletter — Admin" />

            {/* KPIs */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
                {[
                    { label: 'Total', value: totals.all, color: 'text-nr-text' },
                    { label: 'Confirmados', value: totals.confirmed, color: 'text-nr-green' },
                    { label: 'Pendientes', value: totals.pending, color: 'text-nr-gold' },
                    { label: 'Español', value: totals.es, color: 'text-nr-accent' },
                    { label: 'Inglés', value: totals.en, color: 'text-nr-cyan' },
                ].map(stat => (
                    <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                        <div className={`font-display text-2xl font-bold ${stat.color} mb-1`}>
                            {stat.value.toLocaleString()}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="glass mb-5 flex flex-wrap items-center gap-3 rounded-2xl p-4">
                <form onSubmit={handleSearch} className="flex min-w-[200px] flex-1 gap-2">
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por email..."
                        className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-nr-text placeholder-nr-faint outline-none focus:border-nr-accent/40"
                    />
                    <button
                        type="submit"
                        className="glass rounded-lg px-3 py-2 text-xs text-nr-muted transition-colors hover:text-nr-text"
                    >
                        Buscar
                    </button>
                </form>

                <div className="glass flex gap-1 rounded-xl p-1">
                    {[
                        { label: 'Todos', value: '' },
                        { label: 'Confirmados', value: '1' },
                        { label: 'Pendientes', value: '0' },
                    ].map(opt => (
                        <button
                            key={opt.label}
                            onClick={() => applyFilter('confirmed', opt.value)}
                            className={cn(
                                'rounded-lg px-3 py-1.5 text-xs transition-all',
                                (filters.confirmed ?? '') === opt.value
                                    ? 'bg-nr-accent text-white'
                                    : 'text-nr-faint hover:text-nr-muted',
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {(filters.confirmed !== undefined || filters.search) && (
                    <button
                        onClick={() => router.get('/admin/newsletter')}
                        className="text-xs text-nr-faint transition-colors hover:text-nr-red"
                    >
                        ✕ Limpiar
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="glass overflow-hidden rounded-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.05] px-6 py-4">
                    <span className="font-mono text-xs text-nr-faint">
                        {subscribers.from}–{subscribers.to} de {subscribers.total} suscriptores
                    </span>
                    <a
                        href="/admin/newsletter/export"
                        className="text-xs text-nr-accent transition-colors hover:text-nr-accent/80"
                    >
                        ↓ Exportar CSV
                    </a>
                </div>

                <div className="divide-y divide-white/[0.04]">
                    {subscribers.data.length === 0 ? (
                        <div className="py-12 text-center text-sm text-nr-faint">
                            No se encontraron suscriptores.
                        </div>
                    ) : (
                        subscribers.data.map(sub => (
                            <div
                                key={sub.id}
                                className="group flex items-center gap-4 px-6 py-3 transition-colors hover:bg-white/[0.02]"
                            >
                                {/* Avatar */}
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nr-accent/20 to-nr-cyan/20 text-xs font-bold text-nr-accent">
                                    {sub.email[0].toUpperCase()}
                                </div>

                                {/* Email + name */}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-nr-text">
                                        {sub.email}
                                    </p>
                                    {sub.name && (
                                        <p className="truncate text-xs text-nr-faint">{sub.name}</p>
                                    )}
                                </div>

                                {/* Status badge */}
                                <span
                                    className={cn(
                                        'flex-shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold',
                                        sub.confirmed
                                            ? 'border-nr-green/25 bg-nr-green/15 text-nr-green'
                                            : 'border-nr-gold/25 bg-nr-gold/15 text-nr-gold',
                                    )}
                                >
                                    {sub.confirmed ? 'Confirmado' : 'Pendiente'}
                                </span>

                                {/* Language */}
                                <span className="w-8 flex-shrink-0 text-center font-mono text-xs text-nr-faint">
                                    {sub.lang.toUpperCase()}
                                </span>

                                {/* Date */}
                                <span className="hidden flex-shrink-0 font-mono text-xs text-nr-faint md:block">
                                    {formatDate(sub.created_at)}
                                </span>

                                {/* Delete */}
                                <button
                                    onClick={() => deleteSubscriber(sub.id, sub.email)}
                                    className="flex-shrink-0 text-xs text-nr-faint opacity-0 transition-colors hover:text-nr-red group-hover:opacity-100"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {subscribers.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 border-t border-white/[0.05] px-6 py-4">
                        {subscribers.links.map((link, i) => (
                            <button
                                key={i}
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={cn(
                                    'rounded-lg px-3 py-1.5 font-mono text-xs transition-all',
                                    link.active
                                        ? 'bg-nr-accent text-white'
                                        : 'text-nr-faint hover:text-nr-muted disabled:opacity-30',
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>

            <ConfirmModal
                show={pendingDelete !== null}
                title="Eliminar suscriptor"
                message={`¿Eliminar a ${pendingDelete?.email}?`}
                confirmLabel="Eliminar"
                variant="danger"
                onConfirm={() => {
                    if (pendingDelete) router.delete(`/admin/newsletter/${pendingDelete.id}`)
                    setPendingDelete(null)
                }}
                onCancel={() => setPendingDelete(null)}
            />
        </>
    )
}
