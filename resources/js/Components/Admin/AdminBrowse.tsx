import { Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { PaginatedData } from '@/types'

export interface KpiStat {
    label: string
    value: number
    color: string
}

export interface FilterOption {
    value: string
    label: string
}

interface Props<T> {
    /** Paginated data from Inertia */
    data: PaginatedData<T>
    /** Current active filters (passed from the page's props) */
    filters: Record<string, string | undefined>
    /** Base URL for filter/search GET requests */
    baseUrl: string
    /** Render each card item */
    renderItem: (item: T) => React.ReactNode
    /** Optional KPI stats row */
    kpis?: KpiStat[]
    /** Filter button group options (uses 'status' key by default) */
    filterOptions?: FilterOption[]
    /** Which filters key the button group controls */
    filterKey?: string
    /** Sort select options */
    sortOptions?: FilterOption[]
    /** Placeholder for search input */
    searchPlaceholder?: string
    /** Empty-state message */
    emptyMessage?: string
    /** Extra content in the action area (e.g. "+ Nuevo" button) */
    actions?: React.ReactNode
    /** Optional slide-in sidebar (form panel, etc.) */
    sidebar?: React.ReactNode
}

export default function AdminBrowse<T extends { id: number | string }>({
    data,
    filters,
    baseUrl,
    renderItem,
    kpis,
    filterOptions,
    filterKey = 'status',
    sortOptions,
    searchPlaceholder = 'Buscar...',
    emptyMessage = 'No hay resultados.',
    actions,
    sidebar,
}: Props<T>) {
    const [searchInput, setSearchInput] = useState(filters.search ?? '')

    const applyFilter = (key: string, value: string) => {
        router.get(
            baseUrl,
            { ...filters, [key]: value || undefined },
            { preserveState: true, replace: true },
        )
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        applyFilter('search', searchInput)
    }

    const hasActiveFilters = !!(filters.search || filters[filterKey] || filters.sort)

    return (
        <div className="flex gap-6">
            <div className="min-w-0 flex-1 space-y-5">
                {/* KPIs */}
                {kpis && kpis.length > 0 && (
                    <div
                        className={cn(
                            'grid gap-3',
                            kpis.length <= 2 && 'grid-cols-2',
                            kpis.length === 3 && 'grid-cols-3',
                            kpis.length >= 4 && 'grid-cols-2 sm:grid-cols-4',
                        )}
                    >
                        {kpis.map(stat => (
                            <div key={stat.label} className="glass rounded-xl p-3 text-center">
                                <p className={`font-display text-xl font-bold ${stat.color}`}>
                                    {stat.value.toLocaleString()}
                                </p>
                                <p className="font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex min-w-[200px] flex-1 gap-2">
                        <input
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-nr-text placeholder-nr-faint outline-none focus:border-nr-accent/40"
                        />
                        <button
                            type="submit"
                            className="glass rounded-lg px-3 py-2 text-xs text-nr-muted transition-colors hover:text-nr-text"
                        >
                            Buscar
                        </button>
                    </form>

                    {/* Filter buttons */}
                    {filterOptions && filterOptions.length > 0 && (
                        <div className="glass flex gap-1 rounded-xl p-1">
                            {filterOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => applyFilter(filterKey, opt.value)}
                                    className={cn(
                                        'rounded-lg px-3 py-1.5 text-xs transition-all',
                                        (filters[filterKey] ?? '') === opt.value
                                            ? 'bg-nr-accent text-white'
                                            : 'text-nr-faint hover:text-nr-muted',
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Sort */}
                    {sortOptions && sortOptions.length > 0 && (
                        <select
                            value={filters.sort ?? ''}
                            onChange={e => applyFilter('sort', e.target.value)}
                            className="glass rounded-xl px-3 py-2 text-xs text-nr-muted outline-none focus:border-nr-accent/40 transition-colors cursor-pointer"
                        >
                            {sortOptions.map(opt => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                    className="bg-nr-surface text-nr-text"
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Clear */}
                    {hasActiveFilters && (
                        <button
                            onClick={() => {
                                setSearchInput('')
                                router.get(baseUrl)
                            }}
                            className="text-xs text-nr-faint transition-colors hover:text-nr-red"
                        >
                            ✕ Limpiar
                        </button>
                    )}

                    {/* Actions slot */}
                    {actions && <div className="ml-auto">{actions}</div>}
                </div>

                {/* Count */}
                {data.total > 0 && (
                    <p className="text-xs text-nr-faint">
                        {data.from}–{data.to} de {data.total} resultados
                    </p>
                )}

                {/* Items */}
                <div className="space-y-3">
                    {data.data.length === 0 ? (
                        <div className="glass rounded-2xl p-12 text-center text-sm text-nr-faint">
                            {emptyMessage}
                        </div>
                    ) : (
                        data.data.map(item => <div key={item.id}>{renderItem(item)}</div>)
                    )}
                </div>

                {/* Pagination */}
                {data.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {data.links.map((link, i) =>
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={cn(
                                        'rounded-lg px-3 py-1.5 font-mono text-xs transition-all',
                                        link.active
                                            ? 'bg-nr-accent text-white'
                                            : 'glass text-nr-faint hover:text-nr-muted',
                                    )}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    className="px-3 py-1.5 font-mono text-xs text-nr-faint/30"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ),
                        )}
                    </div>
                )}
            </div>

            {/* Sidebar slot */}
            {sidebar && <div className="w-[340px] flex-shrink-0">{sidebar}</div>}
        </div>
    )
}
