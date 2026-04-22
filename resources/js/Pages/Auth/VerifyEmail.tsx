import { Head, Link, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import CustomCursor from '@/Components/Layout/CustomCursor'

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({})

    const submit: FormEventHandler = e => {
        e.preventDefault()
        post(route('verification.send'))
    }

    return (
        <>
            <Head title="Verificar correo — NeuralRift" />
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
                        <h1 className="mb-1 font-display text-xl font-bold text-nr-text">
                            Verifica tu correo
                        </h1>
                        <p className="mb-6 text-sm leading-relaxed text-nr-faint">
                            Haz clic en el enlace que te enviamos para activar tu cuenta. Si no lo
                            recibiste, podemos enviarte otro.
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mb-5 rounded-lg border border-nr-green/20 bg-nr-green/10 px-4 py-3 text-sm text-nr-green">
                                Enlace de verificación enviado. Revisa tu bandeja de entrada.
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-gradient-to-r from-nr-accent to-nr-accent-dark py-3 text-sm font-semibold text-white shadow-lg shadow-nr-accent/20 transition-all duration-200 will-change-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Enviando...
                                    </span>
                                ) : (
                                    'Reenviar verificación'
                                )}
                            </button>
                        </form>

                        <div className="mt-3">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex w-full items-center justify-center rounded-xl border border-white/[0.1] py-3 text-sm text-nr-faint transition-colors hover:border-white/20 hover:text-nr-muted"
                            >
                                Cerrar sesión
                            </Link>
                        </div>
                    </div>

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
