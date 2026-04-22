import { Head, Link, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import CustomCursor from '@/Components/Layout/CustomCursor'

export default function ResetPassword({ token, email }: { token: string; email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    })

    const submit: FormEventHandler = e => {
        e.preventDefault()
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        })
    }

    return (
        <>
            <Head title="Nueva contraseña — NeuralRift" />
            <CustomCursor />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-nr-bg px-4">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(124,106,247,0.18) 0%, transparent 60%),
                            radial-gradient(ellipse 50% 40% at 80% 75%, rgba(6,182,212,0.12) 0%, transparent 55%)
                        `,
                    }}
                />
                <div className="noise pointer-events-none absolute inset-0 opacity-40" />

                <div className="relative w-full max-w-sm">
                    <div className="mb-8 text-center">
                        <Link
                            href="/"
                            className="inline-block font-display text-2xl font-black tracking-tight"
                        >
                            <span className="text-gradient">NeuralRift</span>
                        </Link>
                        <p className="mt-2 text-sm text-nr-faint">Panel de administración</p>
                    </div>

                    <div
                        className="glass-strong rounded-2xl border border-white/[0.1] p-8"
                        style={{
                            boxShadow:
                                '0 0 60px rgba(124,106,247,0.08), 0 24px 48px rgba(0,0,0,0.4)',
                        }}
                    >
                        <h1 className="mb-6 font-display text-xl font-bold text-nr-text">
                            Nueva contraseña
                        </h1>

                        <form onSubmit={submit} className="space-y-5">
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
                                    onChange={e => setData('email', e.target.value)}
                                    className="glass w-full rounded-xl bg-transparent px-4 py-3 text-sm text-nr-text placeholder-nr-faint/40 outline-none transition-colors focus:border-nr-accent/60"
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-nr-red">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-xs font-medium uppercase tracking-wider text-nr-faint"
                                >
                                    Nueva contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    autoComplete="new-password"
                                    autoFocus
                                    onChange={e => setData('password', e.target.value)}
                                    className="glass w-full rounded-xl bg-transparent px-4 py-3 text-sm text-nr-text placeholder-nr-faint/40 outline-none transition-colors focus:border-nr-accent/60"
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-nr-red">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="mb-2 block text-xs font-medium uppercase tracking-wider text-nr-faint"
                                >
                                    Confirmar contraseña
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    autoComplete="new-password"
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="glass w-full rounded-xl bg-transparent px-4 py-3 text-sm text-nr-text placeholder-nr-faint/40 outline-none transition-colors focus:border-nr-accent/60"
                                    placeholder="••••••••"
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1.5 text-xs text-nr-red">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-1 w-full rounded-xl bg-gradient-to-r from-nr-accent to-nr-accent-dark py-3 text-sm font-semibold text-white shadow-lg shadow-nr-accent/20 transition-all duration-200 will-change-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Guardando...
                                    </span>
                                ) : (
                                    'Restablecer contraseña'
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-xs text-nr-faint">
                        <Link
                            href={route('login')}
                            className="transition-colors hover:text-nr-muted"
                        >
                            ← Volver al inicio de sesión
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}
