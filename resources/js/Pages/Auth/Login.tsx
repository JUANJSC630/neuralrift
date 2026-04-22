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

            <div className="min-h-screen bg-nr-bg flex items-center justify-center px-4 relative overflow-hidden">
                {/* Mesh background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `
                            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(124,106,247,0.18) 0%, transparent 60%),
                            radial-gradient(ellipse 50% 40% at 80% 75%, rgba(6,182,212,0.12) 0%, transparent 55%)
                         `,
                    }}
                />

                {/* Noise */}
                <div className="absolute inset-0 noise opacity-40 pointer-events-none" />

                <div className="relative w-full max-w-sm">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link
                            href="/"
                            className="font-display text-2xl font-black tracking-tight inline-block"
                        >
                            <span className="text-gradient">NeuralRift</span>
                        </Link>
                        <p className="text-nr-faint text-sm mt-2">Panel de administración</p>
                    </div>

                    {/* Card */}
                    <div
                        className="glass-strong rounded-2xl p-8 border border-white/[0.1]"
                        style={{
                            boxShadow:
                                '0 0 60px rgba(124,106,247,0.08), 0 24px 48px rgba(0,0,0,0.4)',
                        }}
                    >
                        {status && (
                            <div
                                className="mb-5 px-4 py-3 rounded-lg bg-nr-green/10 border border-nr-green/20
                                            text-sm text-nr-green"
                            >
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-xs font-medium text-nr-faint uppercase
                                                  tracking-wider mb-2"
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
                                    className="w-full px-4 py-3 glass rounded-xl text-sm text-nr-text
                                               border border-white/[0.08] focus:border-nr-accent/60
                                               outline-none transition-colors placeholder-nr-faint/40
                                               bg-transparent"
                                    placeholder="tu@email.com"
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-nr-red">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label
                                        htmlFor="password"
                                        className="text-xs font-medium text-nr-faint uppercase tracking-wider"
                                    >
                                        Contraseña
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs text-nr-accent hover:text-nr-accent/80
                                                         transition-colors"
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
                                    className="w-full px-4 py-3 glass rounded-xl text-sm text-nr-text
                                               border border-white/[0.08] focus:border-nr-accent/60
                                               outline-none transition-colors placeholder-nr-faint/40
                                               bg-transparent"
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-nr-red">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember */}
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <button
                                    type="button"
                                    role="checkbox"
                                    aria-checked={data.remember}
                                    onClick={() => setData('remember', !data.remember as false)}
                                    className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0
                                        ${data.remember ? 'bg-nr-accent' : 'bg-white/10'}`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full
                                                      bg-white transition-transform
                                                      ${data.remember ? 'translate-x-4' : ''}`}
                                    />
                                </button>
                                <span className="text-sm text-nr-muted">Recordar sesión</span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 rounded-xl text-sm font-semibold text-white
                                           bg-gradient-to-r from-nr-accent to-[#6d58f0]
                                           hover:-translate-y-0.5 transition-all duration-200
                                           disabled:opacity-50 disabled:translate-y-0
                                           shadow-lg shadow-nr-accent/20 mt-1"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span
                                            className="w-4 h-4 border-2 border-white/30 border-t-white
                                                         rounded-full animate-spin"
                                        />
                                        Accediendo...
                                    </span>
                                ) : (
                                    'Acceder al panel'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Back link */}
                    <p className="text-center mt-6 text-xs text-nr-faint">
                        <Link href="/" className="hover:text-nr-muted transition-colors">
                            ← Volver al sitio
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}
