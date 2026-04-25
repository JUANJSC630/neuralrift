import { createLowlight, common } from 'lowlight'

const lowlight = createLowlight(common)
lowlight.registerAlias('typescript', ['tsx'])
lowlight.registerAlias('javascript', ['jsx'])

// ── Minimal hast → HTML converter ─────────────────────────────────────────
type HastNode = {
    type: string
    tagName?: string
    properties?: { className?: string[] }
    children?: HastNode[]
    value?: string
}

function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function hastToHtml(node: HastNode): string {
    if (node.type === 'text') return escapeHtml(node.value ?? '')
    if (node.type === 'element') {
        const cls = (node.properties?.className ?? []).join(' ')
        const attr = cls ? ` class="${cls}"` : ''
        const inner = (node.children ?? []).map(hastToHtml).join('')
        return `<span${attr}>${inner}</span>`
    }
    return (node.children ?? []).map(hastToHtml).join('')
}

export function highlightCode(code: string, language: string): string {
    try {
        const tree =
            language && lowlight.registered(language)
                ? lowlight.highlight(language, code)
                : lowlight.highlightAuto(code)
        return hastToHtml(tree as HastNode)
    } catch {
        return escapeHtml(code)
    }
}
// ──────────────────────────────────────────────────────────────────────────

// ── Custom Tiptap JSON → HTML renderer ────────────────────────────────────
// Completely self-contained: no @tiptap/static-renderer, no extensions,
// identical output in browser and Node.js — eliminates all hydration mismatches.

type TiptapNode = {
    type: string
    attrs?: Record<string, unknown>
    content?: TiptapNode[]
    text?: string
    marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
}

function renderMark(markType: string, attrs: Record<string, unknown> | undefined, inner: string): string {
    switch (markType) {
        case 'bold': return `<strong>${inner}</strong>`
        case 'italic': return `<em>${inner}</em>`
        case 'strike': return `<s>${inner}</s>`
        case 'highlight': return `<mark>${inner}</mark>`
        case 'code': return `<code>${inner}</code>`
        case 'link': {
            const href = String(attrs?.href ?? '')
            if (!/^(https?:|mailto:)/.test(href)) return inner
            const target = attrs?.target ? ` target="${escapeHtml(String(attrs.target))}"` : ''
            return `<a href="${escapeHtml(href)}"${target} rel="noopener noreferrer">${inner}</a>`
        }
        default: return inner
    }
}

function renderTextNode(node: TiptapNode): string {
    const raw = node.text ?? ''
    const marks = node.marks ?? []
    const hasCode = marks.some(m => m.type === 'code')
    if (hasCode) {
        // escape first, then wrap in <code>, then apply other marks around it
        let result = `<code>${escapeHtml(raw)}</code>`
        for (const m of marks) {
            if (m.type !== 'code') result = renderMark(m.type, m.attrs, result)
        }
        return result
    }
    let result = escapeHtml(raw)
    for (const m of marks) result = renderMark(m.type, m.attrs, result)
    return result
}

function renderChildren(nodes: TiptapNode[]): string {
    return nodes.map(renderTiptapNode).join('')
}

function renderInline(nodes: TiptapNode[]): string {
    return nodes
        .map(n => {
            if (n.type === 'text') return renderTextNode(n)
            if (n.type === 'hardBreak') return '<br>'
            // inline nodes with children (e.g. unknown extensions)
            return renderInline(n.content ?? [])
        })
        .join('')
}

function getAlign(attrs?: Record<string, unknown>): string {
    const a = attrs?.textAlign
    return a && a !== 'left' ? ` style="text-align: ${String(a)}"` : ''
}

function renderTiptapNode(node: TiptapNode): string {
    const children = node.content ?? []
    switch (node.type) {
        case 'doc':
            return renderChildren(children)

        case 'paragraph':
            return `<p${getAlign(node.attrs)}>${renderInline(children)}</p>`

        case 'heading': {
            const l = Number(node.attrs?.level ?? 2)
            return `<h${l}${getAlign(node.attrs)}>${renderInline(children)}</h${l}>`
        }

        case 'codeBlock': {
            const lang = String(node.attrs?.language ?? '')
            // collect raw text from all descendant text nodes
            const code = children.map(n => n.text ?? '').join('')
            const body = highlightCode(code, lang)
            const label = lang ? `<span class="nr-code-lang">${lang}</span>` : ''
            return `<pre class="nr-code-block">${label}<code class="hljs${lang ? ` language-${lang}` : ''}">${body}</code></pre>`
        }

        case 'blockquote':
            return `<blockquote>${renderChildren(children)}</blockquote>`

        case 'bulletList':
            return `<ul>${renderChildren(children)}</ul>`

        case 'orderedList':
            return `<ol start="${Number(node.attrs?.start ?? 1)}">${renderChildren(children)}</ol>`

        case 'listItem':
            return `<li>${renderChildren(children)}</li>`

        case 'horizontalRule':
            return '<hr>'

        case 'image': {
            const src = escapeHtml(String(node.attrs?.src ?? ''))
            const alt = escapeHtml(String(node.attrs?.alt ?? ''))
            const title = node.attrs?.title ? ` title="${escapeHtml(String(node.attrs.title))}"` : ''
            return `<img src="${src}" alt="${alt}"${title} loading="lazy" decoding="async">`
        }

        case 'text':
            return renderTextNode(node)

        case 'hardBreak':
            return '<br>'

        default:
            // unknown node: recurse into children so content isn't silently dropped
            return renderChildren(children)
    }
}
// ──────────────────────────────────────────────────────────────────────────

/**
 * Converts stored post content to HTML.
 * TiptapEditor saves JSON; legacy content may already be HTML.
 */
export function renderContent(content: string): string {
    if (!content) return ''
    try {
        const json = JSON.parse(content) as TiptapNode
        if (json?.type === 'doc') return renderTiptapNode(json)
    } catch {
        // Not JSON — pass through as-is (raw HTML)
    }
    return content
}
