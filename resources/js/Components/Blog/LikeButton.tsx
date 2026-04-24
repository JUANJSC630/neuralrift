import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useLocale } from '@/hooks/useLocale'

interface Props {
    postId: number
    initialCount: number
    size?: 'sm' | 'lg'
}

const STORAGE_KEY = 'nr_liked_posts'

function getLiked(): number[] {
    if (typeof window === 'undefined') return []
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    } catch {
        return []
    }
}

function setLiked(ids: number[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export default function LikeButton({ postId, initialCount, size = 'sm' }: Props) {
    const { t, locale } = useLocale()
    const [liked, setLikedState] = useState(() =>
        typeof window !== 'undefined' ? getLiked().includes(postId) : false,
    )
    const [count, setCount] = useState(initialCount)
    const [loading, setLoading] = useState(false)
    const [burst, setBurst] = useState(false)

    const getXsrf = () => {
        const match = document.cookie.match(/(^|;\s*)XSRF-TOKEN=([^;]+)/)
        return match ? decodeURIComponent(match[2]) : ''
    }

    const toggle = async () => {
        if (loading) return
        setLoading(true)

        const willLike = !liked
        const optimisticCount = willLike ? count + 1 : Math.max(0, count - 1)

        // Optimistic update
        setLikedState(willLike)
        setCount(optimisticCount)
        if (willLike) setBurst(true)

        const ids = getLiked()
        setLiked(willLike ? [...ids, postId] : ids.filter(id => id !== postId))

        try {
            const res = await fetch(`/api/posts/${postId}/like`, {
                method: willLike ? 'POST' : 'DELETE',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getXsrf(),
                },
            })
            if (res.ok) {
                const data = await res.json()
                setCount(data.likes_count)
            } else {
                // Revert on error
                setLikedState(!willLike)
                setCount(count)
                setLiked(!willLike ? [...ids, postId] : ids.filter(id => id !== postId))
            }
        } catch {
            setLikedState(!willLike)
            setCount(count)
        } finally {
            setLoading(false)
            setTimeout(() => setBurst(false), 600)
        }
    }

    if (size === 'lg') {
        return (
            <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-nr-faint">{t('post.like_cta')}</p>
                <motion.button
                    onClick={toggle}
                    disabled={loading}
                    whileTap={{ scale: 0.88 }}
                    className={cn(
                        'group relative flex items-center gap-2.5 rounded-2xl border px-6 py-3 text-sm font-semibold',
                        'transition-all duration-200 disabled:cursor-not-allowed',
                        liked
                            ? 'border-nr-red/40 bg-nr-red/10 text-nr-red hover:bg-nr-red/15'
                            : 'glass text-nr-muted hover:border-nr-red/30 hover:bg-nr-red/[0.07] hover:text-nr-red',
                    )}
                >
                    {/* Burst particles */}
                    <AnimatePresence>
                        {burst && (
                            <>
                                {[...Array(6)].map((_, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                        animate={{
                                            opacity: 0,
                                            scale: 1,
                                            x: Math.cos((i * Math.PI * 2) / 6) * 28,
                                            y: Math.sin((i * Math.PI * 2) / 6) * 28,
                                        }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                        className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-nr-red"
                                    />
                                ))}
                            </>
                        )}
                    </AnimatePresence>

                    <motion.span
                        animate={burst ? { scale: [1, 1.5, 1], rotate: [0, -15, 10, 0] } : {}}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="text-lg leading-none"
                    >
                        {liked ? '❤️' : '🤍'}
                    </motion.span>
                    <span>
                        {count.toLocaleString()}{' '}
                        <span className="font-normal text-nr-faint">{t('post.likes')}</span>
                    </span>
                </motion.button>
            </div>
        )
    }

    // sm — inline meta chip
    return (
        <motion.button
            onClick={toggle}
            disabled={loading}
            whileTap={{ scale: 0.85 }}
            className={cn(
                'flex items-center gap-1.5 rounded-lg px-2 py-0.5 font-mono text-xs transition-all duration-150',
                liked ? 'text-nr-red' : 'text-nr-faint hover:text-nr-red',
            )}
            title={liked ? 'Quitar me gusta' : 'Me gusta'}
        >
            <motion.span
                animate={burst ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="leading-none"
            >
                {liked ? '❤' : '♡'}
            </motion.span>
            <span>{count.toLocaleString()}</span>
        </motion.button>
    )
}
