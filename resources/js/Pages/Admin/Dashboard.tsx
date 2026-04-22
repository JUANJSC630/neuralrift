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
    return (
        <div className="glass rounded-2xl p-5">
            <div className={`text-3xl font-bold font-display text-${color} mb-1`}>
                {value.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-nr-text">{label}</div>
            <div className="text-xs text-nr-faint mt-0.5">{sub}</div>
        </div>
    )
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="glass rounded-lg px-3 py-2 text-xs">
            <p className="text-nr-faint mb-1 font-mono">{label}</p>
            <p className="text-nr-accent font-semibold">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recharts area chart */}
                    <div className="lg:col-span-2 glass rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-nr-text mb-6">
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
                        <h2 className="text-sm font-semibold text-nr-text mb-4">Top afiliado</h2>
                        {topAffiliate ? (
                            <div>
                                <div className="text-2xl font-bold text-nr-gold mb-1">
                                    {topAffiliate.clicks_count.toLocaleString()}
                                </div>
                                <div className="text-sm text-nr-text font-medium">
                                    {topAffiliate.name}
                                </div>
                                <div className="text-xs text-nr-faint mt-1">clicks totales</div>
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

                        <h2 className="text-sm font-semibold text-nr-text mt-8 mb-4">
                            Top esta semana
                        </h2>
                        <div className="space-y-3">
                            {topPosts.map((post, i) => (
                                <div key={post.id} className="flex items-start gap-3">
                                    <span className="text-xs font-mono text-nr-faint w-4 flex-shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="text-xs text-nr-text hover:text-nr-accent
                                                         transition-colors line-clamp-2 block"
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
                    <div className="flex items-center justify-between mb-5">
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
                                className="flex items-center gap-4 py-2.5 border-b border-white/[0.04] last:border-0"
                            >
                                <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                                                  border flex-shrink-0 ${STATUS_COLORS[post.status] ?? ''}`}
                                >
                                    {post.status}
                                </span>
                                <Link
                                    href={`/admin/posts/${post.id}/edit`}
                                    className="flex-1 text-sm text-nr-text hover:text-nr-accent
                                                 transition-colors truncate"
                                >
                                    {post.title}
                                </Link>
                                <span className="text-xs text-nr-faint font-mono flex-shrink-0">
                                    {post.published_at ? formatDate(post.published_at) : '—'}
                                </span>
                                <span className="text-xs text-nr-faint font-mono flex-shrink-0">
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
