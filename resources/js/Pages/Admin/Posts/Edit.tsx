import { Head, router } from '@inertiajs/react'
import { useState, useRef } from 'react'
import AdminLayout from '@/Components/Layout/AdminLayout'
import TiptapEditor from '@/Components/Admin/TiptapEditor'
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
        <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-nr-muted">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-9 h-5 rounded-full transition-colors
                        ${checked ? 'bg-nr-accent' : 'bg-white/10'}`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white
                                  transition-transform ${checked ? 'translate-x-4' : ''}`}
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
    const url = `neuralrift.io/blog/${slug || 'url-del-articulo'}`
    const titleOk = title.length >= 30 && title.length <= 70
    const descOk = description.length >= 70 && description.length <= 160

    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#0f1117] p-4 space-y-1 font-sans">
            <p className="text-[11px] text-nr-faint font-mono truncate">{url}</p>
            <p
                className={`text-sm font-medium truncate ${titleOk ? 'text-[#8ab4f8]' : 'text-nr-red'}`}
            >
                {displayTitle}
            </p>
            <p
                className={`text-xs leading-relaxed line-clamp-2 ${descOk ? 'text-nr-faint' : 'text-nr-red/70'}`}
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
        category_id: post?.category?.id?.toString() ?? '',
        status: (post?.status ?? 'draft') as Post['status'],
        lang: (post?.lang ?? 'es') as Post['lang'],
        featured: post?.featured ?? false,
        allow_comments: post?.allow_comments ?? true,
        indexable: post?.indexable ?? true,
        published_at: post?.published_at ?? '',
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
                headers: xsrf ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrf) } : {},
                body: form,
            })
            const json = await res.json()
            if (json.url) set('cover_image', json.url)
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
        if (!isNew) {
            router.post(`/admin/posts/${post!.id}/publish`)
            return
        }
        const payload = { ...buildPayload(), status: 'published' as const }
        router.post('/admin/posts', payload)
    }

    const handleDuplicate = () => {
        if (!post) return
        router.post(`/admin/posts/${post.id}/duplicate`)
    }

    return (
        <AdminLayout title={isNew ? 'Nuevo artículo' : 'Editar artículo'}>
            <Head title={isNew ? 'Admin — Nuevo artículo' : `Admin — ${post?.title}`} />

            <div className="space-y-6 max-w-5xl">
                {/* Actions bar */}
                <div className="flex items-center gap-3 justify-end">
                    {!isNew && (
                        <button
                            type="button"
                            onClick={handleDuplicate}
                            className="px-4 py-2 glass rounded-lg text-xs text-nr-faint
                                           hover:text-nr-muted transition-colors"
                        >
                            Duplicar
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="px-4 py-2 glass rounded-lg text-sm text-nr-muted
                                       hover:text-nr-text transition-colors"
                    >
                        Guardar borrador
                    </button>
                    <button
                        type="button"
                        onClick={handlePublish}
                        className="px-6 py-2 rounded-lg text-sm font-semibold text-white
                                       bg-gradient-to-r from-nr-accent to-[#6d58f0]
                                       hover:-translate-y-0.5 transition-all duration-200"
                    >
                        {post?.status === 'published' ? 'Actualizar' : 'Publicar'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Content tabs */}
                        <div className="glass rounded-2xl overflow-hidden">
                            {/* Tab switcher */}
                            {data.lang === 'both' && (
                                <div className="flex border-b border-white/[0.06]">
                                    {(['es', 'en'] as const).map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setTab(t)}
                                            className={`px-5 py-3 text-sm font-medium transition-colors
                                                    ${
                                                        tab === t
                                                            ? 'text-nr-text border-b-2 border-nr-accent -mb-px'
                                                            : 'text-nr-faint hover:text-nr-muted'
                                                    }`}
                                        >
                                            {t === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="p-6 space-y-4">
                                {/* Title ES */}
                                {(data.lang !== 'en' || tab === 'es') && (
                                    <div
                                        className={
                                            data.lang === 'both' && tab !== 'es' ? 'hidden' : ''
                                        }
                                    >
                                        <label className="text-xs text-nr-faint uppercase tracking-wider block mb-1.5">
                                            Título (ES)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={e => handleTitleChange(e.target.value)}
                                            className="w-full px-3 py-2.5 glass rounded-lg text-sm text-nr-text
                                                          border border-white/[0.08] focus:border-nr-accent/50
                                                          outline-none transition-colors text-base font-medium"
                                            placeholder="Título del artículo"
                                        />
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={e => set('slug', e.target.value)}
                                            className="mt-1.5 w-full px-3 py-1.5 glass rounded-lg text-xs
                                                          text-nr-faint font-mono border border-white/[0.05]
                                                          focus:border-nr-accent/30 outline-none"
                                            placeholder="slug-del-articulo"
                                        />
                                    </div>
                                )}

                                {/* Title EN */}
                                {(data.lang === 'en' || (data.lang === 'both' && tab === 'en')) && (
                                    <div>
                                        <label className="text-xs text-nr-faint uppercase tracking-wider block mb-1.5">
                                            Title (EN)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title_en}
                                            onChange={e => handleTitleEnChange(e.target.value)}
                                            className="w-full px-3 py-2.5 glass rounded-lg text-sm text-nr-text
                                                          border border-white/[0.08] focus:border-nr-accent/50
                                                          outline-none transition-colors text-base font-medium"
                                            placeholder="Article title in English"
                                        />
                                        <input
                                            type="text"
                                            value={data.slug_en}
                                            onChange={e => set('slug_en', e.target.value)}
                                            className="mt-1.5 w-full px-3 py-1.5 glass rounded-lg text-xs
                                                          text-nr-faint font-mono border border-white/[0.05]
                                                          focus:border-nr-accent/30 outline-none"
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
                                            <label className="text-xs text-nr-faint uppercase tracking-wider block mb-1.5">
                                                Excerpt (ES)
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={data.excerpt}
                                                onChange={e => set('excerpt', e.target.value)}
                                                className="w-full px-3 py-2.5 glass rounded-lg text-sm text-nr-text
                                                                 border border-white/[0.08] focus:border-nr-accent/50
                                                                 outline-none transition-colors resize-none"
                                                placeholder="Resumen breve..."
                                            />
                                        </>
                                    )}
                                </div>
                                {(data.lang === 'en' || (data.lang === 'both' && tab === 'en')) && (
                                    <div>
                                        <label className="text-xs text-nr-faint uppercase tracking-wider block mb-1.5">
                                            Excerpt (EN)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={data.excerpt_en}
                                            onChange={e => set('excerpt_en', e.target.value)}
                                            className="w-full px-3 py-2.5 glass rounded-lg text-sm text-nr-text
                                                             border border-white/[0.08] focus:border-nr-accent/50
                                                             outline-none transition-colors resize-none"
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
                                            <label className="text-xs text-nr-faint uppercase tracking-wider block mb-1.5">
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
                                        <label className="text-xs text-nr-faint uppercase tracking-wider block mb-1.5">
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
                        <div className="glass rounded-2xl overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setSeoOpen(o => !o)}
                                className="w-full flex items-center justify-between px-6 py-4
                                               text-sm font-semibold text-nr-text hover:text-nr-accent
                                               transition-colors"
                            >
                                <span>SEO & Meta</span>
                                <span className="text-nr-faint text-xs">{seoOpen ? '▲' : '▼'}</span>
                            </button>

                            {seoOpen && (
                                <div className="px-6 pb-6 space-y-4 border-t border-white/[0.06] pt-4">
                                    <div>
                                        <label className="text-xs text-nr-faint uppercase tracking-wider block mb-1.5">
                                            Meta título ({data.meta_title.length}/70)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.meta_title}
                                            onChange={e => set('meta_title', e.target.value)}
                                            maxLength={70}
                                            className="w-full px-3 py-2.5 glass rounded-lg text-sm text-nr-text
                                                          border border-white/[0.08] focus:border-nr-accent/50
                                                          outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-nr-faint uppercase tracking-wider block mb-1.5">
                                            Meta descripción ({data.meta_description.length}/160)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={data.meta_description}
                                            onChange={e => set('meta_description', e.target.value)}
                                            maxLength={160}
                                            className="w-full px-3 py-2.5 glass rounded-lg text-sm text-nr-text
                                                             border border-white/[0.08] focus:border-nr-accent/50
                                                             outline-none transition-colors resize-none"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-nr-faint uppercase tracking-wider mb-2">
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
                        <div className="glass rounded-2xl p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-nr-text">Publicación</h3>

                            <div>
                                <label className="text-xs text-nr-faint block mb-1.5">Estado</label>
                                <select
                                    value={data.status}
                                    onChange={e => set('status', e.target.value as Post['status'])}
                                    className="w-full px-3 py-2 glass rounded-lg text-sm text-nr-muted
                                                   border border-white/[0.08] outline-none bg-transparent"
                                >
                                    {STATUS_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-nr-faint block mb-1.5">Idioma</label>
                                <select
                                    value={data.lang}
                                    onChange={e => set('lang', e.target.value as Post['lang'])}
                                    className="w-full px-3 py-2 glass rounded-lg text-sm text-nr-muted
                                                   border border-white/[0.08] outline-none bg-transparent"
                                >
                                    {LANG_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-nr-faint block mb-1.5">
                                    Categoría
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={e => set('category_id', e.target.value)}
                                    className="w-full px-3 py-2 glass rounded-lg text-sm text-nr-muted
                                                   border border-white/[0.08] outline-none bg-transparent"
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
                                <label className="text-xs text-nr-faint block mb-1.5">
                                    Fecha publicación
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={e => set('published_at', e.target.value)}
                                    className="w-full px-3 py-2 glass rounded-lg text-sm text-nr-muted
                                                  border border-white/[0.08] outline-none bg-transparent
                                                  [color-scheme:dark]"
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
                        <div className="glass rounded-2xl p-5 space-y-3">
                            <h3 className="text-sm font-semibold text-nr-text">Portada</h3>
                            {data.cover_image && (
                                <img
                                    src={data.cover_image}
                                    alt="Portada"
                                    className="w-full rounded-lg object-cover max-h-36"
                                />
                            )}
                            <input
                                type="text"
                                value={data.cover_image}
                                onChange={e => set('cover_image', e.target.value)}
                                placeholder="URL de la imagen"
                                className="w-full px-3 py-2 glass rounded-lg text-xs text-nr-text
                                              border border-white/[0.08] focus:border-nr-accent/50
                                              outline-none transition-colors"
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
                                className="w-full py-2 glass rounded-lg text-xs text-nr-faint
                                               hover:text-nr-muted transition-colors disabled:opacity-50"
                            >
                                {uploading ? 'Subiendo...' : '↑ Subir imagen'}
                            </button>
                        </div>

                        {/* Tags */}
                        <div className="glass rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-nr-text mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {tags.map(tag => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => toggleArrayItem('tags', tag.id)}
                                        className={`px-2.5 py-1 rounded-full text-xs transition-colors
                                                ${
                                                    (data.tags as number[]).includes(tag.id)
                                                        ? 'bg-nr-accent/20 border border-nr-accent/40 text-nr-accent'
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
                            <h3 className="text-sm font-semibold text-nr-text mb-3">Afiliados</h3>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                {affiliates.map(aff => (
                                    <label
                                        key={aff.id}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={(data.affiliates as number[]).includes(aff.id)}
                                            onChange={() => toggleArrayItem('affiliates', aff.id)}
                                            className="accent-nr-accent w-3.5 h-3.5"
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
        </AdminLayout>
    )
}

function getCookie(name: string) {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
}
