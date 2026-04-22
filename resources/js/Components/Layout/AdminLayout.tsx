import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { ADMIN_NAV } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { PageProps } from '@/types'

interface Props {
    children: React.ReactNode
    title?: string
}

export default function AdminLayout({ children, title }: Props) {
    const { auth, flash } = usePage<PageProps>().props
    const [collapsed, setCollapsed] = useState(false)

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

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
                        {flash?.success && (
                            <span className="rounded-lg border border-nr-green/20 bg-nr-green/10 px-3 py-1.5 text-xs text-nr-green">
                                ✓ {flash.success}
                            </span>
                        )}
                        <Link
                            href="/"
                            target="_blank"
                            className="glass rounded-lg px-3 py-1.5 text-xs text-nr-faint transition-colors hover:text-nr-muted"
                        >
                            Ver blog ↗
                        </Link>
                        <Link
                            href="/admin/posts/create"
                            className="glow-accent rounded-lg bg-gradient-to-r from-nr-accent to-[#6d58f0] px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                        >
                            + Nuevo artículo
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    )
}
