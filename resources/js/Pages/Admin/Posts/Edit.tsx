import { Head, router } from '@inertiajs/react'
import { useState, useRef } from 'react'
import AdminLayout from '@/Components/Layout/AdminLayout'
import TiptapEditor from '@/Components/Admin/TiptapEditor'
import ConfirmModal from '@/Components/ConfirmModal'
import { SITE } from '@/lib/constants'
import type { Post, Category, Tag, Affiliate } from '@/types'

interface Props {
    post: Post | null
    categories: Category[]
    tags: Tag[]
    affiliates: Affiliate[]
}

const LANG_OPTIONS = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'both', label: 'Ambos' },
]
const STATUS_OPTIONS = [
    { value: 'draft', label: 'Borrador' },
    { value: 'review', label: 'En revisión' },
    { value: 'scheduled', label: 'Programado' },
    { value: 'published', label: 'Publicado' },
]

function slugify(str: string) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
}

function Toggle({
    label,
    checked,
    onChange,
}: {
    label: string
    checked: boolean
    onChange: (v: boolean) => void
}) {
    return (
        <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm text-nr-muted">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-nr-accent' : 'bg-white/10'}`}
            >
                <span
                    className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`}
                />
            </button>
        </label>
    )
}

function SeoPreview({
    title,
    description,
    slug,
}: {
    title: string
    description: string
    slug: string
}) {
    const displayTitle = title || 'Título del artículo'
    const displayDesc = description || 'Sin meta descripción configurada.'
    const url = `${SITE.url.replace('https://', '')}/blog/${slug || 'url-del-articulo'}`
    const titleOk = title.length >= 30 && title.length <= 70
    const descOk = description.length >= 70 && description.length <= 160

    return (
        <div className="space-y-1 rounded-xl border border-white/[0.06] bg-[#0f1117] p-4 font-sans">
            <p className="truncate font-mono text-[11px] text-nr-faint">{url}</p>
            <p
                className={`truncate text-sm font-medium ${titleOk ? 'text-[#8ab4f8]' : 'text-nr-red'}`}
            >
                {displayTitle}
            </p>
            <p
                className={`line-clamp-2 text-xs leading-relaxed ${descOk ? 'text-nr-faint' : 'text-nr-red/70'}`}
            >
                {displayDesc}
            </p>
        </div>
    )
}

export default function PostEdit({ post, categories, tags, affiliates }: Props) {
    const isNew = !post

    const [tab, setTab] = useState<'es' | 'en'>('es')
    const [seoOpen, setSeoOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadToast, setUploadToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [data, setDataState] = useState({
        title: post?.title ?? '',
        title_en: post?.title_en ?? '',
        slug: post?.slug ?? '',
        slug_en: post?.slug_en ?? '',
        excerpt: post?.excerpt ?? '',
        excerpt_en: post?.excerpt_en ?? '',
        content: post?.content ?? '',
        content_en: post?.content_en ?? '',
        cover_image: post?.cover_image ?? '',
        og_image: post?.og_image ?? '',
        category_id: post?.category?.id?.toString() ?? '',
        status: (post?.status ?? 'draft') as Post['status'],
        lang: (post?.lang ?? 'es') as Post['lang'],
        featured: post?.featured ?? false,
        allow_comments: post?.allow_comments ?? true,
        indexable: post?.indexable ?? true,
        published_at: post?.published_at ? post.published_at.slice(0, 16) : '',
        meta_title: post?.meta_title ?? '',
        meta_description: post?.meta_description ?? '',
        tags: post?.tags?.map(t => t.id) ?? ([] as number[]),
        affiliates: post?.affiliates?.map(a => a.id) ?? ([] as number[]),
    })

    const set = <K extends keyof typeof data>(key: K, value: (typeof data)[K]) => {
        setDataState(prev => ({ ...prev, [key]: value }))
    }

    const handleTitleChange = (value: string) => {
        set('title', value)
        if (!post) set('slug', slugify(value))
    }

    const handleTitleEnChange = (value: string) => {
        set('title_en', value)
        if (!post) set('slug_en', slugify(value))
    }

    const toggleArrayItem = (field: 'tags' | 'affiliates', id: number) => {
        const current = data[field] as number[]
        set(field, current.includes(id) ? current.filter(i => i !== id) : [...current, id])
    }

    const showToast = (type: 'success' | 'error', message: string) => {
        setUploadToast({ type, message })
        setTimeout(() => setUploadToast(null), 4000)
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const form = new FormData()
            form.append('image', file)
            const xsrf = getCookie('XSRF-TOKEN')
            const res = await fetch('/admin/upload/image', {
                method: 'POST',
                credentials: 'same-origin',
                headers: xsrf ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrf) } : {},
                body: form,
            })
            if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
                const text = await res.text().catch(() => '')
                console.error('Upload failed', res.status, text.slice(0, 200))
                showToast('error', `Error al subir la imagen (${res.status})`)
                return
            }
            const json = await res.json()
            if (json.url) {
                set('cover_image', json.url)
                showToast('success', 'Imagen subida correctamente')
            }
        } catch (err) {
            console.error('Upload error', err)
            showToast('error', 'Error de red al subir la imagen')
        } finally {
            setUploading(false)
        }
    }

    const buildPayload = () => ({ ...data })

    const handleSaveDraft = () => {
        const payload = { ...buildPayload(), status: 'draft' as const }
        if (isNew) {
            router.post('/admin/posts', payload)
        } else {
            router.put(`/admin/posts/${post!.id}`, payload)
        }
    }

    const handlePublish = () => {
        const payload = { ...buildPayload(), status: 'published' as const }
        if (isNew) {
            router.post('/admin/posts', payload)
        } else {
            router.put(`/admin/posts/${post!.id}`, payload)
        }
    }

    const handleDuplicate = () => {
        if (!post) return
        router.post(`/admin/posts/${post.id}/duplicate`)
    }

    const [showNewsletterConfirm, setShowNewsletterConfirm] = useState(false)

    const handleSendNewsletter = () => {
        if (!post || post.status !== 'published') return
        setShowNewsletterConfirm(true)
    }

    const confirmSendNewsletter = () => {
        setShowNewsletterConfirm(false)
        router.post(`/admin/posts/${post!.id}/send-newsletter`)
    }

    return (
        <AdminLayout title={isNew ? 'Nuevo artículo' : 'Editar artículo'}>
            <Head title={isNew ? 'Admin — Nuevo artículo' : `Admin — ${post?.title}`} />

            <div className="max-w-5xl space-y-6">
                {/* Actions bar */}
                <div className="flex items-center justify-end gap-3">
                    {!isNew && (
                        <button
                            type="button"
                            onClick={handleDuplicate}
                            className="glass rounded-lg px-4 py-2 text-xs text-nr-faint transition-colors hover:text-nr-muted"
                        >
                            Duplicar
                        </button>
                    )}
                    {post?.status === 'published' && (
                        <button
                            type="button"
                            onClick={handleSendNewsletter}
                            className="glass rounded-lg px-4 py-2 text-xs text-nr-cyan transition-colors hover:text-nr-text"
                        >
                            📧 Enviar newsletter
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="glass rounded-lg px-4 py-2 text-sm text-nr-muted transition-colors hover:text-nr-text"
                    >
                        Guardar borrador
                    </button>
                    <button
                        type="button"
                        onClick={handlePublish}
                        className="rounded-lg bg-gradient-to-r from-nr-accent to-nr-accent-dark px-6 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                    >
                        {post?.status === 'published' ? 'Actualizar' : 'Publicar'}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main */}
                    <div className="space-y-5 lg:col-span-2">
                        {/* Content tabs */}
                        <div className="glass overflow-hidden rounded-2xl">
                            {/* Tab switcher */}
                            {data.lang === 'both' && (
                                <div className="flex border-b border-white/[0.06]">
                                    {(['es', 'en'] as const).map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setTab(t)}
                                            className={`px-5 py-3 text-sm font-medium transition-colors ${
                                                tab === t
                                                    ? '-mb-px border-b-2 border-nr-accent text-nr-text'
                                                    : 'text-nr-faint hover:text-nr-muted'
                                            }`}
                                        >
                                            {t === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-4 p-6">
                                {/* Title ES */}
                                {(data.lang !== 'en' || tab === 'es') && (
                                    <div
                                        className={
                                            data.lang === 'both' && tab !== 'es' ? 'hidden' : ''
                                        }
                                    >
                                        <label className="mb-1.5 block text-xs uppercase tracking-wider text-nr-faint">
                                            Título (ES)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={e => handleTitleChange(e.target.value)}
                                            className="glass w-full rounded-lg border border-white/[0.08] px-3 py-2.5 text-base text-sm font-medium text-nr-text outline-none transition-colors focus:border-nr-accent/50"
                                            placeholder="Título del artículo"
                                        />
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={e => set('slug', e.target.value)}
                                            className="glass mt-1.5 w-full rounded-lg border border-white/[0.05] px-3 py-1.5 font-mono text-xs text-nr-faint outline-none focus:border-nr-accent/30"
                                            placeholder="slug-del-articulo"
                                        />
                                    </div>
                                )}

                                {/* Title EN */}
                                {(data.lang === 'en' || (data.lang === 'both' && tab === 'en')) && (
                                    <div>
                                        <label className="mb-1.5 block text-xs uppercase tracking-wider text-nr-faint">
                                            Title (EN)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title_en}
                                            onChange={e => handleTitleEnChange(e.target.value)}
                                            className="glass w-full rounded-lg border border-white/[0.08] px-3 py-2.5 text-base text-sm font-medium text-nr-text outline-none transition-colors focus:border-nr-accent/50"
                                            placeholder="Article title in English"
                                        />
                                        <input
                                            type="text"
                                            value={data.slug_en}
                                            onChange={e => set('slug_en', e.target.value)}
                                            className="glass mt-1.5 w-full rounded-lg border border-white/[0.05] px-3 py-1.5 font-mono text-xs text-nr-faint outline-none focus:border-nr-accent/30"
                                            placeholder="article-slug-in-english"
                                        />
                                    </div>
                                )}

                                {/* Excerpt */}
                                <div
                                    className={data.lang === 'both' && tab === 'en' ? 'hidden' : ''}
                                >
                                    {data.lang !== 'en' && (
                                        <>
                                            <label className="mb-1.5 block text-xs uppercase tracking-wider text-nr-faint">
                                                Excerpt (ES)
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={data.excerpt}
                                                onChange={e => set('excerpt', e.target.value)}
                                                className="glass w-full resize-none rounded-lg border border-white/[0.08] px-3 py-2.5 text-sm text-nr-text outline-none transition-colors focus:border-nr-accent/50"
                                                placeholder="Resumen breve..."
                                            />
                                        </>
                                    )}
                                </div>
                                {(data.lang === 'en' || (data.lang === 'both' && tab === 'en')) && (
                                    <div>
                                        <label className="mb-1.5 block text-xs uppercase tracking-wider text-nr-faint">
                                            Excerpt (EN)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={data.excerpt_en}
                                            onChange={e => set('excerpt_en', e.target.value)}
                                            className="glass w-full resize-none rounded-lg border border-white/[0.08] px-3 py-2.5 text-sm text-nr-text outline-none transition-colors focus:border-nr-accent/50"
                                            placeholder="Brief summary in English..."
                                        />
                                    </div>
                                )}

                                {/* Content editor */}
                                <div
                                    className={data.lang === 'both' && tab === 'en' ? 'hidden' : ''}
                                >
                                    {data.lang !== 'en' && (
                                        <>
                                            <label className="mb-1.5 block text-xs uppercase tracking-wider text-nr-faint">
                                                Contenido (ES)
                                            </label>
                                            <TiptapEditor
                                                content={data.content}
                                                onChange={v => set('content', v)}
                                                placeholder="Escribe el contenido aquí..."
                                            />
                                        </>
                                    )}
                                </div>
                                {(data.lang === 'en' || (data.lang === 'both' && tab === 'en')) && (
                                    <div>
                                        <label className="mb-1.5 block text-xs uppercase tracking-wider text-nr-faint">
                                            Content (EN)
                                        </label>
                                        <TiptapEditor
                                            content={data.content_en}
                                            onChange={v => set('content_en', v)}
                                            placeholder="Write content in English..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SEO section */}
                        <div className="glass overflow-hidden rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setSeoOpen(o => !o)}
                                className="flex w-full items-center justify-between px-6 py-4 text-sm font-semibold text-nr-text transition-colors hover:text-nr-accent"
                            >
                                <span>SEO & Meta</span>
                                <span className="text-xs text-nr-faint">{seoOpen ? '▲' : '▼'}</span>
                            </button>

                            {seoOpen && (
                                <div className="space-y-4 border-t border-white/[0.06] px-6 pb-6 pt-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs uppercase tracking-wider text-nr-faint">
                                            Meta título ({data.meta_title.length}/70)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.meta_title}
                                            onChange={e => set('meta_title', e.target.value)}
                                            maxLength={70}
                                            className="glass w-full rounded-lg border border-white/[0.08] px-3 py-2.5 text-sm text-nr-text outline-none transition-colors focus:border-nr-accent/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs uppercase tracking-wider text-nr-faint">
                                            Meta descripción ({data.meta_description.length}/160)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={data.meta_description}
                                            onChange={e => set('meta_description', e.target.value)}
                                            maxLength={160}
                                            className="glass w-full resize-none rounded-lg border border-white/[0.08] px-3 py-2.5 text-sm text-nr-text outline-none transition-colors focus:border-nr-accent/50"
                                        />
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs uppercase tracking-wider text-nr-faint">
                                            Vista previa Google
                                        </p>
                                        <SeoPreview
                                            title={data.meta_title || data.title}
                                            description={data.meta_description}
                                            slug={data.slug}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Publish settings */}
                        <div className="glass space-y-4 rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-nr-text">Publicación</h3>

                            <div>
                                <label className="mb-1.5 block text-xs text-nr-faint">Estado</label>
                                <select
                                    value={data.status}
                                    onChange={e => set('status', e.target.value as Post['status'])}
                                    className="glass w-full rounded-lg border border-white/[0.08] bg-transparent px-3 py-2 text-sm text-nr-muted outline-none"
                                >
                                    {STATUS_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs text-nr-faint">Idioma</label>
                                <select
                                    value={data.lang}
                                    onChange={e => set('lang', e.target.value as Post['lang'])}
                                    className="glass w-full rounded-lg border border-white/[0.08] bg-transparent px-3 py-2 text-sm text-nr-muted outline-none"
                                >
                                    {LANG_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs text-nr-faint">
                                    Categoría
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={e => set('category_id', e.target.value)}
                                    className="glass w-full rounded-lg border border-white/[0.08] bg-transparent px-3 py-2 text-sm text-nr-muted outline-none"
                                >
                                    <option value="">Sin categoría</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs text-nr-faint">
                                    Fecha publicación
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={e => set('published_at', e.target.value)}
                                    className="glass w-full rounded-lg border border-white/[0.08] bg-transparent px-3 py-2 text-sm text-nr-muted outline-none [color-scheme:dark]"
                                />
                            </div>

                            <div className="space-y-3 pt-1">
                                <Toggle
                                    label="Destacado"
                                    checked={data.featured}
                                    onChange={v => set('featured', v)}
                                />
                                <Toggle
                                    label="Comentarios"
                                    checked={data.allow_comments}
                                    onChange={v => set('allow_comments', v)}
                                />
                                <Toggle
                                    label="Indexable SEO"
                                    checked={data.indexable}
                                    onChange={v => set('indexable', v)}
                                />
                            </div>
                        </div>

                        {/* Cover image */}
                        <div className="glass space-y-3 rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-nr-text">Portada</h3>
                            {data.cover_image && (
                                <img
                                    src={data.cover_image}
                                    alt="Portada"
                                    className="max-h-36 w-full rounded-lg object-cover"
                                />
                            )}
                            <input
                                type="text"
                                value={data.cover_image}
                                onChange={e => set('cover_image', e.target.value)}
                                placeholder="URL de la imagen"
                                className="glass w-full rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-nr-text outline-none transition-colors focus:border-nr-accent/50"
                            />
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="glass w-full rounded-lg py-2 text-xs text-nr-faint transition-colors hover:text-nr-muted disabled:opacity-50"
                            >
                                {uploading ? 'Subiendo...' : '↑ Subir imagen'}
                            </button>
                            {uploadToast && (
                                <p className={`text-xs font-medium ${
                                    uploadToast.type === 'success' ? 'text-nr-green' : 'text-nr-red'
                                }`}>
                                    {uploadToast.type === 'success' ? '✓' : '✕'} {uploadToast.message}
                                </p>
                            )}
                            <div className="border-t border-white/[0.06] pt-3">
                                <label className="mb-1.5 block text-xs text-nr-faint">
                                    OG Image (redes sociales)
                                </label>
                                <input
                                    type="text"
                                    value={data.og_image}
                                    onChange={e => set('og_image', e.target.value)}
                                    placeholder="URL de la imagen OG (opcional, usa portada si vacío)"
                                    className="glass w-full rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-nr-text outline-none transition-colors focus:border-nr-accent/50"
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="glass rounded-2xl p-5">
                            <h3 className="mb-3 text-sm font-semibold text-nr-text">Tags</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {tags.map(tag => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => toggleArrayItem('tags', tag.id)}
                                        className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                                            (data.tags as number[]).includes(tag.id)
                                                ? 'border border-nr-accent/40 bg-nr-accent/20 text-nr-accent'
                                                : 'glass text-nr-faint hover:text-nr-muted'
                                        }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                                {tags.length === 0 && (
                                    <span className="text-xs text-nr-faint">
                                        Sin tags disponibles
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Affiliates */}
                        <div className="glass rounded-2xl p-5">
                            <h3 className="mb-3 text-sm font-semibold text-nr-text">Afiliados</h3>
                            <div className="max-h-48 space-y-1.5 overflow-y-auto">
                                {affiliates.map(aff => (
                                    <label
                                        key={aff.id}
                                        className="flex cursor-pointer items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={(data.affiliates as number[]).includes(aff.id)}
                                            onChange={() => toggleArrayItem('affiliates', aff.id)}
                                            className="h-3.5 w-3.5 accent-nr-accent"
                                        />
                                        <span className="text-xs text-nr-muted">{aff.name}</span>
                                    </label>
                                ))}
                                {affiliates.length === 0 && (
                                    <span className="text-xs text-nr-faint">
                                        Sin afiliados activos
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={showNewsletterConfirm}
                title="Enviar newsletter"
                message="¿Enviar este artículo como newsletter a todos los suscriptores confirmados?"
                confirmLabel="Enviar"
                cancelLabel="Cancelar"
                onConfirm={confirmSendNewsletter}
                onCancel={() => setShowNewsletterConfirm(false)}
            />
        </AdminLayout>
    )
}

function getCookie(name: string) {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
}
