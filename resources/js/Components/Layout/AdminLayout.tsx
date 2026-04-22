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
        <div className="flex h-screen bg-nr-bg overflow-hidden font-sans admin-layout">
            {/* Sidebar */}
            <aside
                className={cn(
                    'flex flex-col bg-nr-bg2 border-r border-white/[0.06] flex-shrink-0',
                    'transition-all duration-200',
                    collapsed ? 'w-[60px]' : 'w-[220px]',
                )}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
                    <div
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-nr-accent to-nr-cyan
                                    flex items-center justify-center font-display font-bold
                                    text-white text-sm flex-shrink-0"
                    >
                        N
                    </div>
                    {!collapsed && (
                        <span className="font-display font-bold text-gradient text-base">
                            NeuralRift
                        </span>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
                    {ADMIN_NAV.map(item => {
                        const isActive =
                            currentPath === item.href ||
                            (item.href !== '/admin' && currentPath.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                                    'transition-all duration-150 group',
                                    isActive
                                        ? 'bg-nr-accent/15 border border-nr-accent/25 text-nr-text'
                                        : 'border border-transparent text-nr-muted hover:bg-white/[0.04] hover:text-nr-text',
                                )}
                            >
                                <span
                                    className={cn(
                                        'text-sm flex-shrink-0 w-4 text-center',
                                        isActive
                                            ? 'text-nr-accent'
                                            : 'text-nr-faint group-hover:text-nr-muted',
                                    )}
                                >
                                    {item.icon}
                                </span>
                                {!collapsed && (
                                    <span className="text-sm font-medium truncate">
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
                        <div className="flex items-center gap-2.5 px-1 mb-2">
                            <div
                                className="w-7 h-7 rounded-full bg-gradient-to-br from-nr-accent
                                            to-nr-cyan flex items-center justify-center
                                            text-xs font-bold text-white flex-shrink-0"
                            >
                                {auth.user.name[0]}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="text-xs font-semibold text-nr-text truncate">
                                    {auth.user.name}
                                </div>
                                <div className="text-[10px] text-nr-faint">Admin</div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center py-1.5 rounded-lg
                                   text-nr-faint hover:text-nr-muted hover:bg-white/[0.04]
                                   transition-colors text-xs"
                    >
                        {collapsed ? '→' : '←'}
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header
                    className="h-16 flex items-center justify-between px-6
                                   border-b border-white/[0.06] bg-nr-bg2/50 flex-shrink-0"
                >
                    <h1 className="font-semibold text-nr-text text-base">{title ?? 'Dashboard'}</h1>
                    <div className="flex items-center gap-3">
                        {flash?.success && (
                            <span
                                className="text-xs text-nr-green bg-nr-green/10
                                             border border-nr-green/20 px-3 py-1.5 rounded-lg"
                            >
                                ✓ {flash.success}
                            </span>
                        )}
                        <Link
                            href="/"
                            target="_blank"
                            className="text-xs text-nr-faint hover:text-nr-muted
                                         transition-colors px-3 py-1.5 glass rounded-lg"
                        >
                            Ver blog ↗
                        </Link>
                        <Link
                            href="/admin/posts/create"
                            className="px-4 py-2 rounded-lg text-xs font-semibold text-white
                                         bg-gradient-to-r from-nr-accent to-[#6d58f0]
                                         glow-accent hover:-translate-y-0.5 transition-all duration-200"
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
