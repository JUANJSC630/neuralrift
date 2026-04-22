import { renderToHTMLString } from '@tiptap/static-renderer'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'

// Must match the extensions used in TiptapEditor (minus UI-only ones).
// renderToHTMLString works without window — safe for SSR.
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
            return renderToHTMLString({ content: json, extensions: RENDER_EXTENSIONS })
        }
    } catch {
        // Not JSON — pass through as-is (raw HTML)
    }
    return content
}
