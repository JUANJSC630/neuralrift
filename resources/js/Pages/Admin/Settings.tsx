import AdminLayout from '@/Components/Layout/AdminLayout'
import { Head, useForm } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

interface Props {
    settings: {
        site_name: string
        site_description: string
        twitter: string
        analytics_id: string
    }
    user: User
}

function Field({
    label,
    error,
    children,
}: {
    label: string
    error?: string
    children: React.ReactNode
}) {
    return (
        <div>
            <label className="text-xs font-mono text-nr-faint uppercase tracking-wider block mb-2">
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-nr-red mt-1">{error}</p>}
        </div>
    )
}

const inputCls = `w-full bg-nr-bg2 border border-white/[0.08] rounded-xl px-4 py-2.5
                  text-sm text-nr-text outline-none focus:border-nr-accent/40
                  transition-colors placeholder-nr-faint/40`

export default function Settings({ settings, user }: Props) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: user.name ?? '',
        bio: user.bio ?? '',
        twitter: user.twitter ?? '',
        linkedin: user.linkedin ?? '',
        website: user.website ?? '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/admin/settings')
    }

    return (
        <AdminLayout title="Ajustes">
            <Head title="Ajustes — Admin" />

            <div className="max-w-2xl">
                {/* Author profile */}
                <div className="glass rounded-2xl p-6 mb-6">
                    <h2 className="font-semibold text-nr-text mb-5 pb-4 border-b border-white/[0.05]">
                        Perfil del autor
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Avatar */}
                        <div className="flex items-center gap-5">
                            <div
                                className="w-16 h-16 rounded-full bg-gradient-to-br
                                            from-nr-accent to-nr-cyan flex items-center
                                            justify-center text-2xl font-bold text-white flex-shrink-0"
                            >
                                {data.name[0] ?? 'A'}
                            </div>
                            <div>
                                <p className="text-sm text-nr-text font-medium">{data.name}</p>
                                <p className="text-xs text-nr-faint mt-0.5">Admin</p>
                                <button
                                    type="button"
                                    className="text-xs text-nr-accent hover:text-nr-accent/80
                                                   transition-colors mt-1"
                                >
                                    Cambiar foto (próximamente)
                                </button>
                            </div>
                        </div>

                        <Field label="Nombre completo" error={errors.name}>
                            <input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={inputCls}
                                placeholder="Tu nombre"
                            />
                        </Field>

                        <Field label="Bio" error={errors.bio}>
                            <textarea
                                value={data.bio}
                                onChange={e => setData('bio', e.target.value)}
                                rows={3}
                                className={cn(inputCls, 'resize-none')}
                                placeholder="Una descripción corta sobre ti..."
                            />
                            <p className="text-[10px] text-nr-faint mt-1">
                                {data.bio.length}/500 caracteres
                            </p>
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Twitter/X" error={errors.twitter}>
                                <div className="relative">
                                    <span
                                        className="absolute left-3 top-1/2 -translate-y-1/2
                                                     text-xs text-nr-faint font-mono"
                                    >
                                        @
                                    </span>
                                    <input
                                        value={data.twitter}
                                        onChange={e => setData('twitter', e.target.value)}
                                        className={cn(inputCls, 'pl-7')}
                                        placeholder="usuario"
                                    />
                                </div>
                            </Field>

                            <Field label="Website" error={errors.website}>
                                <input
                                    value={data.website}
                                    onChange={e => setData('website', e.target.value)}
                                    className={inputCls}
                                    placeholder="https://..."
                                />
                            </Field>
                        </div>

                        <Field label="LinkedIn" error={errors.linkedin}>
                            <input
                                value={data.linkedin}
                                onChange={e => setData('linkedin', e.target.value)}
                                className={inputCls}
                                placeholder="https://linkedin.com/in/..."
                            />
                        </Field>

                        <div className="flex items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white
                                               bg-gradient-to-r from-nr-accent to-[#6d58f0]
                                               glow-accent hover:-translate-y-0.5 transition-all
                                               disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                            {recentlySuccessful && (
                                <span className="text-xs text-nr-green">
                                    ✓ Guardado correctamente
                                </span>
                            )}
                        </div>
                    </form>
                </div>

                {/* Site info — read only */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="font-semibold text-nr-text mb-1">Información del sitio</h2>
                    <p className="text-xs text-nr-faint mb-5">
                        Configurable desde el archivo{' '}
                        <code className="font-mono text-nr-accent">.env</code>
                    </p>

                    <div className="space-y-3">
                        {[
                            { label: 'Nombre del sitio', value: settings.site_name },
                            { label: 'Twitter', value: settings.twitter },
                            {
                                label: 'Google Analytics',
                                value: settings.analytics_id || 'No configurado',
                            },
                        ].map(item => (
                            <div
                                key={item.label}
                                className="flex items-center justify-between py-2.5
                                            border-b border-white/[0.04] last:border-0"
                            >
                                <span className="text-xs text-nr-faint">{item.label}</span>
                                <span className="text-xs font-mono text-nr-muted">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 p-4 bg-nr-bg rounded-xl border border-white/[0.05]">
                        <p className="text-[10px] font-mono text-nr-faint mb-2">
                            Variables recomendadas en .env:
                        </p>
                        <pre className="text-[10px] font-mono text-nr-muted leading-relaxed">{`SITE_DESCRIPTION="El futuro de la IA..."
SITE_TWITTER="@neuralrift"
ANALYTICS_ID="G-XXXXXXXXXX"`}</pre>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
