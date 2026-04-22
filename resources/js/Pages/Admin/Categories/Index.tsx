import AdminLayout from '@/Components/Layout/AdminLayout'
import { Head, useForm, router } from '@inertiajs/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface Props {
    categories: (Category & { posts_count: number })[]
}

const PRESET_COLORS = [
    '#7C6AF7',
    '#06B6D4',
    '#10B981',
    '#F59E0B',
    '#EC4899',
    '#F97316',
    '#EF4444',
    '#8B5CF6',
]

const inputCls = `w-full bg-nr-bg border border-white/[0.08] rounded-lg px-3 py-2
                  text-sm text-nr-text outline-none focus:border-nr-accent/40
                  transition-colors placeholder-nr-faint/40`

export default function CategoriesIndex({ categories }: Props) {
    const [editing, setEditing] = useState<Category | null>(null)
    const [showForm, setShowForm] = useState(false)

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        name_en: '',
        description: '',
        description_en: '',
        color: '#7C6AF7',
        icon: '',
        order: 0,
    })

    const startEdit = (cat: Category) => {
        setEditing(cat)
        setData({
            name: cat.name,
            name_en: cat.name_en ?? '',
            description: cat.description ?? '',
            description_en: cat.description_en ?? '',
            color: cat.color,
            icon: cat.icon ?? '',
            order: cat.order ?? 0,
        })
        setShowForm(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editing) {
            put(`/admin/categories/${editing.id}`, {
                onSuccess: () => {
                    setEditing(null)
                    setShowForm(false)
                    reset()
                },
            })
        } else {
            post('/admin/categories', {
                onSuccess: () => {
                    setShowForm(false)
                    reset()
                },
            })
        }
    }

    const deleteCategory = (cat: Category) => {
        if (!confirm(`¿Eliminar "${cat.name}"? Los posts quedarán sin categoría.`)) return
        router.delete(`/admin/categories/${cat.id}`)
    }

    return (
        <AdminLayout title="Categorías">
            <Head title="Categorías — Admin" />

            <div className="flex gap-6">
                {/* List */}
                <div className="flex-1">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="font-display text-xl font-bold text-nr-text">Categorías</h2>
                        <button
                            onClick={() => {
                                setEditing(null)
                                reset()
                                setShowForm(true)
                            }}
                            className="glow-accent rounded-lg bg-gradient-to-r from-nr-accent to-nr-accent-dark px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                        >
                            + Nueva categoría
                        </button>
                    </div>

                    <div className="glass overflow-hidden rounded-2xl">
                        <div className="divide-y divide-white/[0.04]">
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                                >
                                    {/* Color + icon */}
                                    <div
                                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm"
                                        style={{
                                            background: `${cat.color}20`,
                                            border: `1px solid ${cat.color}30`,
                                        }}
                                    >
                                        {cat.icon ?? '◈'}
                                    </div>

                                    {/* Name */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-nr-text">
                                            {cat.name}
                                        </p>
                                        {cat.name_en && (
                                            <p className="text-xs text-nr-faint">{cat.name_en}</p>
                                        )}
                                    </div>

                                    {/* Color swatch */}
                                    <div
                                        className="h-4 w-4 flex-shrink-0 rounded-full"
                                        style={{ background: cat.color }}
                                    />

                                    {/* Order */}
                                    <span className="w-6 flex-shrink-0 text-center font-mono text-xs text-nr-faint">
                                        #{cat.order}
                                    </span>

                                    {/* Posts count */}
                                    <span className="hidden flex-shrink-0 font-mono text-xs text-nr-faint md:block">
                                        {cat.posts_count} posts
                                    </span>

                                    {/* Actions */}
                                    <div className="flex flex-shrink-0 gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            onClick={() => startEdit(cat)}
                                            className="text-xs text-nr-muted transition-colors hover:text-nr-text"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(cat)}
                                            className="text-xs text-nr-faint transition-colors hover:text-nr-red"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {categories.length === 0 && (
                                <div className="py-12 text-center text-sm text-nr-faint">
                                    No hay categorías creadas.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Side form */}
                {showForm && (
                    <div className="w-[320px] flex-shrink-0">
                        <div className="glass sticky top-6 rounded-2xl p-6">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="font-semibold text-nr-text">
                                    {editing ? 'Editar categoría' : 'Nueva categoría'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowForm(false)
                                        setEditing(null)
                                        reset()
                                    }}
                                    className="text-sm text-nr-faint transition-colors hover:text-nr-text"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                        Nombre (ES)
                                    </label>
                                    <input
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={inputCls}
                                        placeholder="IA Generativa"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-nr-red">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                        Nombre (EN)
                                    </label>
                                    <input
                                        value={data.name_en}
                                        onChange={e => setData('name_en', e.target.value)}
                                        className={inputCls}
                                        placeholder="Generative AI"
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
                                        placeholder="Descripción de la categoría..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                            Icono
                                        </label>
                                        <input
                                            value={data.icon}
                                            onChange={e => setData('icon', e.target.value)}
                                            className={inputCls}
                                            placeholder="✦"
                                            maxLength={4}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                            Orden
                                        </label>
                                        <input
                                            type="number"
                                            value={data.order}
                                            onChange={e =>
                                                setData('order', parseInt(e.target.value))
                                            }
                                            className={inputCls}
                                            min={0}
                                        />
                                    </div>
                                </div>

                                {/* Color picker */}
                                <div>
                                    <label className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-nr-faint">
                                        Color
                                    </label>
                                    <div className="mb-2 flex flex-wrap gap-2">
                                        {PRESET_COLORS.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setData('color', color)}
                                                className={cn(
                                                    'h-7 w-7 rounded-lg transition-all',
                                                    data.color === color
                                                        ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-nr-bg2'
                                                        : 'hover:scale-105',
                                                )}
                                                style={{ background: color }}
                                            />
                                        ))}
                                        <input
                                            type="color"
                                            value={data.color}
                                            onChange={e => setData('color', e.target.value)}
                                            className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent"
                                            title="Color personalizado"
                                        />
                                    </div>
                                    {/* Live preview */}
                                    <div
                                        className="flex items-center gap-2 rounded-lg p-2"
                                        style={{ background: `${data.color}10` }}
                                    >
                                        <span>{data.icon || '◈'}</span>
                                        <span
                                            className="text-xs font-semibold"
                                            style={{ color: data.color }}
                                        >
                                            {data.name || 'Preview'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="glow-accent w-full rounded-xl bg-gradient-to-r from-nr-accent to-nr-accent-dark py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Guardando...'
                                        : editing
                                          ? 'Actualizar'
                                          : 'Crear categoría'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
