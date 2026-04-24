import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import php from 'highlight.js/lib/languages/php'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'

// StarterKit v3 ya incluye Link — no importar por separado para evitar duplicado
const lowlight = createLowlight()
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('php', php)
lowlight.register('bash', bash)
lowlight.register('css', css)
lowlight.register('xml', xml)
lowlight.register('json', json)
// tsx/jsx usan las mismas gramáticas que ts/js
lowlight.registerAlias('typescript', ['tsx'])
lowlight.registerAlias('javascript', ['jsx'])

const CODE_LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'tsx',        label: 'TSX' },
    { value: 'jsx',        label: 'JSX' },
    { value: 'php',        label: 'PHP' },
    { value: 'bash',       label: 'Bash' },
    { value: 'css',        label: 'CSS' },
    { value: 'xml',        label: 'HTML' },
    { value: 'json',       label: 'JSON' },
]

interface Props {
    content: string
    onChange: (value: string) => void
    placeholder?: string
}

function ToolbarBtn({
    onClick,
    active,
    title,
    children,
}: {
    onClick: () => void
    active?: boolean
    title?: string
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`rounded px-2 py-1 text-xs transition-colors ${
                active
                    ? 'bg-nr-accent/20 text-nr-accent'
                    : 'text-nr-faint hover:bg-white/[0.06] hover:text-nr-muted'
            }`}
        >
            {children}
        </button>
    )
}

