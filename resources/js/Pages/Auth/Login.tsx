import { Head, Link, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string
    canResetPassword: boolean
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    })

    const submit: FormEventHandler = e => {
        e.preventDefault()
        post(route('login'), { onFinish: () => reset('password') })
    }

    return (
        <>
            <Head title="Acceder — NeuralRift" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-nr-bg px-4">
                {/* Mesh background */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(124,106,247,0.18) 0%, transparent 60%),
                            radial-gradient(ellipse 50% 40% at 80% 75%, rgba(6,182,212,0.12) 0%, transparent 55%)
                         `,
                    }}
                />

                {/* Noise */}
                <div className="noise pointer-events-none absolute inset-0 opacity-40" />

                <div className="relative w-full max-w-sm">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <Link
                            href="/"
                            className="inline-block font-display text-2xl font-black tracking-tight"
                        >
                            <span className="text-gradient">NeuralRift</span>
                        </Link>
                        <p className="mt-2 text-sm text-nr-faint">Panel de administración</p>
                    </div>

                    {/* Card */}
                    <div
                        className="glass-strong rounded-2xl border border-white/[0.1] p-8"
                        style={{
                            boxShadow:
                                '0 0 60px rgba(124,106,247,0.08), 0 24px 48px rgba(0,0,0,0.4)',
                        }}
                    >
                        {status && (
                            <div className="mb-5 rounded-lg border border-nr-green/20 bg-nr-green/10 px-4 py-3 text-sm text-nr-green">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-xs font-medium uppercase tracking-wider text-nr-faint"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    onChange={e => setData('email', e.target.value)}
                                    className="glass w-full rounded-xl border border-white/[0.08] bg-transparent px-4 py-3 text-sm text-nr-text placeholder-nr-faint/40 outline-none transition-colors focus:border-nr-accent/60"
                                    placeholder="tu@email.com"
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-nr-red">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="text-xs font-medium uppercase tracking-wider text-nr-faint"
                                    >
                                        Contraseña
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs text-nr-accent transition-colors hover:text-nr-accent/80"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    )}
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={e => setData('password', e.target.value)}
                                    className="glass w-full rounded-xl border border-white/[0.08] bg-transparent px-4 py-3 text-sm text-nr-text placeholder-nr-faint/40 outline-none transition-colors focus:border-nr-accent/60"
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-nr-red">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember */}
                            <label className="flex cursor-pointer select-none items-center gap-3">
                                <button
                                    type="button"
                                    role="checkbox"
                                    aria-checked={data.remember}
                                    onClick={() => setData('remember', !data.remember as false)}
                                    className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${data.remember ? 'bg-nr-accent' : 'bg-white/10'}`}
                                >
                                    <span
                                        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${data.remember ? 'translate-x-4' : ''}`}
                                    />
                                </button>
                                <span className="text-sm text-nr-muted">Recordar sesión</span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-1 w-full rounded-xl bg-gradient-to-r from-nr-accent to-[#6d58f0] py-3 text-sm font-semibold text-white shadow-lg shadow-nr-accent/20 transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Accediendo...
                                    </span>
                                ) : (
                                    'Acceder al panel'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Back link */}
                    <p className="mt-6 text-center text-xs text-nr-faint">
                        <Link href="/" className="transition-colors hover:text-nr-muted">
                            ← Volver al sitio
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}
