import { Link, usePage } from '@inertiajs/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ADMIN_NAV } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { PageProps } from '@/types'

/* ── Toast notification type ─────────────────────────── */
interface Toast {
    id: string
    type: 'success' | 'error'
    message: string
    editUrl?: string | null
}

interface Props {
    children: React.ReactNode
    title?: string
}

export default function AdminLayout({ children, title }: Props) {
    const { auth, flash } = usePage<PageProps>().props
    const [collapsed, setCollapsed] = useState(false)
    const [toasts, setToasts] = useState<Toast[]>([])
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Persist seen IDs in sessionStorage so Inertia SPA navigations don't re-show toasts
    const seenIdsRef = useRef<Set<string>>(new Set(
        typeof window !== 'undefined'
            ? JSON.parse(sessionStorage.getItem('nr_seen_notif') ?? '[]')
            : []
    ))

    const markSeen = (id: string) => {
        seenIdsRef.current.add(id)
        sessionStorage.setItem('nr_seen_notif', JSON.stringify([...seenIdsRef.current]))
    }

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

    /* ── Remove toast after delay ─────────────────────── */
    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const addToast = useCallback(
        (toast: Toast) => {
            setToasts(prev => [...prev, toast])
            setTimeout(() => removeToast(toast.id), 8000)
        },
        [removeToast],
    )

    // Flash → toast (auto-dismiss)
    const flashRef = useRef<string | null>(null)
    useEffect(() => {
        if (flash?.success && flash.success !== flashRef.current) {
            flashRef.current = flash.success
            addToast({ id: `flash-${Date.now()}`, type: 'success', message: flash.success })
        }
        if (flash?.error && flash.error !== flashRef.current) {
            flashRef.current = flash.error
            addToast({ id: `flash-${Date.now()}`, type: 'error', message: flash.error })
        }
    }, [flash?.success, flash?.error, addToast])
    useEffect(() => {
        if (typeof window === 'undefined') return

        const getXsrf = () => {
            const match = document.cookie.match(/(^|;\s*)XSRF-TOKEN=([^;]+)/)
            return match ? decodeURIComponent(match[2]) : ''
        }

        const poll = async () => {
            try {
                const res = await fetch('/admin/notifications/unread', {
                    credentials: 'same-origin',
                    headers: { Accept: 'application/json' },
                })
                if (!res.ok) return
                const data = await res.json()

                for (const n of data.notifications ?? []) {
                    if (seenIdsRef.current.has(n.id)) continue
                    markSeen(n.id)

                    if (n.type === 'ai_generation_success') {
                        addToast({
                            id: n.id,
                            type: 'success',
                            message: n.message,
                            editUrl: n.edit_url,
                        })
                    } else if (n.type === 'ai_generation_failed') {
                        addToast({
                            id: n.id,
                            type: 'error',
                            message: n.message,
                        })
                    }

                    // Mark as read on the server
                    fetch(`/admin/notifications/${n.id}/read`, {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: {
                            'X-XSRF-TOKEN': getXsrf(),
                            Accept: 'application/json',
                        },
                    })
                }
            } catch {
                // Silently ignore fetch errors
            }
        }

        // Poll every 5 seconds
        poll()
        pollingRef.current = setInterval(poll, 5000)

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current)
        }
    }, [addToast])

    return (
        <div className="admin-layout flex h-screen overflow-hidden bg-nr-bg font-sans">
            {/* Sidebar */}
            <aside
                className={cn(
                    'flex flex-shrink-0 flex-col border-r border-white/[0.06] bg-nr-bg2',
                    'transition-all duration-200',
                    collapsed ? 'w-[60px]' : 'w-[220px]',
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-nr-accent to-nr-cyan font-display text-sm font-bold text-white">
                        N
                    </div>
                    {!collapsed && (
                        <span className="text-gradient font-display text-base font-bold">
                            NeuralRift
                        </span>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
                    {ADMIN_NAV.map(item => {
                        const isActive =
                            currentPath === item.href ||
                            (item.href !== '/admin' && currentPath.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5',
                                    'group transition-all duration-150',
                                    isActive
                                        ? 'border border-nr-accent/25 bg-nr-accent/15 text-nr-text'
                                        : 'border border-transparent text-nr-muted hover:bg-white/[0.04] hover:text-nr-text',
                                )}
                            >
                                <span
                                    className={cn(
                                        'w-4 flex-shrink-0 text-center text-sm',
                                        isActive
                                            ? 'text-nr-accent'
                                            : 'text-nr-faint group-hover:text-nr-muted',
                                    )}
                                >
                                    {item.icon}
                                </span>
                                {!collapsed && (
                                    <span className="truncate text-sm font-medium">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User + collapse */}
                <div className="border-t border-white/[0.06] p-3">
                    {!collapsed && auth.user && (
                        <div className="mb-2 flex items-center gap-2.5 px-1">
                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nr-accent to-nr-cyan text-xs font-bold text-white">
                                {auth.user.name[0]}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="truncate text-xs font-semibold text-nr-text">
                                    {auth.user.name}
                                </div>
                                <div className="text-[10px] text-nr-faint">Admin</div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex w-full items-center justify-center rounded-lg py-1.5 text-xs text-nr-faint transition-colors hover:bg-white/[0.04] hover:text-nr-muted"
                    >
                        {collapsed ? '→' : '←'}
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-white/[0.06] bg-nr-bg2/50 px-6">
                    <h1 className="text-base font-semibold text-nr-text">{title ?? 'Dashboard'}</h1>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="glass rounded-lg px-3 py-1.5 text-xs text-nr-faint transition-colors hover:text-nr-muted"
                        >
                            Ver blog ↗
                        </Link>
                        <Link
                            href="/admin/posts/create"
                            className="glow-accent rounded-lg bg-gradient-to-r from-nr-accent to-nr-accent-dark px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                        >
                            + Nuevo artículo
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>

            {/* Toast notifications */}
            {toasts.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                    {toasts.map(toast => (
                        <div
                            key={toast.id}
                            className={cn(
                                'flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm',
                                'animate-in slide-in-from-right duration-300',
                                toast.type === 'success'
                                    ? 'border-nr-green/20 bg-nr-green/10'
                                    : 'border-nr-red/20 bg-nr-red/10',
                            )}
                        >
                            <span
                                className={cn(
                                    'mt-0.5 text-sm',
                                    toast.type === 'success' ? 'text-nr-green' : 'text-nr-red',
                                )}
                            >
                                {toast.type === 'success' ? '✓' : '✕'}
                            </span>
                            <div className="flex-1">
                                <p
                                    className={cn(
                                        'text-xs font-medium',
                                        toast.type === 'success' ? 'text-nr-green' : 'text-nr-red',
                                    )}
                                >
                                    {toast.message}
                                </p>
                                {toast.editUrl && (
                                    <Link
                                        href={toast.editUrl}
                                        className="mt-1 inline-block text-[11px] font-semibold text-nr-accent underline decoration-nr-accent/30 underline-offset-2 hover:decoration-nr-accent"
                                    >
                                        Revisar borrador →
                                    </Link>
                                )}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="mt-0.5 text-xs text-nr-faint transition-colors hover:text-nr-muted"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
