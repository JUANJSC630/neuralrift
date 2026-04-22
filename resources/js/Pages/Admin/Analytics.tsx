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

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="glass-strong rounded-xl px-3 py-2 text-xs shadow-xl">
            <div className="text-nr-faint mb-1">{label}</div>
            <div className="text-nr-accent font-mono font-semibold">
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
            <div className="text-[10px] font-mono text-nr-faint uppercase tracking-widest mb-2">
                {label}
            </div>
            <div className={`text-3xl font-bold font-display ${colorMap[color] ?? 'text-nr-text'}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {sub && <div className="text-xs text-nr-muted mt-1">{sub}</div>}
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-display text-xl font-bold text-nr-text">Analytics</h2>
                    <p className="text-xs text-nr-faint mt-0.5">Últimos {days} días</p>
                </div>
                <div className="flex gap-1 glass rounded-xl p-1">
                    {dayOptions.map(d => (
                        <button
                            key={d}
                            onClick={() => router.get('/admin/analytics', { days: d })}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 glass rounded-2xl p-6">
                    <h3 className="font-semibold text-nr-text mb-5">Visitas en el tiempo</h3>
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
                    <h3 className="font-semibold text-nr-text mb-5">Fuentes de tráfico</h3>
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
                            <div className="space-y-2 mt-2">
                                {pieData.map((entry, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full flex-shrink-0"
                                                style={{ background: entry.color }}
                                            />
                                            <span className="text-xs text-nr-muted">
                                                {entry.name}
                                            </span>
                                        </div>
                                        <span className="text-xs font-mono text-nr-faint">
                                            {entry.value.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-40 text-nr-faint text-sm">
                            Sin datos aún
                        </div>
                    )}
                </div>
            </div>

            {/* Top posts + Countries + Affiliates */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top posts */}
                <div className="glass rounded-2xl p-6">
                    <h3 className="font-semibold text-nr-text mb-5">Top artículos</h3>
                    <div className="space-y-4">
                        {topPosts.slice(0, 8).map((post, i) => (
                            <div key={post.id}>
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <div className="flex items-start gap-2 min-w-0">
                                        <span
                                            className="text-[10px] font-mono text-nr-faint
                                                         w-4 flex-shrink-0 pt-0.5"
                                        >
                                            {i + 1}
                                        </span>
                                        <p className="text-xs text-nr-text leading-snug line-clamp-2">
                                            {post.title}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-mono text-nr-accent flex-shrink-0">
                                        {post.period_views.toLocaleString()}
                                    </span>
                                </div>
                                <div className="ml-6 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-nr-accent to-nr-cyan
                                                    rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(post.period_views / maxViews) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        {topPosts.length === 0 && (
                            <p className="text-xs text-nr-faint text-center py-6">Sin datos</p>
                        )}
                    </div>
                </div>

                {/* Countries */}
                <div className="glass rounded-2xl p-6">
                    <h3 className="font-semibold text-nr-text mb-5">Por país</h3>
                    <div className="space-y-3">
                        {countries.slice(0, 8).map(c => {
                            const maxC = countries[0]?.total ?? 1
                            return (
                                <div key={c.country}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-nr-muted font-mono">
                                            {c.country}
                                        </span>
                                        <span className="text-xs font-mono text-nr-faint">
                                            {c.total.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-nr-cyan/60 rounded-full"
                                            style={{ width: `${(c.total / maxC) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                        {countries.length === 0 && (
                            <p className="text-xs text-nr-faint text-center py-6">Sin datos</p>
                        )}
                    </div>
                </div>

                {/* Affiliate clicks */}
                <div className="glass rounded-2xl p-6">
                    <h3 className="font-semibold text-nr-text mb-5">Clics por afiliado</h3>
                    <div className="space-y-3">
                        {affiliateStats.map(aff => {
                            const maxC = affiliateStats[0]?.period_clicks ?? 1
                            return (
                                <div key={aff.id}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-nr-muted truncate max-w-[130px]">
                                            {aff.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-nr-faint">
                                                {aff.period_clicks}
                                            </span>
                                            <span className="text-[10px] font-mono text-nr-faint/40">
                                                / {aff.clicks_count}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-nr-gold/60 rounded-full"
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
                            <p className="text-xs text-nr-faint text-center py-6">
                                Sin clics en este período
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
