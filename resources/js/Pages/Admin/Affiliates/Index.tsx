import AdminLayout from '@/Components/Layout/AdminLayout'
import AdminBrowse from '@/Components/Admin/AdminBrowse'
import ConfirmModal from '@/Components/ConfirmModal'
import { Head, useForm, router } from '@inertiajs/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { RequestPayload } from '@inertiajs/core'
import type { Affiliate, PaginatedData } from '@/types'

interface Totals {
    all: number
    active: number
    inactive: number
    featured: number
}

interface Props {
    affiliates: PaginatedData<Affiliate & { clicks_count: number }>
    filters: { search?: string; status?: string; sort?: string }
    totals: Totals
}

const inputCls = `w-full bg-nr-bg border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-nr-text outline-none focus:border-nr-accent/40 transition-colors placeholder-nr-faint/40`

export default function AffiliatesIndex({ affiliates, filters, totals }: Props) {
    const [editing, setEditing] = useState<Affiliate | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [pendingDelete, setPendingDelete] = useState<Affiliate | null>(null)

    const { data, setData, post, put, reset, processing } = useForm({
        name: '',
        url: '',
        website: '',
        description: '',
        commission: '',
        commission_type: 'recurring' as 'recurring' | 'one_time' | 'percentage',
        commission_value: 0,
        cookie_duration: '',
        rating: 5.0,
        category: '',
        badge: '',
        active: true,
        featured: false,
        order: 0,
    })

    const startEdit = (aff: Affiliate) => {
        setEditing(aff)
        setData({
            name: aff.name,
            url: aff.url,
            website: aff.website ?? '',
            description: aff.description ?? '',
            commission: aff.commission ?? '',
            commission_type: aff.commission_type,
            commission_value: aff.commission_value ?? 0,
            cookie_duration: aff.cookie_duration ?? '',
            rating: aff.rating ?? 5.0,
            category: aff.category ?? '',
            badge: aff.badge ?? '',
            active: aff.active,
            featured: aff.featured,
            order: aff.order ?? 0,
        })
        setShowForm(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editing) {
            put(`/admin/affiliates/${editing.id}`, {
                onSuccess: () => {
                    setEditing(null)
                    setShowForm(false)
                    reset()
                },
            })
        } else {
            post('/admin/affiliates', {
                onSuccess: () => {
                    setShowForm(false)
                    reset()
                },
            })
        }
    }

    const toggleActive = (aff: Affiliate) => {
        router.post(`/admin/affiliates/${aff.id}`, {
            ...aff,
            active: !aff.active,
            _method: 'PUT',
        } as RequestPayload)
    }

    return (
        <>
            <AdminLayout title="Afiliados">
                <Head title="Afiliados — Admin" />

                <AdminBrowse
                    data={affiliates}
                    filters={filters}
                    baseUrl="/admin/affiliates"
                    searchPlaceholder="Buscar por nombre, categoría..."
                    emptyMessage="No hay afiliados que coincidan."
                    kpis={[
                        { label: 'Total', value: totals.all, color: 'text-nr-text' },
                        { label: 'Activos', value: totals.active, color: 'text-nr-green' },
                        { label: 'Inactivos', value: totals.inactive, color: 'text-nr-faint' },
                        { label: 'Destacados', value: totals.featured, color: 'text-nr-gold' },
                    ]}
                    filterOptions={[
                        { value: '', label: 'Todos' },
                        { value: 'active', label: 'Activos' },
                        { value: 'inactive', label: 'Inactivos' },
                        { value: 'featured', label: 'Destacados' },
                    ]}
                    sortOptions={[
                        { value: '', label: 'Orden por defecto' },
                        { value: 'name_asc', label: 'Nombre A → Z' },
                        { value: 'name_desc', label: 'Nombre Z → A' },
                        { value: 'date_desc', label: 'Más reciente' },
                        { value: 'date_asc', label: 'Más antiguo' },
                    ]}
                    actions={
                        <button
                            onClick={() => {
                                setEditing(null)
                                reset()
                                setShowForm(true)
                            }}
                            className="whitespace-nowrap rounded-lg bg-gradient-to-r from-nr-accent to-nr-accent-dark px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                        >
                            + Nuevo afiliado
                        </button>
                    }
                    renderItem={aff => (
                        <div
                            className={cn(
                                'glass group rounded-2xl p-5 transition-all',
                                !aff.active && 'opacity-50',
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-nr-accent/15 to-nr-cyan/15 text-lg font-bold text-nr-accent">
                                    {aff.name[0]}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-nr-text">{aff.name}</h3>
                                        {aff.featured && (
                                            <span className="rounded-full border border-nr-gold/25 bg-nr-gold/15 px-2 py-0.5 text-[10px] font-semibold text-nr-gold">
                                                Destacado
                                            </span>
                                        )}
                                        {aff.badge && (
                                            <span className="text-[10px] text-nr-faint">
                                                · {aff.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mb-2 line-clamp-1 text-xs text-nr-muted">
                                        {aff.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <span className="font-mono text-xs text-nr-green">
                                            ✓ {aff.commission}
                                        </span>
                                        {aff.cookie_duration && (
                                            <span className="font-mono text-xs text-nr-faint">
                                                🍪 {aff.cookie_duration}
                                            </span>
                                        )}
                                        <span className="font-mono text-xs text-nr-faint">
                                            {aff.clicks_count.toLocaleString()} clics
                                        </span>
                                        {aff.category && (
                                            <span className="text-xs text-nr-faint">
                                                {aff.category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-shrink-0 items-center gap-2">
                                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            onClick={() => startEdit(aff)}
                                            className="rounded px-2 py-1 text-xs text-nr-muted transition-colors hover:bg-white/[0.06] hover:text-nr-text"
                                        >
                                            Editar
                                        </button>
                                        <a
                                            href={aff.url}
                                            target="_blank"
                                            rel="noopener"
                                            className="rounded px-2 py-1 text-xs text-nr-cyan transition-colors hover:bg-nr-cyan/10"
                                        >
                                            Probar ↗
                                        </a>
                                        <button
                                            onClick={() => setPendingDelete(aff)}
                                            className="rounded px-2 py-1 text-xs text-nr-faint transition-colors hover:bg-nr-red/10 hover:text-nr-red"
                                        >
                                            ✕
                                        </button>
                                        <span className="h-4 w-px bg-white/10" />
                                    </div>

                                    <button
                                        onClick={() => toggleActive(aff)}
                                        title={aff.active ? 'Desactivar' : 'Activar'}
                                        className={cn(
                                            'relative h-5 w-9 flex-shrink-0 overflow-hidden rounded-full transition-colors duration-200',
                                            aff.active ? 'bg-nr-green' : 'bg-white/20',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                                                aff.active ? 'translate-x-4' : 'translate-x-0',
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    sidebar={
                        showForm ? (
                            <div className="glass sticky top-6 max-h-[85vh] overflow-y-auto rounded-2xl p-6">
                                <div className="mb-5 flex items-center justify-between">
                                    <h3 className="font-semibold text-nr-text">
                                        {editing ? 'Editar afiliado' : 'Nuevo afiliado'}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowForm(false)
                                            setEditing(null)
                                            reset()
                                        }}
                                        className="text-nr-faint transition-colors hover:text-nr-text"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                            Nombre *
                                        </label>
                                        <input
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className={inputCls}
                                            required
                                            placeholder="Writesonic"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                            Link de afiliado *
                                        </label>
                                        <input
                                            value={data.url}
                                            type="url"
                                            onChange={e => setData('url', e.target.value)}
                                            className={inputCls}
                                            required
                                            placeholder="https://writesonic.com?ref=..."
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                            Sitio web oficial
                                        </label>
                                        <input
                                            value={data.website}
                                            type="url"
                                            onChange={e => setData('website', e.target.value)}
                                            className={inputCls}
                                            placeholder="https://writesonic.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            rows={2}
                                            className={cn(inputCls, 'resize-none text-xs')}
                                            placeholder="¿Para qué sirve?"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                                Comisión
                                            </label>
                                            <input
                                                value={data.commission}
                                                onChange={e =>
                                                    setData('commission', e.target.value)
                                                }
                                                className={inputCls}
                                                placeholder="30% recurrente"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                                Cookie
                                            </label>
                                            <input
                                                value={data.cookie_duration}
                                                onChange={e =>
                                                    setData('cookie_duration', e.target.value)
                                                }
                                                className={inputCls}
                                                placeholder="30 días"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                                Categoría
                                            </label>
                                            <input
                                                value={data.category}
                                                onChange={e => setData('category', e.target.value)}
                                                className={inputCls}
                                                placeholder="SEO IA"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                                Rating
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={5}
                                                step={0.1}
                                                value={data.rating}
                                                onChange={e =>
                                                    setData('rating', parseFloat(e.target.value))
                                                }
                                                className={inputCls}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                            Badge
                                        </label>
                                        <input
                                            value={data.badge}
                                            onChange={e => setData('badge', e.target.value)}
                                            className={inputCls}
                                            placeholder="Lo uso diariamente"
                                        />
                                    </div>

                                    <div className="space-y-2 pt-1">
                                        {(
                                            [
                                                { key: 'active', label: 'Activo' },
                                                { key: 'featured', label: 'Destacado en home' },
                                            ] as const
                                        ).map(({ key, label }) => (
                                            <label
                                                key={key}
                                                className="flex cursor-pointer items-center justify-between"
                                            >
                                                <span className="text-xs text-nr-muted">
                                                    {label}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setData(key, !data[key])}
                                                    className={cn(
                                                        'relative h-5 w-9 overflow-hidden rounded-full transition-colors duration-200',
                                                        data[key] ? 'bg-nr-accent' : 'bg-white/20',
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                                                            data[key]
                                                                ? 'translate-x-4'
                                                                : 'translate-x-0',
                                                        )}
                                                    />
                                                </button>
                                            </label>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-xl bg-gradient-to-r from-nr-accent to-nr-accent-dark py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Guardando...'
                                            : editing
                                              ? 'Actualizar'
                                              : 'Crear afiliado'}
                                    </button>
                                </form>
                            </div>
                        ) : undefined
                    }
                />
            </AdminLayout>

            <ConfirmModal
                show={pendingDelete !== null}
                title="Eliminar afiliado"
                message={`¿Eliminar "${pendingDelete?.name}"?`}
                confirmLabel="Eliminar"
                variant="danger"
                onConfirm={() => {
                    if (pendingDelete)
                        router.post(`/admin/affiliates/${pendingDelete.id}`, { _method: 'DELETE' })
                    setPendingDelete(null)
                }}
                onCancel={() => setPendingDelete(null)}
            />
        </>
    )
}
