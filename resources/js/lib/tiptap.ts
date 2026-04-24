import { renderToHTMLString } from '@tiptap/static-renderer'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { createLowlight, common } from 'lowlight'

const lowlight = createLowlight(common)

// ── Minimal hast → HTML converter ─────────────────────────────────────────
// lowlight outputs a predictable hast tree: root / element (span) / text only.
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

function highlightCode(code: string, language: string): string {
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

const RENDER_EXTENSIONS = [
    StarterKit,
    Image,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Highlight,
]

/**
 * Converts stored post content to HTML.
 * TiptapEditor saves JSON; legacy content may already be HTML.
 */
export function renderContent(content: string): string {
    if (!content) return ''
    try {
        const json = JSON.parse(content)
        if (json?.type === 'doc') {
            return renderToHTMLString({
                content: json,
                extensions: RENDER_EXTENSIONS,
                options: {
                    nodeMapping: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        codeBlock({ node }: { node: any }) {
                            const lang: string = node.attrs?.language ?? ''
                            // node is a ProseMirror Node (not raw JSON) — use .textContent
                            const code: string = node.textContent ?? ''
                            const body = highlightCode(code, lang)
                            const langLabel = lang
                                ? `<span class="nr-code-lang">${lang}</span>`
                                : ''
                            return `<pre class="nr-code-block">${langLabel}<code class="hljs${lang ? ` language-${lang}` : ''}">${body}</code></pre>`
                        },
                    },
                },
            })
        }
    } catch {
        // Not JSON — pass through as-is (raw HTML)
    }
    return content
}
