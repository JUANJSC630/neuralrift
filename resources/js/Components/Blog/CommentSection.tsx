import { useForm, usePage } from '@inertiajs/react'
import { useState, useRef, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from '@/hooks/useLocale'
import type { TranslationKey } from '@/lib/i18n'
import type { Comment as CommentType, SharedProps } from '@/types'

// ── Time ago helper ──────────────────────────────────
function timeAgo(date: string, t: (key: TranslationKey) => string): string {
    const now = Date.now()
    const past = new Date(date).getTime()
    const diff = Math.floor((now - past) / 1000)

    if (diff < 60) return t('comments.ago_now')
    if (diff < 3600) return `${Math.floor(diff / 60)} ${t('comments.ago_min')}`
    if (diff < 86400) return `${Math.floor(diff / 3600)} ${t('comments.ago_hour')}`
    return `${Math.floor(diff / 86400)} ${t('comments.ago_day')}`
}

// ── Avatar ───────────────────────────────────────────
function Avatar({ name }: { name: string }) {
    const initial = name.charAt(0).toUpperCase()
    // Generate a consistent hue from name
    const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360

    return (
        <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{
                background: `linear-gradient(135deg, hsl(${hue}, 60%, 45%), hsl(${(hue + 40) % 360}, 55%, 40%))`,
            }}
        >
            {initial}
        </div>
    )
}

// ── Comment Form ─────────────────────────────────────
interface CommentFormProps {
    postId: number
    parentId?: number | null
    parentAuthor?: string
    onCancel?: () => void
    isReply?: boolean
}

function CommentForm({
    postId,
    parentId = null,
    parentAuthor,
    onCancel,
    isReply,
}: CommentFormProps) {
    const { t } = useLocale()
    const { auth } = usePage<SharedProps>().props
    const formRef = useRef<HTMLFormElement>(null)

    const { data, setData, post, processing, errors, reset } = useForm({
        author_name: auth.user?.name ?? '',
        author_email: auth.user?.email ?? '',
        body: '',
        parent_id: parentId,
        website_url: '', // honeypot
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post(`/blog/${postId}/comments`, {
            preserveScroll: true,
            onSuccess: () => {
                reset('body')
                onCancel?.()
            },
        })
    }

    return (
        <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            initial={isReply ? { opacity: 0, height: 0 } : false}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
        >
            {parentAuthor && (
                <p className="text-xs text-nr-faint">
                    {t('comments.reply_to')}{' '}
                    <span className="font-semibold text-nr-muted">{parentAuthor}</span>
                </p>
            )}

            {/* Honeypot — hidden from humans */}
            <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                <input
                    type="text"
                    name="website_url"
                    tabIndex={-1}
                    autoComplete="off"
                    value={data.website_url}
                    onChange={e => setData('website_url', e.target.value)}
                />
            </div>

            {!auth.user && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <input
                            type="text"
                            placeholder={t('comments.name')}
                            value={data.author_name}
                            onChange={e => setData('author_name', e.target.value)}
                            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-nr-text placeholder:text-nr-faint focus:border-nr-accent/40 focus:outline-none focus:ring-1 focus:ring-nr-accent/20"
                            required
                        />
                        {errors.author_name && (
                            <p className="mt-1 text-xs text-nr-red">{errors.author_name}</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder={`${t('comments.email')} (${t('comments.email_hint')})`}
                            value={data.author_email}
                            onChange={e => setData('author_email', e.target.value)}
                            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-nr-text placeholder:text-nr-faint focus:border-nr-accent/40 focus:outline-none focus:ring-1 focus:ring-nr-accent/20"
                            required
                        />
                        {errors.author_email && (
                            <p className="mt-1 text-xs text-nr-red">{errors.author_email}</p>
                        )}
                    </div>
                </div>
            )}

            <div>
                <textarea
                    placeholder={t('comments.body')}
                    value={data.body}
                    onChange={e => setData('body', e.target.value)}
                    rows={isReply ? 2 : 4}
                    className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-nr-text placeholder:text-nr-faint focus:border-nr-accent/40 focus:outline-none focus:ring-1 focus:ring-nr-accent/20"
                    required
                    minLength={3}
                    maxLength={2000}
                />
                {errors.body && <p className="mt-1 text-xs text-nr-red">{errors.body}</p>}
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-gradient-to-r from-nr-accent to-nr-accent-dark px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                >
                    {processing
                        ? '...'
                        : isReply
                          ? t('comments.submit_reply')
                          : t('comments.submit')}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-sm text-nr-faint transition-colors hover:text-nr-muted"
                    >
                        {t('comments.cancel')}
                    </button>
                )}
            </div>
        </motion.form>
    )
}

// ── Single Comment ───────────────────────────────────
interface CommentItemProps {
    comment: CommentType
    postId: number
}

function CommentItem({ comment, postId }: CommentItemProps) {
    const { t } = useLocale()
    const [showReply, setShowReply] = useState(false)
    const canReply = comment.depth < 2

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={
                comment.depth > 0 ? 'ml-6 border-l border-white/[0.06] pl-5 sm:ml-10 sm:pl-6' : ''
            }
        >
            <div className="group">
                <div className="flex gap-3">
                    <Avatar name={comment.author_name} />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-nr-text">
                                {comment.author_name}
                            </span>
                            <span className="font-mono text-[11px] text-nr-faint">
                                {timeAgo(comment.created_at, t)}
                            </span>
                        </div>

                        <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-nr-muted">
                            {comment.body}
                        </p>

                        {canReply && (
                            <button
                                type="button"
                                onClick={() => setShowReply(!showReply)}
                                className="mt-2 text-xs font-medium text-nr-faint transition-colors hover:text-nr-accent"
                            >
                                {showReply ? t('comments.cancel') : t('comments.reply')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Reply form */}
                <AnimatePresence>
                    {showReply && (
                        <div className="ml-12 mt-3 sm:ml-12">
                            <CommentForm
                                postId={postId}
                                parentId={comment.id}
                                parentAuthor={comment.author_name}
                                onCancel={() => setShowReply(false)}
                                isReply
                            />
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} postId={postId} />
                    ))}
                </div>
            )}
        </motion.div>
    )
}

// ── Main Section ─────────────────────────────────────
interface CommentSectionProps {
    postId: number
    comments: CommentType[]
    commentsCount: number
    allowComments: boolean
}

export default function CommentSection({
    postId,
    comments,
    commentsCount,
    allowComments,
}: CommentSectionProps) {
    const { t } = useLocale()

    if (!allowComments) return null

    const countLabel = commentsCount === 1 ? t('comments.count_one') : t('comments.count_other')

    return (
        <section className="mt-12 border-t border-white/[0.06] pt-10" id="comments">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
                <h2 className="font-display text-xl font-bold text-nr-text">
                    {t('comments.title')}
                </h2>
                {commentsCount > 0 && (
                    <span className="glass rounded-full px-3 py-0.5 font-mono text-xs text-nr-faint">
                        {commentsCount} {countLabel}
                    </span>
                )}
            </div>

            {/* Comment form */}
            <div className="glass mb-8 rounded-2xl p-5 sm:p-6">
                <h3 className="mb-4 text-sm font-semibold text-nr-muted">{t('comments.leave')}</h3>
                <CommentForm postId={postId} />
            </div>

            {/* Comments list */}
            {comments.length > 0 ? (
                <div className="space-y-6">
                    {comments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} postId={postId} />
                    ))}
                </div>
            ) : (
                <p className="py-8 text-center text-sm text-nr-faint">{t('comments.empty')}</p>
            )}
        </section>
    )
}