export default function TiptapEditor({
    content,
    onChange,
    placeholder = 'Escribe aquí...',
}: Props) {
    const editor = useEditor({
        extensions: [
            // link: false para que no duplique — configuramos las opciones aquí mismo
            StarterKit.configure({
                codeBlock: false,
                link: { openOnClick: false },
            }),
            Image,
            CodeBlockLowlight.configure({ lowlight }),
            Placeholder.configure({ placeholder }),
            CharacterCount,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight.configure({ multicolor: false }),
        ],
        content: content ? JSON.parse(content) : '',
        onUpdate: ({ editor }) => {
            onChange(JSON.stringify(editor.getJSON()))
        },
    })

    if (!editor) return null

    const addImage = () => {
        const url = window.prompt('URL de la imagen')
        if (url) editor.chain().focus().setImage({ src: url }).run()
    }

    const setLink = () => {
        const prev = editor.getAttributes('link').href as string | undefined
        const url = window.prompt('URL del enlace', prev ?? '')
        if (url === null) return
        if (url === '') {
            editor.chain().focus().unsetLink().run()
        } else {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    const words = editor.storage.characterCount?.words() ?? 0
    const chars = editor.storage.characterCount?.characters() ?? 0
    const readTime = Math.max(1, Math.round(words / 200))

    return (
        <div className="glass overflow-hidden rounded-xl border border-white/[0.08]">
            <style>{`
                .prose-nr .ProseMirror { outline: none; min-height: 320px; padding: 1rem; }
                .prose-nr .ProseMirror > * + * { margin-top: 0.75em; }
                .prose-nr .ProseMirror h1 { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; }
                .prose-nr .ProseMirror h2 { font-size: 1.25rem; font-weight: 600; color: #e2e8f0; }
                .prose-nr .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; color: #cbd5e1; }
                .prose-nr .ProseMirror p { color: #94a3b8; line-height: 1.7; }
                .prose-nr .ProseMirror strong { color: #e2e8f0; }
                .prose-nr .ProseMirror em { color: #a5b4fc; }
                .prose-nr .ProseMirror a { color: #7C6AF7; text-decoration: underline; }
                .prose-nr .ProseMirror code { background: rgba(255,255,255,0.08); padding: 0.1em 0.35em; border-radius: 4px; font-size: 0.85em; color: #c3e88d; font-family: 'JetBrains Mono', monospace; }
                .prose-nr .ProseMirror pre { background: rgba(0,0,0,0.4); border-radius: 8px; padding: 1em; overflow-x: auto; border: 1px solid rgba(255,255,255,0.06); }
                .prose-nr .ProseMirror pre code { background: transparent; padding: 0; color: #cdd6f4; }
                .prose-nr .ProseMirror blockquote { border-left: 3px solid #7C6AF7; padding-left: 1em; color: #64748b; font-style: italic; }
                .prose-nr .ProseMirror ul { list-style: disc; padding-left: 1.5em; color: #94a3b8; }
                .prose-nr .ProseMirror ol { list-style: decimal; padding-left: 1.5em; color: #94a3b8; }
                .prose-nr .ProseMirror hr { border-color: rgba(255,255,255,0.08); }
                .prose-nr .ProseMirror img { max-width: 100%; border-radius: 8px; }
                .prose-nr .ProseMirror mark { background: rgba(124,106,247,0.25); color: #c4b5fd; border-radius: 2px; }
                .prose-nr .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #374151; pointer-events: none; float: left; height: 0; }
            `}</style>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b border-white/[0.06] px-3 py-2">
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    title="Negrita"
                >
                    B
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    title="Cursiva"
                >
                    <em>I</em>
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive('strike')}
                    title="Tachado"
                >
                    <s>S</s>
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    active={editor.isActive('highlight')}
                    title="Resaltado"
                >
                    M
                </ToolbarBtn>

                <span className="mx-1 h-4 w-px bg-white/10" />

                {([1, 2, 3] as const).map(level => (
                    <ToolbarBtn
                        key={level}
                        onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                        active={editor.isActive('heading', { level })}
                        title={`Título ${level}`}
                    >
                        H{level}
                    </ToolbarBtn>
                ))}

                <span className="mx-1 h-4 w-px bg-white/10" />

                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    title="Lista"
                >
                    ≡
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    title="Lista numerada"
                >
                    №
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    title="Cita"
                >
                    "
                </ToolbarBtn>

                <span className="mx-1 h-4 w-px bg-white/10" />

                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive('code')}
                    title="Código inline"
                >{`<>`}</ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    active={editor.isActive('codeBlock')}
                    title="Bloque de código"
                >{`{ }`}</ToolbarBtn>
                {editor.isActive('codeBlock') && (
                    <select
                        value={editor.getAttributes('codeBlock').language ?? ''}
                        onChange={e =>
                            editor
                                .chain()
                                .focus()
                                .updateAttributes('codeBlock', { language: e.target.value })
                                .run()
                        }
                        className="ml-1 rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-nr-faint outline-none focus:text-nr-muted"
                        title="Idioma del bloque"
                    >
                        <option value="">auto</option>
                        {CODE_LANGUAGES.map(l => (
                            <option key={l.value} value={l.value}>
                                {l.label}
                            </option>
                        ))}
                    </select>
                )}

                <span className="mx-1 h-4 w-px bg-white/10" />

                <ToolbarBtn onClick={addImage} title="Imagen">
                    ⬜
                </ToolbarBtn>
                <ToolbarBtn onClick={setLink} active={editor.isActive('link')} title="Enlace">
                    🔗
                </ToolbarBtn>

                <span className="mx-1 h-4 w-px bg-white/10" />

                <ToolbarBtn
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    active={editor.isActive({ textAlign: 'left' })}
                    title="Izquierda"
                >
                    ⬅
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    active={editor.isActive({ textAlign: 'center' })}
                    title="Centrar"
                >
                    ↔
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    active={editor.isActive({ textAlign: 'right' })}
                    title="Derecha"
                >
                    ➡
                </ToolbarBtn>

                <span className="mx-1 h-4 w-px bg-white/10" />

                <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Deshacer">
                    ↩
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Rehacer">
                    ↪
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Separador"
                >
                    —
                </ToolbarBtn>
            </div>

            {/* Editor */}
            <div className="prose-nr">
                <EditorContent editor={editor} />
            </div>

            {/* Footer stats */}
            <div className="flex gap-4 border-t border-white/[0.04] px-4 py-2 font-mono text-[10px] text-nr-faint">
                <span>{words} palabras</span>
                <span>{chars} caracteres</span>
                <span>~{readTime} min lectura</span>
            </div>
        </div>
    )
}
