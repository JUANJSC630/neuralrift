import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useLocale } from '@/hooks/useLocale'

interface Props {
    url: string
    title: string
    className?: string
}

export default function ShareButtons({ url, title, className }: Props) {
    const [copied, setCopied] = useState(false)
    const { t } = useLocale()

    const encoded = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)

    const copyLink = async () => {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const links = [
        {
            label: 'Twitter',
            icon: '𝕏',
            href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
        },
        {
            label: 'LinkedIn',
            icon: 'in',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
        },
        {
            label: 'WhatsApp',
            icon: '✉',
            href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}`,
        },
    ]

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {links.map(link => (
                <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass flex h-11 w-11 items-center justify-center rounded-lg text-xs font-bold text-nr-faint transition-colors hover:border-nr-accent/30 hover:text-nr-accent"
                    aria-label={`${t('share.share_on')} ${link.label}`}
                >
                    {link.icon}
                </a>
            ))}
            <button
                onClick={copyLink}
                className="glass flex h-11 w-11 items-center justify-center rounded-lg text-xs text-nr-faint transition-colors hover:border-nr-accent/30 hover:text-nr-accent"
                aria-label={t('share.copy_link')}
            >
                {copied ? '✓' : '⎘'}
            </button>
        </div>
    )
}
