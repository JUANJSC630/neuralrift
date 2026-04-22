import AdminLayout from '@/Components/Layout/AdminLayout'
import { Head, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Category, Affiliate } from '@/types'

interface Props {
    categories: Category[]
    affiliates: (Affiliate & { category: string })[]
}

type PostType = 'news' | 'tutorial' | 'review'
type Lang = 'es' | 'en' | 'both'
type Tone = 'tecnico' | 'accesible' | 'opinion'
type Level = 'basico' | 'intermedio' | 'avanzado'

const POST_TYPES = [
    {
        id: 'news' as PostType,
        label: 'Noticia',
        emoji: '📰',
        description: 'Cubre una noticia o novedad de la industria tech/IA',
        time: '~30 seg',
        words: '600-900 palabras',
    },
    {
        id: 'tutorial' as PostType,
        label: 'Tutorial',
        emoji: '📖',
        description: 'Guía técnica paso a paso sobre una tecnología o herramienta',
        time: '~60 seg',
        words: '1200-2000 palabras',
    },
    {
        id: 'review' as PostType,
        label: 'Review',
        emoji: '⭐',
        description: 'Análisis honesto de una herramienta o producto',
        time: '~45 seg',
        words: '1000-1500 palabras',
    },
]

const inputCls = `w-full bg-nr-bg border border-white/[0.08] rounded-xl px-4 py-3
                  text-sm text-nr-text outline-none focus:border-nr-accent/50
                  transition-colors placeholder-nr-faint/50`

const selectCls = `w-full bg-nr-bg border border-white/[0.08] rounded-xl px-4 py-3
                   text-sm text-nr-muted outline-none focus:border-nr-accent/50
                   transition-colors`

