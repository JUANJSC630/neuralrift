import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '@/Components/Layout/AdminLayout'

interface ImageUsage {
    type: string
    id: number
    title: string
    field: string
}

interface ImageItem {
    path: string
    url: string
    filename: string
    size: number
    modified: number
    used_in: ImageUsage[]
    is_used: boolean
}

interface Props {
    images: ImageItem[]
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(ts: number): string {
    return new Date(ts * 1000).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export default function Images({ images }: Props) {
    const [filter, setFilter] = useState<'all' | 'used' | 'unused'>('all')
    const [deleting, setDeleting] = useState<string | null>(null)
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [preview, setPreview] = useState<ImageItem | null>(null)
    const [toast, setToast] = useState(false)

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url)
        setToast(true)
        setTimeout(() => setToast(false), 2000)
    }

    const filtered = images.filter(img => {
        if (filter === 'used') return img.is_used
        if (filter === 'unused') return !img.is_used
        return true
    })

    const usedCount = images.filter(i => i.is_used).length
    const unusedCount = images.filter(i => !i.is_used).length
    const totalSize = images.reduce((s, i) => s + i.size, 0)

    const handleDelete = async (path: string) => {
        if (!confirm('¿Eliminar esta imagen? Esta acción no se puede deshacer.')) return
        setDeleting(path)
        try {
            const xsrf = getCookie('XSRF-TOKEN')
            const res = await fetch('/admin/images', {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    ...(xsrf ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrf) } : {}),
                },
                body: JSON.stringify({ path }),
            })
            if (res.ok) {
                router.reload({ only: ['images'] })
            }
        } finally {
            setDeleting(null)
        }
    }

    const handleBulkDelete = async () => {
        const paths = Array.from(selected)
        const usedPaths = paths.filter(p => images.find(i => i.path === p)?.is_used)
        if (usedPaths.length > 0) {
            if (
                !confirm(
                    `${usedPaths.length} imagen(es) están en uso. ¿Eliminar todas las ${paths.length} seleccionadas de todos modos?`,
                )
            )
                return
        } else {
            if (!confirm(`¿Eliminar ${paths.length} imagen(es)? Esta acción no se puede deshacer.`))
                return
        }

        const xsrf = getCookie('XSRF-TOKEN')
        for (const path of paths) {
            await fetch('/admin/images', {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    ...(xsrf ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrf) } : {}),
                },
                body: JSON.stringify({ path }),
            })
        }
        setSelected(new Set())
        router.reload({ only: ['images'] })
    }

    const toggleSelect = (path: string) => {
        setSelected(prev => {
            const next = new Set(prev)
            if (next.has(path)) next.delete(path)
            else next.add(path)
            return next
        })
    }

    const toggleSelectAll = () => {
        if (selected.size === filtered.length) {
            setSelected(new Set())
        } else {
            setSelected(new Set(filtered.map(i => i.path)))
        }
    }

    return (
        <AdminLayout title="Imágenes">
            <Head title="Admin — Imágenes" />

            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="glass rounded-xl p-4">
                        <p className="text-2xl font-bold text-nr-text">{images.length}</p>
                        <p className="text-xs text-nr-faint">Total</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                        <p className="text-2xl font-bold text-nr-green">{usedCount}</p>
                        <p className="text-xs text-nr-faint">En uso</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                        <p className="text-2xl font-bold text-nr-gold">{unusedCount}</p>
                        <p className="text-xs text-nr-faint">Sin usar</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                        <p className="text-2xl font-bold text-nr-text">{formatBytes(totalSize)}</p>
                        <p className="text-xs text-nr-faint">Tamaño total</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-1">
                        {(['all', 'used', 'unused'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                    filter === f
                                        ? 'bg-nr-accent/20 text-nr-accent'
                                        : 'glass text-nr-faint hover:text-nr-muted'
                                }`}
                            >
                                {f === 'all' ? 'Todas' : f === 'used' ? 'En uso' : 'Sin usar'}
                            </button>
                        ))}
                    </div>

                    {selected.size > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="ml-auto rounded-lg bg-nr-red/20 px-4 py-1.5 text-xs font-medium text-nr-red transition-colors hover:bg-nr-red/30"
                        >
                            Eliminar {selected.size} seleccionada{selected.size > 1 ? 's' : ''}
                        </button>
                    )}

                    <span className="ml-auto text-xs text-nr-faint">
                        {filtered.length} imagen{filtered.length !== 1 ? 'es' : ''}
                    </span>
                </div>

                {/* Image grid */}
                {filtered.length === 0 ? (
                    <div className="glass flex flex-col items-center justify-center rounded-2xl py-16 text-center">
                        <p className="text-4xl">🖼️</p>
                        <p className="mt-3 text-sm text-nr-muted">No hay imágenes</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {/* Select all */}
                        <label className="flex cursor-pointer items-center gap-2 px-1">
                            <input
                                type="checkbox"
                                checked={selected.size === filtered.length && filtered.length > 0}
                                onChange={toggleSelectAll}
                                className="h-3.5 w-3.5 accent-nr-accent"
                            />
                            <span className="text-xs text-nr-faint">Seleccionar todas</span>
                        </label>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {filtered.map(img => (
                                <div
                                    key={img.path}
                                    className={`glass group relative overflow-hidden rounded-xl transition-all ${
                                        selected.has(img.path) ? 'ring-2 ring-nr-accent' : ''
                                    }`}
                                >
                                    {/* Select checkbox */}
                                    <div className="absolute left-2 top-2 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selected.has(img.path)}
                                            onChange={() => toggleSelect(img.path)}
                                            className="h-4 w-4 cursor-pointer accent-nr-accent"
                                        />
                                    </div>

                                    {/* Usage badge */}
                                    <div className="absolute right-2 top-2 z-10">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                img.is_used
                                                    ? 'bg-nr-green/20 text-nr-green'
                                                    : 'bg-nr-gold/20 text-nr-gold'
                                            }`}
                                        >
                                            {img.is_used ? 'En uso' : 'Sin usar'}
                                        </span>
                                    </div>

                                    {/* Thumbnail */}
                                    <button
                                        type="button"
                                        onClick={() => setPreview(img)}
                                        className="block w-full"
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.filename}
                                            loading="lazy"
                                            decoding="async"
                                            className="aspect-video w-full object-cover"
                                        />
                                    </button>

                                    {/* Info */}
                                    <div className="space-y-1.5 p-3">
                                        <p
                                            className="truncate font-mono text-[11px] text-nr-muted"
                                            title={img.filename}
                                        >
                                            {img.filename}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-nr-faint">
                                                {formatBytes(img.size)} · {formatDate(img.modified)}
                                            </span>
                                        </div>

                                        {/* Usage list */}
                                        {img.used_in.length > 0 && (
                                            <div className="space-y-0.5">
                                                {img.used_in.map((u, i) => (
                                                    <p
                                                        key={i}
                                                        className="truncate text-[10px] text-nr-faint"
                                                    >
                                                        <span className="text-nr-cyan">
                                                            {u.type === 'post' ? '📝' : '🔗'}
                                                        </span>{' '}
                                                        {u.title}{' '}
                                                        <span className="text-nr-faint/60">
                                                            ({u.field})
                                                        </span>
                                                    </p>
                                                ))}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-1.5 pt-1">
                                            <button
                                                onClick={() => copyUrl(img.url)}
                                                className="flex-1 rounded-lg bg-white/5 py-1.5 text-[10px] text-nr-muted transition-colors hover:bg-white/10"
                                                title="Copiar URL"
                                            >
                                                Copiar URL
                                            </button>
                                            <button
                                                onClick={() => handleDelete(img.path)}
                                                disabled={deleting === img.path}
                                                className="flex-1 rounded-lg bg-nr-red/10 py-1.5 text-[10px] text-nr-red transition-colors hover:bg-nr-red/20 disabled:opacity-50"
                                            >
                                                {deleting === img.path
                                                    ? 'Eliminando...'
                                                    : 'Eliminar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Copy toast */}
            <div
                className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-xl bg-nr-surface px-4 py-3 shadow-lg shadow-black/40 ring-1 ring-nr-accent/30 transition-all duration-300 ${
                    toast
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-4 opacity-0'
                }`}
            >
                <span className="text-nr-green">✓</span>
                <span className="text-sm text-nr-text">URL copiada</span>
            </div>

            {/* Preview modal */}
            {preview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setPreview(null)}
                >
                    <div
                        className="glass max-h-[90vh] max-w-4xl overflow-auto rounded-2xl p-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="mb-3 flex items-start justify-between">
                            <div>
                                <p className="font-mono text-sm text-nr-text">{preview.filename}</p>
                                <p className="text-xs text-nr-faint">
                                    {formatBytes(preview.size)} · {formatDate(preview.modified)}
                                </p>
                            </div>
                            <button
                                onClick={() => setPreview(null)}
                                className="text-lg text-nr-faint hover:text-nr-text"
                            >
                                ✕
                            </button>
                        </div>

                        <img
                            src={preview.url}
                            alt={preview.filename}
                            className="max-h-[60vh] w-full rounded-lg object-contain"
                        />

                        <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={preview.url}
                                    className="glass flex-1 rounded-lg border border-white/[0.08] px-3 py-2 font-mono text-xs text-nr-muted outline-none"
                                />
                                <button
                                    onClick={() => copyUrl(preview.url)}
                                    className="glass rounded-lg px-3 py-2 text-xs text-nr-muted hover:text-nr-text"
                                >
                                    Copiar
                                </button>
                            </div>

                            {preview.used_in.length > 0 ? (
                                <div className="rounded-lg bg-nr-green/5 p-3">
                                    <p className="mb-1 text-xs font-medium text-nr-green">
                                        Usada en:
                                    </p>
                                    {preview.used_in.map((u, i) => (
                                        <p key={i} className="text-xs text-nr-muted">
                                            {u.type === 'post' ? '📝' : '🔗'} {u.title} — {u.field}
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg bg-nr-gold/5 p-3">
                                    <p className="text-xs text-nr-gold">
                                        Esta imagen no está siendo utilizada en ningún post ni
                                        afiliado.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-1">
                                <button
                                    onClick={() => {
                                        handleDelete(preview.path)
                                        setPreview(null)
                                    }}
                                    className="rounded-lg bg-nr-red/20 px-4 py-2 text-xs font-medium text-nr-red transition-colors hover:bg-nr-red/30"
                                >
                                    Eliminar imagen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

function getCookie(name: string) {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
}
