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
        <div
            className="glass rounded-3xl p-10 md:p-14 text-center"
        >
            <div>
                <span
                    className="text-xs font-mono text-nr-accent tracking-widest
                                 uppercase block mb-4"
                >
                    Newsletter gratuita
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-nr-text leading-tight mb-3">
                    La IA no espera.
                    <br />
                    <span className="text-nr-accent">Tú tampoco deberías.</span>
                </h2>
                <p
                    className="text-nr-muted text-sm md:text-base leading-[1.7]
                              max-w-[55ch] mx-auto mb-8"
                >
                    Cada semana: un artículo en profundidad, una herramienta que vale la pena y una
                    estrategia que puedes aplicar hoy. Sin spam.
                </p>

                {/* Beneficios */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {[
                        '📖 1 artículo semanal',
                        '🛠 Herramientas IA',
                        '💰 Estrategias de monetización',
                    ].map(b => (
                        <span
                            key={b}
                            className="text-xs text-nr-muted px-3 py-1.5 rounded-full
                                                 border border-white/[0.10]"
                        >
                            {b}
                        </span>
                    ))}
                </div>

                {sent ? (
                    <div className="flex items-center justify-center gap-2 text-nr-green font-medium">
                        <span aria-hidden="true">✓</span>
                        <span>¡Genial! Revisa tu email para confirmar.</span>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
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
                            className="flex-1 px-4 py-3 glass rounded-xl text-sm text-nr-text
                                       placeholder-nr-faint outline-none border border-white/[0.08]
                                       focus:border-nr-accent/50 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 rounded-xl font-semibold text-sm text-white
                                       bg-gradient-to-r from-nr-accent to-nr-accent-dark
                                       glow-accent hover:glow-accent-lg hover:-translate-y-0.5
                                       transition-all duration-300 disabled:opacity-60
                                       disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {loading ? 'Enviando...' : 'Suscribirme →'}
                        </button>
                    </form>
                )}
                {error && (
                    <p id="newsletter-error" role="alert" className="text-xs text-red-400 mt-2">
                        {error}
                    </p>
                )}

                <p className="text-xs text-nr-faint mt-4">Sin spam. Baja cuando quieras.</p>
            </div>
        </div>
    )
}