export default function AIGenerator({ categories, affiliates }: Props) {
    const [generating, setGenerating] = useState(false)

    const { data, setData, post, processing, errors } = useForm({
        post_type: 'tutorial' as PostType,
        topic: '',
        source_url: '',
        lang: 'es' as Lang,
        level: 'intermedio' as Level,
        tone: 'tecnico' as Tone,
        category_id: '',
        affiliate_id: '',
        personal_rating: '4.5',
        extra_notes: '',
    })

    const selectedType = POST_TYPES.find(t => t.id === data.post_type)!

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setGenerating(true)
        post('/admin/ai-generator/generate', {
            onFinish: () => setGenerating(false),
        })
    }

    return (
        <AdminLayout title="Generador IA">
            <Head title="Generador IA — Admin" />

            <div className="max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-nr-accent to-nr-cyan text-lg text-white">
                            ✧
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-bold text-nr-text">
                                Generador de Posts con IA
                            </h1>
                            <p className="mt-0.5 text-xs text-nr-faint">
                                Claude genera el borrador completo — tú revisas y publicas
                            </p>
                        </div>
                    </div>

                    {/* Aviso importante */}
                    <div className="glass mt-4 flex items-start gap-3 rounded-xl border border-nr-gold/20 p-4">
                        <span className="flex-shrink-0 text-sm text-nr-gold">⚠</span>
                        <p className="text-xs leading-relaxed text-nr-muted">
                            El borrador se guarda como{' '}
                            <strong className="text-nr-gold">"En revisión"</strong> y nunca se
                            publica automáticamente. Siempre revisa, ajusta y añade tu voz antes de
                            publicar. Recibirás una notificación cuando esté listo (~30-60
                            segundos).
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tipo de artículo */}
                    <div className="glass rounded-2xl p-6">
                        <label className="mb-4 block font-mono text-xs uppercase tracking-widest text-nr-faint">
                            Tipo de artículo
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {POST_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setData('post_type', type.id)}
                                    className={cn(
                                        'rounded-xl border p-4 text-left transition-all',
                                        data.post_type === type.id
                                            ? 'border-nr-accent/40 bg-nr-accent/15'
                                            : 'glass border-white/[0.08] hover:border-white/20',
                                    )}
                                >
                                    <div className="mb-2 text-2xl">{type.emoji}</div>
                                    <div
                                        className={cn(
                                            'mb-1 text-sm font-semibold',
                                            data.post_type === type.id
                                                ? 'text-nr-accent'
                                                : 'text-nr-text',
                                        )}
                                    >
                                        {type.label}
                                    </div>
                                    <div className="text-[10px] leading-relaxed text-nr-faint">
                                        {type.description}
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="rounded bg-nr-cyan/10 px-1.5 py-0.5 font-mono text-[9px] text-nr-cyan">
                                            {type.time}
                                        </span>
                                        <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-nr-faint">
                                            {type.words}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tema principal */}
                    <div className="glass rounded-2xl p-6">
                        <label className="mb-3 block font-mono text-xs uppercase tracking-widest text-nr-faint">
                            {data.post_type === 'news'
                                ? 'Tema o noticia a cubrir *'
                                : data.post_type === 'review'
                                  ? 'Herramienta a revisar *'
                                  : 'Tema del tutorial *'}
                        </label>
                        <textarea
                            value={data.topic}
                            onChange={e => setData('topic', e.target.value)}
                            rows={3}
                            placeholder={
                                data.post_type === 'news'
                                    ? 'Ej: OpenAI lanzó GPT-5 con capacidades multimodales avanzadas...'
                                    : data.post_type === 'review'
                                      ? 'Ej: Cursor AI — editor de código con IA integrada'
                                      : 'Ej: Cómo usar Laravel Queues para procesar tareas en segundo plano'
                            }
                            className={cn(inputCls, 'resize-none')}
                            required
                        />
                        {errors.topic && <p className="mt-1 text-xs text-nr-red">{errors.topic}</p>}

                        {/* URL fuente (solo para noticias) */}
                        {data.post_type === 'news' && (
                            <div className="mt-4">
                                <label className="mb-2 block text-xs text-nr-faint">
                                    URL de la fuente (opcional pero recomendado)
                                </label>
                                <input
                                    type="url"
                                    value={data.source_url}
                                    onChange={e => setData('source_url', e.target.value)}
                                    placeholder="https://openai.com/blog/..."
                                    className={inputCls}
                                />
                            </div>
                        )}

                        {/* Rating (solo para reviews) */}
                        {data.post_type === 'review' && (
                            <div className="mt-4">
                                <label className="mb-2 block text-xs text-nr-faint">
                                    Tu calificación personal (1-5)
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        step="0.5"
                                        value={data.personal_rating}
                                        onChange={e => setData('personal_rating', e.target.value)}
                                        className="flex-1 accent-nr-accent"
                                    />
                                    <span className="w-8 text-right font-mono font-bold text-nr-accent">
                                        {data.personal_rating}
                                    </span>
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span
                                                key={i}
                                                className={
                                                    i < Math.floor(parseFloat(data.personal_rating))
                                                        ? 'text-sm text-nr-gold'
                                                        : 'text-sm text-nr-faint'
                                                }
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Configuración */}
                    <div className="glass rounded-2xl p-6">
                        <label className="mb-4 block font-mono text-xs uppercase tracking-widest text-nr-faint">
                            Configuración
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Idioma */}
                            <div>
                                <label className="mb-2 block text-xs text-nr-faint">Idioma</label>
                                <select
                                    value={data.lang}
                                    onChange={e => setData('lang', e.target.value as Lang)}
                                    className={selectCls}
                                >
                                    <option value="es">🇪🇸 Solo español</option>
                                    <option value="en">🇺🇸 Solo inglés</option>
                                    <option value="both">🌎 Bilingüe (ES + EN)</option>
                                </select>
                            </div>

                            {/* Tono */}
                            <div>
                                <label className="mb-2 block text-xs text-nr-faint">Tono</label>
                                <select
                                    value={data.tone}
                                    onChange={e => setData('tone', e.target.value as Tone)}
                                    className={selectCls}
                                >
                                    <option value="tecnico">🔧 Técnico (análisis profundo)</option>
                                    <option value="accesible">
                                        💡 Accesible (explicación simple)
                                    </option>
                                    <option value="opinion">
                                        🎯 Opinión (punto de vista crítico)
                                    </option>
                                </select>
                            </div>

                            {/* Nivel (solo tutoriales) */}
                            {data.post_type === 'tutorial' && (
                                <div>
                                    <label className="mb-2 block text-xs text-nr-faint">
                                        Nivel
                                    </label>
                                    <select
                                        value={data.level}
                                        onChange={e => setData('level', e.target.value as Level)}
                                        className={selectCls}
                                    >
                                        <option value="basico">🟢 Básico</option>
                                        <option value="intermedio">🟡 Intermedio</option>
                                        <option value="avanzado">🔴 Avanzado</option>
                                    </select>
                                </div>
                            )}

                            {/* Categoría */}
                            <div>
                                <label className="mb-2 block text-xs text-nr-faint">
                                    Categoría sugerida
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)}
                                    className={selectCls}
                                >
                                    <option value="">Sin categoría</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Afiliado */}
                            <div className="col-span-2">
                                <label className="mb-2 block text-xs text-nr-faint">
                                    Mencionar herramienta afiliada (opcional)
                                </label>
                                <select
                                    value={data.affiliate_id}
                                    onChange={e => setData('affiliate_id', e.target.value)}
                                    className={selectCls}
                                >
                                    <option value="">Sin afiliado</option>
                                    {affiliates.map(aff => (
                                        <option key={aff.id} value={aff.id}>
                                            {aff.name} — {aff.category}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-[10px] text-nr-faint">
                                    Si seleccionas uno, Claude lo mencionará de forma natural en el
                                    contenido
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Notas adicionales */}
                    <div className="glass rounded-2xl p-6">
                        <label className="mb-3 block font-mono text-xs uppercase tracking-widest text-nr-faint">
                            Notas adicionales para Claude (opcional)
                        </label>
                        <textarea
                            value={data.extra_notes}
                            onChange={e => setData('extra_notes', e.target.value)}
                            rows={3}
                            placeholder="Ej: Enfocarse en el uso desde Colombia. Mencionar que la herramienta tiene plan gratuito. Evitar comparar con X competidor..."
                            className={cn(inputCls, 'resize-none text-sm')}
                            maxLength={1000}
                        />
                        <p className="mt-1 text-right text-[10px] text-nr-faint">
                            {data.extra_notes.length}/1000
                        </p>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing || generating || !data.topic.trim()}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-8 py-3.5 font-semibold',
                                'bg-gradient-to-r from-nr-accent to-nr-accent-dark text-white',
                                'glow-accent transition-all duration-200 hover:-translate-y-0.5',
                                'disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50',
                            )}
                        >
                            {processing || generating ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Generando borrador...
                                </>
                            ) : (
                                <>
                                    <span>✧</span>
                                    Generar borrador con IA
                                </>
                            )}
                        </button>

                        <div className="text-xs text-nr-faint">
                            <div>⏱ {selectedType.time} aprox.</div>
                            <div>{selectedType.words}</div>
                        </div>
                    </div>

                    {/* Info de costo */}
                    <div className="flex items-center gap-2 text-[10px] text-nr-faint">
                        <span className="text-nr-green">●</span>
                        Costo estimado por borrador: $0.02–0.05 USD vía API de Anthropic
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
