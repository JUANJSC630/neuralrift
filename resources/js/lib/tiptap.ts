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

// highlight.js's typescript grammar gives up on JSX whenever it hits
// `style={{...}}` — nested braces break its expression parser and the rest
// of the code becomes plain text. xml grammar mishandles JSX expressions too.
// So for tsx/jsx we run a custom linear parser that splits the code into JSX
// tags vs plain JS, highlights each piece appropriately, and concatenates.

function highlightWithTs(code: string): string {
    if (!code) return ''
    const tree = lowlight.highlight('typescript', code) as HastNode
    return hastToHtml(tree)
}

// Find the end of a JSX tag starting at position `start` (where code[start] === '<').
// Returns the index AFTER the closing '>', or -1 if not a real tag.
function findJsxTagEnd(code: string, start: number): number {
    const N = code.length
    let i = start + 1
    if (code[i] === '/') i++
    // Tag name must start with a letter
    if (!/[A-Za-z]/.test(code[i] ?? '')) return -1
    while (i < N) {
        const c = code[i]
        if (c === '"' || c === "'") {
            const q = c
            i++
            while (i < N && code[i] !== q) i++
            if (i < N) i++
            continue
        }
        if (c === '{') {
            let depth = 1
            i++
            while (i < N && depth > 0) {
                const cc = code[i]
                if (cc === '{') depth++
                else if (cc === '}') depth--
                else if (cc === '"' || cc === "'" || cc === '`') {
                    const q = cc
                    i++
                    while (i < N && code[i] !== q) {
                        if (code[i] === '\\') i++
                        i++
                    }
                }
                i++
            }
            continue
        }
        if (c === '>') return i + 1
        i++
    }
    return -1
}

function highlightJsxTag(tag: string): string {
    // tag starts with '<' or '</', ends with '>' or '/>'
    let i = 0
    const N = tag.length
    let inner = ''

    // opening punctuation
    let punct = '<'
    i = 1
    if (tag[1] === '/') {
        punct = '</'
        i = 2
    }
    inner += escapeHtml(punct)

    // tag name
    const nameStart = i
    while (i < N && /[A-Za-z0-9.]/.test(tag[i])) i++
    if (i > nameStart) {
        inner += `<span class="hljs-name">${escapeHtml(tag.slice(nameStart, i))}</span>`
    }

    // attributes
    while (i < N) {
        // whitespace
        const wsStart = i
        while (i < N && /\s/.test(tag[i])) i++
        if (i > wsStart) inner += escapeHtml(tag.slice(wsStart, i))
        if (i >= N) break

        // closing punctuation
        if (tag[i] === '/' && tag[i + 1] === '>') {
            inner += escapeHtml('/>')
            i += 2
            break
        }
        if (tag[i] === '>') {
            inner += '&gt;'
            i++
            break
        }

        // attribute name
        const attrStart = i
        while (i < N && /[A-Za-z0-9-]/.test(tag[i])) i++
        if (i > attrStart) {
            inner += `<span class="hljs-attr">${escapeHtml(tag.slice(attrStart, i))}</span>`
        }

        // = and value
        if (tag[i] === '=') {
            inner += '='
            i++
            if (tag[i] === '"' || tag[i] === "'") {
                const q = tag[i]
                const valStart = i
                i++
                while (i < N && tag[i] !== q) i++
                if (i < N) i++
                inner += `<span class="hljs-string">${escapeHtml(tag.slice(valStart, i))}</span>`
            } else if (tag[i] === '{') {
                // JSX expression — highlight inner with typescript
                const exprStart = i
                let depth = 1
                i++
                while (i < N && depth > 0) {
                    if (tag[i] === '"' || tag[i] === "'" || tag[i] === '`') {
                        const q = tag[i]
                        i++
                        while (i < N && tag[i] !== q) {
                            if (tag[i] === '\\') i++
                            i++
                        }
                        if (i < N) i++
                        continue
                    }
                    if (tag[i] === '{') depth++
                    else if (tag[i] === '}') depth--
                    if (depth > 0) i++
                }
                if (i < N) i++
                const exprBody = tag.slice(exprStart + 1, i - 1)
                inner += '{' + highlightWithTs(exprBody) + '}'
            } else {
                const valStart = i
                while (i < N && /[A-Za-z0-9_-]/.test(tag[i])) i++
                inner += escapeHtml(tag.slice(valStart, i))
            }
        } else if (i === attrStart) {
            // didn't consume anything — bail to avoid infinite loop
            inner += escapeHtml(tag[i] ?? '')
            i++
        }
    }

    return `<span class="hljs-tag">${inner}</span>`
}

// Skip a JS string literal starting at `i` (where code[i] is the opening quote).
// Returns the index AFTER the closing quote.
function skipString(code: string, i: number): number {
    const q = code[i]
    const N = code.length
    i++
    while (i < N && code[i] !== q) {
        if (code[i] === '\\') i++
        i++
    }
    return i < N ? i + 1 : i
}

