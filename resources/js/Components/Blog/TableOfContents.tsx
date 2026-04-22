import { useState, useEffect, useRef } from 'react'

interface Heading {
    id: string
    text: string
    level: number
}

interface Props {
    content: string
}

export default function TableOfContents({ content }: Props) {
    const [headings, setHeadings] = useState<Heading[]>([])
    const [activeId, setActiveId] = useState<string>('')
    const observerRef = useRef<IntersectionObserver | null>(null)

    // Parse headings from rendered HTML string
    useEffect(() => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(content, 'text/html')
        const nodes = doc.querySelectorAll('h2, h3')
        const items: Heading[] = []

        nodes.forEach((node, i) => {
            const id = node.id || `heading-${i}`
            items.push({
                id,
                text: node.textContent ?? '',
                level: parseInt(node.tagName[1]),
            })
        })

        setHeadings(items)
    }, [content])

    // Assign IDs to live DOM nodes and set up IntersectionObserver
    useEffect(() => {
        if (headings.length === 0) return

        const domNodes = document.querySelectorAll('.nr-prose h2, .nr-prose h3')
        headings.forEach((h, i) => {
            if (domNodes[i]) domNodes[i].id = h.id
        })

        observerRef.current?.disconnect()
        observerRef.current = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActiveId(entry.target.id)
                })
            },
            { rootMargin: '-20% 0% -70% 0%' },
        )

        headings.forEach(h => {
            const el = document.getElementById(h.id)
            if (el) observerRef.current?.observe(el)
        })

        return () => observerRef.current?.disconnect()
    }, [headings])

    if (headings.length < 2) return null

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <div className="glass rounded-2xl p-5">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-nr-faint">
                Contenido
            </p>
            <nav className="space-y-1">
                {headings.map(heading => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        onClick={e => {
                            e.preventDefault()
                            scrollTo(heading.id)
                        }}
                        className={[
                            'block text-sm leading-relaxed transition-colors',
                            heading.level === 3 ? 'pl-3' : '',
                            activeId === heading.id
                                ? 'font-medium text-nr-accent'
                                : 'text-nr-faint hover:text-nr-muted',
                        ].join(' ')}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </div>
    )
}
