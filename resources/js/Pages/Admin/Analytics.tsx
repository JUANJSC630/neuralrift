import AdminLayout from '@/Components/Layout/AdminLayout'
import { Head, router } from '@inertiajs/react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts'
import { cn } from '@/lib/utils'

interface Props {
    viewsChart: { date: string; views: number }[]
    sources: Record<string, number>
    topPosts: {
        id: number
        title: string
        slug: string
        views_count: number
        period_views: number
    }[]
    countries: { country: string; total: number }[]
    affiliateStats: { id: number; name: string; clicks_count: number; period_clicks: number }[]
    totals: { views: number; subscribers: number; clicks: number }
    days: number
}

const SOURCE_COLORS: Record<string, string> = {
    organic: '#10B981',
    social: '#7C6AF7',
    direct: '#06B6D4',
    referral: '#F59E0B',
}
const SOURCE_LABELS: Record<string, string> = {
    organic: 'Orgánico',
    social: 'Social',
    direct: 'Directo',
    referral: 'Referencia',
}

interface TooltipProps {
    active?: boolean
    payload?: { value: number }[]
    label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (!active || !payload?.length) return null
    return (
        <div className="glass-strong rounded-xl px-3 py-2 text-xs shadow-xl">
            <div className="mb-1 text-nr-faint">{label}</div>
            <div className="font-mono font-semibold text-nr-accent">
                {payload[0].value.toLocaleString()}
            </div>
        </div>
    )
}

