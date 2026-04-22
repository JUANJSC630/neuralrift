import { Head, Link } from '@inertiajs/react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import AdminLayout from '@/Components/Layout/AdminLayout'
import { formatDate } from '@/lib/utils'
import type { Post, Affiliate } from '@/types'

interface Kpis {
    posts_published: number
    posts_draft: number
    posts_scheduled: number
    subscribers: number
    subscribers_week: number
    views_today: number
    views_week: number
    views_month: number
    clicks_month: number
}

interface ChartPoint {
    date: string
    views: number
}

interface Props {
    kpis: Kpis
    chartData: ChartPoint[]
    recentPosts: Post[]
    topPosts: (Post & { week_views: number })[]
    topAffiliate: Affiliate | null
}

const STATUS_COLORS: Record<string, string> = {
    published: 'text-nr-green bg-nr-green/10 border-nr-green/20',
    draft: 'text-nr-faint bg-white/5 border-white/10',
    scheduled: 'text-nr-gold bg-nr-gold/10 border-nr-gold/20',
    review: 'text-nr-cyan bg-nr-cyan/10 border-nr-cyan/20',
}

function KpiCard({
    label,
    value,
    sub,
    color,
}: {
    label: string
    value: number
    sub: string
    color: string
}) {
    const colorMap: Record<string, string> = {
        'nr-accent': 'text-gradient',
        'nr-green': 'text-nr-green',
        'nr-gold': 'text-nr-gold',
        'nr-cyan': 'text-nr-cyan',
    }
    const textClass = colorMap[color] ?? 'text-nr-text'

    return (
        <div className="glass rounded-2xl p-5">
            <div className={`font-display text-3xl font-bold ${textClass} mb-1`}>
                {value.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-nr-text">{label}</div>
            <div className="mt-0.5 text-xs text-nr-faint">{sub}</div>
        </div>
    )
}

interface TooltipProps {
    active?: boolean
    payload?: { value: number }[]
    label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
    if (!active || !payload?.length) return null
    return (
        <div className="glass rounded-lg px-3 py-2 text-xs">
            <p className="mb-1 font-mono text-nr-faint">{label}</p>
            <p className="font-semibold text-nr-accent">
                {payload[0].value.toLocaleString()} vistas
            </p>
        </div>
    )
}

export default function Dashboard({ kpis, chartData, recentPosts, topPosts, topAffiliate }: Props) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin — Dashboard" />

            <div className="space-y-6">
                {/* KPI cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <KpiCard
                        label="Publicados"
                        value={kpis.posts_published}
                        sub={`${kpis.posts_draft} borradores`}
                        color="nr-accent"
                    />
                    <KpiCard
                        label="Suscriptores"
                        value={kpis.subscribers}
                        sub={`+${kpis.subscribers_week} esta semana`}
                        color="nr-green"
                    />
                    <KpiCard
                        label="Vistas hoy"
                        value={kpis.views_today}
                        sub={`${kpis.views_week.toLocaleString()} esta semana`}
                        color="nr-cyan"
                    />
                    <KpiCard
                        label="Clicks afiliados"
                        value={kpis.clicks_month}
                        sub="últimos 30 días"
                        color="nr-gold"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Recharts area chart */}
                    <div className="glass rounded-2xl p-6 lg:col-span-2">
                        <h2 className="mb-6 text-sm font-semibold text-nr-text">
                            Vistas — últimos 30 días
                        </h2>
                        <ResponsiveContainer width="100%" height={160}>
                            <AreaChart
                                data={chartData}
                                margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                            >
                                <defs>
                                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7C6AF7" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#7C6AF7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255,255,255,0.04)"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: '#6b7280' }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={6}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#6b7280' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#7C6AF7"
                                    strokeWidth={2}
                                    fill="url(#viewsGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top sidebar */}
                    <div className="glass rounded-2xl p-6">
                        <h2 className="mb-4 text-sm font-semibold text-nr-text">Top afiliado</h2>
                        {topAffiliate ? (
                            <div>
                                <div className="mb-1 text-2xl font-bold text-nr-gold">
                                    {topAffiliate.clicks_count.toLocaleString()}
                                </div>
                                <div className="text-sm font-medium text-nr-text">
                                    {topAffiliate.name}
                                </div>
                                <div className="mt-1 text-xs text-nr-faint">clicks totales</div>
                                <Link
                                    href="/admin/affiliates"
                                    className="mt-4 block text-xs text-nr-accent hover:underline"
                                >
                                    Ver todos los afiliados →
                                </Link>
                            </div>
                        ) : (
                            <p className="text-sm text-nr-faint">Sin datos aún</p>
                        )}

                        <h2 className="mb-4 mt-8 text-sm font-semibold text-nr-text">
                            Top esta semana
                        </h2>
                        <div className="space-y-3">
                            {topPosts.map((post, i) => (
                                <div key={post.id} className="flex items-start gap-3">
                                    <span className="mt-0.5 w-4 flex-shrink-0 font-mono text-xs text-nr-faint">
                                        {i + 1}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="line-clamp-2 block text-xs text-nr-text transition-colors hover:text-nr-accent"
                                        >
                                            {post.title}
                                        </Link>
                                        <span className="text-[10px] text-nr-faint">
                                            {post.week_views} vistas
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Posts recientes */}
                <div className="glass rounded-2xl p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-nr-text">Artículos recientes</h2>
                        <Link
                            href="/admin/posts"
                            className="text-xs text-nr-accent hover:underline"
                        >
                            Ver todos →
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {recentPosts.map(post => (
                            <div
                                key={post.id}
                                className="flex items-center gap-4 border-b border-white/[0.04] py-2.5 last:border-0"
                            >
                                <span
                                    className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[post.status] ?? ''}`}
                                >
                                    {post.status}
                                </span>
                                <Link
                                    href={`/admin/posts/${post.id}/edit`}
                                    className="flex-1 truncate text-sm text-nr-text transition-colors hover:text-nr-accent"
                                >
                                    {post.title}
                                </Link>
                                <span className="flex-shrink-0 font-mono text-xs text-nr-faint">
                                    {post.published_at ? formatDate(post.published_at) : '—'}
                                </span>
                                <span className="flex-shrink-0 font-mono text-xs text-nr-faint">
                                    {post.views_count.toLocaleString()} vistas
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
