import { useState } from 'react'
import { router } from '@inertiajs/react'

export default function NewsletterWidget() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setError(null)
        setLoading(true)
        router.post(
            '/newsletter/subscribe',
            { email },
            {
                onSuccess: () => {
                    setSent(true)
                    setLoading(false)
                },
                onError: () => {
                    setError('Algo salió mal. Intenta de nuevo.')
                    setLoading(false)
                },
            },
        )
    }

    return (
        <div className="glass rounded-3xl p-10 text-center md:p-14">
            <div>
                <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-nr-accent">
                    Newsletter gratuita
                </span>
                <h2 className="mb-3 font-display text-3xl font-bold leading-tight text-nr-text md:text-4xl">
                    La IA no espera.
                    <br />
                    <span className="text-nr-accent">Tú tampoco deberías.</span>
                </h2>
                <p className="mx-auto mb-8 max-w-[55ch] text-sm leading-[1.7] text-nr-muted md:text-base">
                    Cada semana: un artículo en profundidad, una herramienta que vale la pena y una
                    estrategia que puedes aplicar hoy. Sin spam.
                </p>

                {/* Beneficios */}
                <div className="mb-8 flex flex-wrap justify-center gap-4">
                    {[
                        '📖 1 artículo semanal',
                        '🛠 Herramientas IA',
                        '💰 Estrategias de monetización',
                    ].map(b => (
                        <span
                            key={b}
                            className="rounded-full border border-white/[0.10] px-3 py-1.5 text-xs text-nr-muted"
                        >
                            {b}
                        </span>
                    ))}
                </div>

                {sent ? (
                    <div className="flex items-center justify-center gap-2 font-medium text-nr-green">
                        <span aria-hidden="true">✓</span>
                        <span>¡Genial! Revisa tu email para confirmar.</span>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
                    >
                        <label htmlFor="newsletter-email" className="sr-only">
                            Tu dirección de email
                        </label>
                        <input
                            id="newsletter-email"
                            type="email"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value)
                                setError(null)
                            }}
                            placeholder="tu@email.com"
                            required
                            aria-describedby={error ? 'newsletter-error' : undefined}
                            className="glass flex-1 rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-nr-text placeholder-nr-faint outline-none transition-colors focus:border-nr-accent/50"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="glow-accent hover:glow-accent-lg whitespace-nowrap rounded-xl bg-gradient-to-r from-nr-accent to-nr-accent-dark px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Enviando...' : 'Suscribirme →'}
                        </button>
                    </form>
                )}
                {error && (
                    <p id="newsletter-error" role="alert" className="mt-2 text-xs text-red-400">
                        {error}
                    </p>
                )}

                <p className="mt-4 text-xs text-nr-faint">Sin spam. Baja cuando quieras.</p>
            </div>
        </div>
    )
}
