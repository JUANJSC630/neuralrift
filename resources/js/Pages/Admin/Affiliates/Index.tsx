import AdminLayout from '@/Components/Layout/AdminLayout'
import { Head, useForm, router } from '@inertiajs/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Affiliate } from '@/types'

interface Props {
    affiliates: (Affiliate & { clicks_count: number })[]
}

const inputCls = `w-full bg-nr-bg border border-white/[0.08] rounded-lg px-3 py-2
                  text-sm text-nr-text outline-none focus:border-nr-accent/40
                  transition-colors placeholder-nr-faint/40`

export default function AffiliatesIndex({ affiliates }: Props) {
    const [editing, setEditing] = useState<Affiliate | null>(null)
    const [showForm, setShowForm] = useState(false)

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
        router.put(`/admin/affiliates/${aff.id}`, { ...aff, active: !aff.active } as any)
    }

    const deleteAffiliate = (aff: Affiliate) => {
        if (!confirm(`¿Eliminar "${aff.name}"?`)) return
        router.delete(`/admin/affiliates/${aff.id}`)
    }

    const totalClicks = affiliates.reduce((s, a) => s + a.clicks_count, 0)

    return (
        <AdminLayout title="Afiliados">
            <Head title="Afiliados — Admin" />

            <div className="flex gap-6">
                {/* List */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="font-display text-xl font-bold text-nr-text">
                                Programas de afiliados
                            </h2>
                            <p className="text-xs text-nr-faint mt-0.5">
                                {affiliates.filter(a => a.active).length} activos ·{' '}
                                {totalClicks.toLocaleString()} clics totales
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setEditing(null)
                                reset()
                                setShowForm(true)
                            }}
                            className="px-4 py-2 rounded-lg text-sm font-semibold text-white
                                       bg-gradient-to-r from-nr-accent to-[#6d58f0]
                                       glow-accent hover:-translate-y-0.5 transition-all"
                        >
                            + Nuevo afiliado
                        </button>
                    </div>

                    <div className="space-y-3">
                        {affiliates.map(aff => (
                            <div
                                key={aff.id}
                                className={cn(
                                    'glass rounded-2xl p-5 transition-all group',
                                    !aff.active && 'opacity-50',
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Logo placeholder */}
                                    <div
                                        className="w-11 h-11 rounded-xl bg-gradient-to-br
                                                    from-nr-accent/15 to-nr-cyan/15 flex items-center
                                                    justify-center text-nr-accent font-bold text-lg
                                                    flex-shrink-0"
                                    >
                                        {aff.name[0]}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-semibold text-nr-text">
                                                {aff.name}
                                            </h3>
                                            {aff.featured && (
                                                <span
                                                    className="px-2 py-0.5 rounded-full text-[10px]
                                                                 bg-nr-gold/15 border border-nr-gold/25
                                                                 text-nr-gold font-semibold"
                                                >
                                                    Destacado
                                                </span>
                                            )}
                                            {aff.badge && (
                                                <span className="text-[10px] text-nr-faint">
                                                    · {aff.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-nr-muted line-clamp-1 mb-2">
                                            {aff.description}
                                        </p>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <span className="text-xs font-mono text-nr-green">
                                                ✓ {aff.commission}
                                            </span>
                                            {aff.cookie_duration && (
                                                <span className="text-xs font-mono text-nr-faint">
                                                    🍪 {aff.cookie_duration}
                                                </span>
                                            )}
                                            <span className="text-xs font-mono text-nr-faint">
                                                {aff.clicks_count.toLocaleString()} clics
                                            </span>
                                            {aff.category && (
                                                <span className="text-xs text-nr-faint">
                                                    {aff.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        {/* Active toggle */}
                                        <button
                                            onClick={() => toggleActive(aff)}
                                            className={cn(
                                                'w-9 h-5 rounded-full relative transition-colors',
                                                aff.active ? 'bg-nr-green' : 'bg-white/10',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm',
                                                    'transition-transform duration-200',
                                                    aff.active
                                                        ? 'translate-x-4'
                                                        : 'translate-x-0.5',
                                                )}
                                            />
                                        </button>

                                        <div
                                            className="flex gap-2 opacity-0 group-hover:opacity-100
                                                        transition-opacity"
                                        >
                                            <button
                                                onClick={() => startEdit(aff)}
                                                className="text-xs text-nr-muted hover:text-nr-text
                                                               transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <a
                                                href={aff.url}
                                                target="_blank"
                                                rel="noopener"
                                                className="text-xs text-nr-cyan hover:text-nr-cyan/80
                                                          transition-colors"
                                            >
                                                Probar ↗
                                            </a>
                                            <button
                                                onClick={() => deleteAffiliate(aff)}
                                                className="text-xs text-nr-faint hover:text-nr-red
                                                               transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {affiliates.length === 0 && (
                            <div className="glass rounded-2xl p-12 text-center text-nr-faint text-sm">
                                No hay programas de afiliados configurados.
                            </div>
                        )}
                    </div>
                </div>

                {/* Side form */}
                {showForm && (
                    <div className="w-[340px] flex-shrink-0">
                        <div className="glass rounded-2xl p-6 sticky top-6 max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-semibold text-nr-text">
                                    {editing ? 'Editar afiliado' : 'Nuevo afiliado'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowForm(false)
                                        setEditing(null)
                                        reset()
                                    }}
                                    className="text-nr-faint hover:text-nr-text transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label
                                        className="text-[10px] font-mono text-nr-faint
                                                      uppercase tracking-wider block mb-1.5"
                                    >
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
                                    <label
                                        className="text-[10px] font-mono text-nr-faint
                                                      uppercase tracking-wider block mb-1.5"
                                    >
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
                                    <label
                                        className="text-[10px] font-mono text-nr-faint
                                                      uppercase tracking-wider block mb-1.5"
                                    >
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
                                    <label
                                        className="text-[10px] font-mono text-nr-faint
                                                      uppercase tracking-wider block mb-1.5"
                                    >
                                        Descripción
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={2}
                                        className={cn(inputCls, 'resize-none text-xs')}
                                        placeholder="¿Para qué sirve esta herramienta?"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label
                                            className="text-[10px] font-mono text-nr-faint
                                                          uppercase tracking-wider block mb-1.5"
                                        >
                                            Comisión
                                        </label>
                                        <input
                                            value={data.commission}
                                            onChange={e => setData('commission', e.target.value)}
                                            className={inputCls}
                                            placeholder="30% recurrente"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="text-[10px] font-mono text-nr-faint
                                                          uppercase tracking-wider block mb-1.5"
                                        >
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
                                        <label
                                            className="text-[10px] font-mono text-nr-faint
                                                          uppercase tracking-wider block mb-1.5"
                                        >
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
                                        <label
                                            className="text-[10px] font-mono text-nr-faint
                                                          uppercase tracking-wider block mb-1.5"
                                        >
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
                                    <label
                                        className="text-[10px] font-mono text-nr-faint
                                                      uppercase tracking-wider block mb-1.5"
                                    >
                                        Badge
                                    </label>
                                    <input
                                        value={data.badge}
                                        onChange={e => setData('badge', e.target.value)}
                                        className={inputCls}
                                        placeholder="Lo uso diariamente"
                                    />
                                </div>

                                {/* Toggle switches */}
                                <div className="space-y-2 pt-1">
                                    {(
                                        [
                                            { key: 'active', label: 'Activo' },
                                            { key: 'featured', label: 'Destacado en home' },
                                        ] as const
                                    ).map(({ key, label }) => (
                                        <label
                                            key={key}
                                            className="flex items-center justify-between cursor-pointer"
                                        >
                                            <span className="text-xs text-nr-muted">{label}</span>
                                            <button
                                                type="button"
                                                onClick={() => setData(key, !data[key])}
                                                className={cn(
                                                    'w-9 h-5 rounded-full relative transition-colors',
                                                    data[key] ? 'bg-nr-accent' : 'bg-white/10',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'absolute top-0.5 w-4 h-4 rounded-full bg-white',
                                                        'transition-transform duration-200 shadow-sm',
                                                        data[key]
                                                            ? 'translate-x-4'
                                                            : 'translate-x-0.5',
                                                    )}
                                                />
                                            </button>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-2.5 rounded-xl text-sm font-semibold
                                                   text-white bg-gradient-to-r from-nr-accent
                                                   to-[#6d58f0] glow-accent hover:-translate-y-0.5
                                                   transition-all disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Guardando...'
                                        : editing
                                          ? 'Actualizar'
                                          : 'Crear afiliado'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
