import { useState } from 'react'
import { router } from '@inertiajs/react'
import { useLocale } from '@/hooks/useLocale'

interface NewsletterWidgetProps {
    compact?: boolean
}

export default function NewsletterWidget({ compact = false }: NewsletterWidgetProps) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { t } = useLocale()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setError(null)
        setLoading(true)
        router.post(
            '/newsletter/subscribe',
            { email, lang: document.documentElement.lang || 'es' },
            {
                onSuccess: () => {
                    setSent(true)
                    setLoading(false)
                },
                onError: () => {
                    setError(t('newsletter.error'))
                    setLoading(false)
                },
            },
        )
    }

    if (compact) {
        return (
            <div className="glass rounded-2xl p-5">
                <p className="mb-1 text-sm font-semibold text-nr-text">{t('newsletter.label')}</p>
                <p className="mb-3 text-xs text-nr-faint">{t('newsletter.subtitle')}</p>
                {sent ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-nr-green">
                        <span aria-hidden="true">✓</span>
                        <span>{t('newsletter.success')}</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <label htmlFor="newsletter-compact-email" className="sr-only">
                            Email
                        </label>
                        <input
                            id="newsletter-compact-email"
                            type="email"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value)
                                setError(null)
                            }}
                            placeholder={t('newsletter.placeholder')}
                            required
                            className="glass w-full rounded-lg px-3 py-3 text-sm text-nr-text placeholder-nr-faint outline-none transition-colors focus:border-nr-accent/50"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-gradient-to-r from-nr-accent to-nr-accent-dark py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                        >
                            {loading ? t('newsletter.sending') : t('newsletter.submit')}
                        </button>
                    </form>
                )}
                {error && (
                    <p role="alert" className="mt-2 text-xs text-red-400">
                        {error}
                    </p>
                )}
            </div>
        )
    }

    return (
        <div className="glass rounded-3xl p-6 text-center sm:p-8 md:p-14">
            <div>
                <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-nr-accent">
                    {t('newsletter.label')}
                </span>
                <h2 className="mb-3 font-display text-3xl font-bold leading-tight text-nr-text md:text-4xl">
                    {t('newsletter.title_1')}
                    <br />
                    <span className="text-nr-accent">{t('newsletter.title_2')}</span>
                </h2>
                <p className="mx-auto mb-8 max-w-[55ch] text-sm leading-[1.7] text-nr-muted md:text-base">
                    {t('newsletter.subtitle')}
                </p>

                {/* Beneficios */}
                <div className="mb-8 flex flex-wrap justify-center gap-4">
                    {[
                        t('newsletter.benefit_1'),
                        t('newsletter.benefit_2'),
                        t('newsletter.benefit_3'),
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
                        <span>{t('newsletter.success')}</span>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
                    >
                        <label htmlFor="newsletter-email" className="sr-only">
                            Email
                        </label>
                        <input
                            id="newsletter-email"
                            type="email"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value)
                                setError(null)
                            }}
                            placeholder={t('newsletter.placeholder')}
                            required
                            aria-describedby={error ? 'newsletter-error' : undefined}
                            className="glass flex-1 rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-nr-text placeholder-nr-faint outline-none transition-colors focus:border-nr-accent/50"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="glow-accent hover:glow-accent-lg whitespace-nowrap rounded-xl bg-gradient-to-r from-nr-accent to-nr-accent-dark px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? t('newsletter.sending') : t('newsletter.submit')}
                        </button>
                    </form>
                )}
                {error && (
                    <p id="newsletter-error" role="alert" className="mt-2 text-xs text-red-400">
                        {error}
                    </p>
                )}

                <p className="mt-4 text-xs text-nr-faint">{t('newsletter.no_spam')}</p>
            </div>
        </div>
    )
}