// Extract a balanced `{...}` expression starting at `i` (where code[i] === '{').
// Returns [exprBody, indexAfterClosingBrace].
function readBalancedBraces(code: string, i: number): [string, number] {
    const N = code.length
    const start = i
    let depth = 1
    i++
    while (i < N && depth > 0) {
        const c = code[i]
        if (c === '"' || c === "'" || c === '`') {
            i = skipString(code, i)
            continue
        }
        if (c === '{') depth++
        else if (c === '}') depth--
        if (depth > 0) i++
    }
    if (i < N) i++
    return [code.slice(start + 1, i - 1), i]
}

function highlightTsx(code: string): string {
    let out = ''
    let i = 0
    const N = code.length
    let jsStart = 0
    let jsxDepth = 0

    const flushJs = (end: number) => {
        if (end > jsStart) out += highlightWithTs(code.slice(jsStart, end))
    }

    while (i < N) {
        if (jsxDepth === 0) {
            // JS context — skip strings and comments to avoid false JSX detection
            const c = code[i]
            if (c === '"' || c === "'" || c === '`') {
                i = skipString(code, i)
                continue
            }
            if (c === '/' && code[i + 1] === '/') {
                while (i < N && code[i] !== '\n') i++
                continue
            }
            if (c === '/' && code[i + 1] === '*') {
                i += 2
                while (i < N && !(code[i] === '*' && code[i + 1] === '/')) i++
                if (i < N) i += 2
                continue
            }
            if (c === '<') {
                const next = code[i + 1] ?? ''
                const looksLikeTag =
                    /[A-Za-z]/.test(next) || (next === '/' && /[A-Za-z]/.test(code[i + 2] ?? ''))
                if (looksLikeTag) {
                    const end = findJsxTagEnd(code, i)
                    if (end > i) {
                        flushJs(i)
                        const tagText = code.slice(i, end)
                        out += highlightJsxTag(tagText)
                        const isClosing = tagText.startsWith('</')
                        const isSelfClosing = tagText.endsWith('/>')
                        if (!isClosing && !isSelfClosing) jsxDepth = 1
                        jsStart = end
                        i = end
                        continue
                    }
                }
            }
            i++
        } else {
            // JSX content — plain text until `<` (next tag) or `{` (expression)
            const textStart = i
            while (i < N && code[i] !== '<' && code[i] !== '{') i++
            if (i > textStart) out += escapeHtml(code.slice(textStart, i))
            if (i >= N) break

            if (code[i] === '<') {
                const next = code[i + 1] ?? ''
                const isClose = next === '/' && /[A-Za-z]/.test(code[i + 2] ?? '')
                const isOpen = /[A-Za-z]/.test(next)
                if (isClose || isOpen) {
                    const end = findJsxTagEnd(code, i)
                    if (end > i) {
                        const tagText = code.slice(i, end)
                        out += highlightJsxTag(tagText)
                        if (isClose) jsxDepth--
                        else if (!tagText.endsWith('/>')) jsxDepth++
                        i = end
                        if (jsxDepth === 0) jsStart = end
                        continue
                    }
                }
                // Not a real tag (lone `<`) — emit as escaped text
                out += '&lt;'
                i++
            } else {
                // `{...}` JSX expression — highlight inner as TS
                const [exprBody, after] = readBalancedBraces(code, i)
                out += '{' + highlightWithTs(exprBody) + '}'
                i = after
            }
        }
    }
    flushJs(i)
    return out
}

// Cheap heuristic: does this code contain JSX-like markup?
// Looks for `<Tag` or `</Tag` (lowercase HTML tags or PascalCase components).
function containsJsx(code: string): boolean {
    return /<\/?[A-Za-z][A-Za-z0-9]*[\s/>]/.test(code)
}

export function highlightCode(code: string, language: string): string {
    try {
        const lang = language?.toLowerCase() ?? ''
        const jsLike =
            lang === '' ||
            lang === 'tsx' ||
            lang === 'jsx' ||
            lang === 'typescript' ||
            lang === 'javascript' ||
            lang === 'ts' ||
            lang === 'js'
        // Use the custom JSX-aware parser for any JS-family (or auto) block
        // that actually contains JSX. This dodges highlight.js's typescript
        // grammar breaking on `style={{...}}`.
        if (jsLike && containsJsx(code)) {
            return highlightTsx(code)
        }
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

function renderMark(
    markType: string,
    attrs: Record<string, unknown> | undefined,
    inner: string,
): string {
    switch (markType) {
        case 'bold':
            return `<strong>${inner}</strong>`
        case 'italic':
            return `<em>${inner}</em>`
        case 'strike':
            return `<s>${inner}</s>`
        case 'highlight':
            return `<mark>${inner}</mark>`
        case 'code':
            return `<code>${inner}</code>`
        case 'link': {
            const href = String(attrs?.href ?? '')
            if (!/^(https?:|mailto:)/.test(href)) return inner
            const target = attrs?.target ? ` target="${escapeHtml(String(attrs.target))}"` : ''
            return `<a href="${escapeHtml(href)}"${target} rel="noopener noreferrer">${inner}</a>`
        }
        default:
            return inner
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
            const title = node.attrs?.title
                ? ` title="${escapeHtml(String(node.attrs.title))}"`
                : ''
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