function StatCard({
    label,
    value,
    sub,
    color = 'accent',
}: {
    label: string
    value: number | string
    sub?: string
    color?: string
}) {
    const colorMap: Record<string, string> = {
        accent: 'text-gradient',
        cyan: 'text-nr-cyan',
        green: 'text-nr-green',
        gold: 'text-nr-gold',
    }
    return (
        <div className="glass rounded-2xl p-5">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-nr-faint">
                {label}
            </div>
            <div className={`font-display text-3xl font-bold ${colorMap[color] ?? 'text-nr-text'}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {sub && <div className="mt-1 text-xs text-nr-muted">{sub}</div>}
        </div>
    )
}

export default function Analytics({
    viewsChart,
    sources,
    topPosts,
    countries,
    affiliateStats,
    totals,
    days,
}: Props) {
    const dayOptions = [7, 14, 30, 60, 90]

    const pieData = Object.entries(sources).map(([key, value]) => ({
        name: SOURCE_LABELS[key] ?? key,
        value,
        color: SOURCE_COLORS[key] ?? '#94A3B8',
    }))

    const maxViews = Math.max(...topPosts.map(p => p.period_views), 1)

    return (
        <AdminLayout title="Analytics">
            <Head title="Analytics — Admin" />

            {/* Range selector */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="font-display text-xl font-bold text-nr-text">Analytics</h2>
                    <p className="mt-0.5 text-xs text-nr-faint">Últimos {days} días</p>
                </div>
                <div className="glass flex gap-1 rounded-xl p-1">
                    {dayOptions.map(d => (
                        <button
                            key={d}
                            onClick={() => router.get('/admin/analytics', { days: d })}
                            className={cn(
                                'rounded-lg px-3 py-1.5 font-mono text-xs transition-all',
                                days === d
                                    ? 'bg-nr-accent text-white'
                                    : 'text-nr-faint hover:text-nr-muted',
                            )}
                        >
                            {d}d
                        </button>
                    ))}
                </div>
            </div>

            {/* KPIs */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard
                    label="Visitas"
                    value={totals.views}
                    sub={`últimos ${days} días`}
                    color="accent"
                />
                <StatCard
                    label="Nuevos suscriptores"
                    value={totals.subscribers}
                    sub="confirmados"
                    color="green"
                />
                <StatCard
                    label="Clics afiliados"
                    value={totals.clicks}
                    sub="todos los programas"
                    color="gold"
                />
            </div>

            {/* Area chart + Pie sources */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="glass rounded-2xl p-6 lg:col-span-2">
                    <h3 className="mb-5 font-semibold text-nr-text">Visitas en el tiempo</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={viewsChart}>
                            <defs>
                                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7C6AF7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7C6AF7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                tick={{
                                    fill: '#475569',
                                    fontSize: 10,
                                    fontFamily: 'JetBrains Mono',
                                }}
                                axisLine={false}
                                tickLine={false}
                                interval={Math.floor(days / 7)}
                            />
                            <YAxis hide />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="views"
                                stroke="#7C6AF7"
                                strokeWidth={2}
                                fill="url(#aGrad)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass rounded-2xl p-6">
                    <h3 className="mb-5 font-semibold text-nr-text">Fuentes de tráfico</h3>
                    {pieData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={70}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {pieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-2 space-y-2">
                                {pieData.map((entry, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-2 w-2 flex-shrink-0 rounded-full"
                                                style={{ background: entry.color }}
                                            />
                                            <span className="text-xs text-nr-muted">
                                                {entry.name}
                                            </span>
                                        </div>
                                        <span className="font-mono text-xs text-nr-faint">
                                            {entry.value.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex h-40 items-center justify-center text-sm text-nr-faint">
                            Sin datos aún
                        </div>
                    )}
                </div>
            </div>

            {/* Top posts + Countries + Affiliates */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Top posts */}
                <div className="glass rounded-2xl p-6">
                    <h3 className="mb-5 font-semibold text-nr-text">Top artículos</h3>
                    <div className="space-y-4">
                        {topPosts.slice(0, 8).map((post, i) => (
                            <div key={post.id}>
                                <div className="mb-1.5 flex items-start justify-between gap-2">
                                    <div className="flex min-w-0 items-start gap-2">
                                        <span className="w-4 flex-shrink-0 pt-0.5 font-mono text-[10px] text-nr-faint">
                                            {i + 1}
                                        </span>
                                        <p className="line-clamp-2 text-xs leading-snug text-nr-text">
                                            {post.title}
                                        </p>
                                    </div>
                                    <span className="flex-shrink-0 font-mono text-[10px] text-nr-accent">
                                        {post.period_views.toLocaleString()}
                                    </span>
                                </div>
                                <div className="ml-6 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-nr-accent to-nr-cyan transition-all duration-500"
                                        style={{
                                            width: `${(post.period_views / maxViews) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        {topPosts.length === 0 && (
                            <p className="py-6 text-center text-xs text-nr-faint">Sin datos</p>
                        )}
                    </div>
                </div>

                {/* Countries */}
                <div className="glass rounded-2xl p-6">
                    <h3 className="mb-5 font-semibold text-nr-text">Por país</h3>
                    <div className="space-y-3">
                        {countries.slice(0, 8).map(c => {
                            const maxC = countries[0]?.total ?? 1
                            return (
                                <div key={c.country}>
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="font-mono text-xs text-nr-muted">
                                            {c.country}
                                        </span>
                                        <span className="font-mono text-xs text-nr-faint">
                                            {c.total.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
                                        <div
                                            className="h-full rounded-full bg-nr-cyan/60"
                                            style={{ width: `${(c.total / maxC) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                        {countries.length === 0 && (
                            <p className="py-6 text-center text-xs text-nr-faint">Sin datos</p>
                        )}
                    </div>
                </div>

                {/* Affiliate clicks */}
                <div className="glass rounded-2xl p-6">
                    <h3 className="mb-5 font-semibold text-nr-text">Clics por afiliado</h3>
                    <div className="space-y-3">
                        {affiliateStats.map(aff => {
                            const maxC = affiliateStats[0]?.period_clicks ?? 1
                            return (
                                <div key={aff.id}>
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="max-w-[130px] truncate text-xs text-nr-muted">
                                            {aff.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[10px] text-nr-faint">
                                                {aff.period_clicks}
                                            </span>
                                            <span className="font-mono text-[10px] text-nr-faint/40">
                                                / {aff.clicks_count}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
                                        <div
                                            className="h-full rounded-full bg-nr-gold/60"
                                            style={{
                                                width:
                                                    maxC > 0
                                                        ? `${(aff.period_clicks / maxC) * 100}%`
                                                        : '0%',
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                        {affiliateStats.length === 0 && (
                            <p className="py-6 text-center text-xs text-nr-faint">
                                Sin clics en este período
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
