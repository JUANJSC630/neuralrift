import AdminLayout from '@/Components/Layout/AdminLayout'
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
        if (!confirm(`¿Eliminar a ${email}?`)) return
        router.delete(`/admin/newsletter/${id}`)
    }

    return (
        <AdminLayout title="Newsletter">
            <Head title="Newsletter — Admin" />

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {[
                    { label: 'Total', value: totals.all, color: 'text-nr-text' },
                    { label: 'Confirmados', value: totals.confirmed, color: 'text-nr-green' },
                    { label: 'Pendientes', value: totals.pending, color: 'text-nr-gold' },
                    { label: 'Español', value: totals.es, color: 'text-nr-accent' },
                    { label: 'Inglés', value: totals.en, color: 'text-nr-cyan' },
                ].map(stat => (
                    <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                        <div className={`text-2xl font-bold font-display ${stat.color} mb-1`}>
                            {stat.value.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-mono text-nr-faint uppercase tracking-wider">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="glass rounded-2xl p-4 mb-5 flex flex-wrap gap-3 items-center">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por email..."
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg
                                   px-3 py-2 text-sm text-nr-text placeholder-nr-faint
                                   outline-none focus:border-nr-accent/40"
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 glass rounded-lg text-xs text-nr-muted
                                       hover:text-nr-text transition-colors"
                    >
                        Buscar
                    </button>
                </form>

                <div className="flex gap-1 glass rounded-xl p-1">
                    {[
                        { label: 'Todos', value: '' },
                        { label: 'Confirmados', value: '1' },
                        { label: 'Pendientes', value: '0' },
                    ].map(opt => (
                        <button
                            key={opt.label}
                            onClick={() => applyFilter('confirmed', opt.value)}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-xs transition-all',
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
                        className="text-xs text-nr-faint hover:text-nr-red transition-colors"
                    >
                        ✕ Limpiar
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="glass rounded-2xl overflow-hidden">
                <div
                    className="flex items-center justify-between px-6 py-4
                                border-b border-white/[0.05]"
                >
                    <span className="text-xs text-nr-faint font-mono">
                        {subscribers.from}–{subscribers.to} de {subscribers.total} suscriptores
                    </span>
                    <button className="text-xs text-nr-accent hover:text-nr-accent/80 transition-colors">
                        ↓ Exportar CSV
                    </button>
                </div>

                <div className="divide-y divide-white/[0.04]">
                    {subscribers.data.length === 0 ? (
                        <div className="text-center py-12 text-nr-faint text-sm">
                            No se encontraron suscriptores.
                        </div>
                    ) : (
                        subscribers.data.map(sub => (
                            <div
                                key={sub.id}
                                className="flex items-center gap-4 px-6 py-3
                                        hover:bg-white/[0.02] transition-colors group"
                            >
                                {/* Avatar */}
                                <div
                                    className="w-8 h-8 rounded-full bg-gradient-to-br
                                            from-nr-accent/20 to-nr-cyan/20 flex items-center
                                            justify-center text-xs font-bold text-nr-accent
                                            flex-shrink-0"
                                >
                                    {sub.email[0].toUpperCase()}
                                </div>

                                {/* Email + name */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-nr-text font-medium truncate">
                                        {sub.email}
                                    </p>
                                    {sub.name && (
                                        <p className="text-xs text-nr-faint truncate">{sub.name}</p>
                                    )}
                                </div>

                                {/* Status badge */}
                                <span
                                    className={cn(
                                        'px-2.5 py-1 rounded-full text-[10px] font-semibold border flex-shrink-0',
                                        sub.confirmed
                                            ? 'bg-nr-green/15 text-nr-green border-nr-green/25'
                                            : 'bg-nr-gold/15 text-nr-gold border-nr-gold/25',
                                    )}
                                >
                                    {sub.confirmed ? 'Confirmado' : 'Pendiente'}
                                </span>

                                {/* Language */}
                                <span className="text-xs font-mono text-nr-faint flex-shrink-0 w-8 text-center">
                                    {sub.lang.toUpperCase()}
                                </span>

                                {/* Date */}
                                <span className="text-xs font-mono text-nr-faint flex-shrink-0 hidden md:block">
                                    {formatDate(sub.created_at)}
                                </span>

                                {/* Delete */}
                                <button
                                    onClick={() => deleteSubscriber(sub.id, sub.email)}
                                    className="text-xs text-nr-faint hover:text-nr-red transition-colors
                                           opacity-0 group-hover:opacity-100 flex-shrink-0"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {subscribers.last_page > 1 && (
                    <div
                        className="flex items-center justify-center gap-2 px-6 py-4
                                    border-t border-white/[0.05]"
                    >
                        {subscribers.links.map((link, i) => (
                            <button
                                key={i}
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={cn(
                                    'px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
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
    )
}
