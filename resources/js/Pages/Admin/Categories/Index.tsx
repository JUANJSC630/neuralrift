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
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-display text-xl font-bold text-nr-text">Categorías</h2>
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
                            + Nueva categoría
                        </button>
                    </div>

                    <div className="glass rounded-2xl overflow-hidden">
                        <div className="divide-y divide-white/[0.04]">
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    className="flex items-center gap-4 px-6 py-4
                                                hover:bg-white/[0.02] transition-colors group"
                                >
                                    {/* Color + icon */}
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center
                                                    text-sm flex-shrink-0"
                                        style={{
                                            background: `${cat.color}20`,
                                            border: `1px solid ${cat.color}30`,
                                        }}
                                    >
                                        {cat.icon ?? '◈'}
                                    </div>

                                    {/* Name */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-nr-text font-medium">
                                            {cat.name}
                                        </p>
                                        {cat.name_en && (
                                            <p className="text-xs text-nr-faint">{cat.name_en}</p>
                                        )}
                                    </div>

                                    {/* Color swatch */}
                                    <div
                                        className="w-4 h-4 rounded-full flex-shrink-0"
                                        style={{ background: cat.color }}
                                    />

                                    {/* Order */}
                                    <span
                                        className="text-xs font-mono text-nr-faint w-6 text-center
                                                     flex-shrink-0"
                                    >
                                        #{cat.order}
                                    </span>

                                    {/* Posts count */}
                                    <span
                                        className="text-xs font-mono text-nr-faint flex-shrink-0
                                                     hidden md:block"
                                    >
                                        {cat.posts_count} posts
                                    </span>

                                    {/* Actions */}
                                    <div
                                        className="flex gap-3 opacity-0 group-hover:opacity-100
                                                    transition-opacity flex-shrink-0"
                                    >
                                        <button
                                            onClick={() => startEdit(cat)}
                                            className="text-xs text-nr-muted hover:text-nr-text
                                                           transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(cat)}
                                            className="text-xs text-nr-faint hover:text-nr-red
                                                           transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {categories.length === 0 && (
                                <div className="text-center py-12 text-nr-faint text-sm">
                                    No hay categorías creadas.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Side form */}
                {showForm && (
                    <div className="w-[320px] flex-shrink-0">
                        <div className="glass rounded-2xl p-6 sticky top-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-semibold text-nr-text">
                                    {editing ? 'Editar categoría' : 'Nueva categoría'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowForm(false)
                                        setEditing(null)
                                        reset()
                                    }}
                                    className="text-nr-faint hover:text-nr-text transition-colors text-sm"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label
                                        className="text-[10px] font-mono text-nr-faint uppercase
                                                      tracking-wider block mb-1.5"
                                    >
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
                                        <p className="text-xs text-nr-red mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        className="text-[10px] font-mono text-nr-faint uppercase
                                                      tracking-wider block mb-1.5"
                                    >
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
                                    <label
                                        className="text-[10px] font-mono text-nr-faint uppercase
                                                      tracking-wider block mb-1.5"
                                    >
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
                                        <label
                                            className="text-[10px] font-mono text-nr-faint uppercase
                                                          tracking-wider block mb-1.5"
                                        >
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
                                        <label
                                            className="text-[10px] font-mono text-nr-faint uppercase
                                                          tracking-wider block mb-1.5"
                                        >
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
                                    <label
                                        className="text-[10px] font-mono text-nr-faint uppercase
                                                      tracking-wider block mb-2"
                                    >
                                        Color
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {PRESET_COLORS.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setData('color', color)}
                                                className={cn(
                                                    'w-7 h-7 rounded-lg transition-all',
                                                    data.color === color
                                                        ? 'ring-2 ring-white ring-offset-2 ring-offset-nr-bg2 scale-110'
                                                        : 'hover:scale-105',
                                                )}
                                                style={{ background: color }}
                                            />
                                        ))}
                                        <input
                                            type="color"
                                            value={data.color}
                                            onChange={e => setData('color', e.target.value)}
                                            className="w-7 h-7 rounded-lg cursor-pointer border-0
                                                          bg-transparent"
                                            title="Color personalizado"
                                        />
                                    </div>
                                    {/* Live preview */}
                                    <div
                                        className="flex items-center gap-2 p-2 rounded-lg"
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
                                    className="w-full py-2.5 rounded-xl text-sm font-semibold
                                                   text-white bg-gradient-to-r from-nr-accent to-[#6d58f0]
                                                   glow-accent hover:-translate-y-0.5 transition-all
                                                   disabled:opacity-50"
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
