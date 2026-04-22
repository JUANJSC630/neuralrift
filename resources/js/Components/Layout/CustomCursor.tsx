import { useEffect, useRef } from 'react'

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let mouseX = 0,
            mouseY = 0
        let ringX = 0,
            ringY = 0
        let rafId = 0
        let hovered = false

        const onMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY
            if (dotRef.current) {
                // Direct: translate en el mismo frame del evento, sin lag
                dotRef.current.style.transform =
                    `translate3d(${mouseX - 6}px, ${mouseY - 6}px, 0)` +
                    (hovered ? ' scale(2)' : '')
            }
        }

        const animate = () => {
            // Lerp suave solo para el ring
            ringX += (mouseX - ringX) * 0.18
            ringY += (mouseY - ringY) * 0.18
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`
            }
            rafId = requestAnimationFrame(animate)
        }

        window.addEventListener('mousemove', onMove, { passive: true })
        rafId = requestAnimationFrame(animate)

        const onEnter = () => {
            hovered = true
            if (ringRef.current) {
                ringRef.current.style.width = '60px'
                ringRef.current.style.height = '60px'
                ringRef.current.style.borderColor = 'rgba(6,182,212,0.6)'
            }
        }
        const onLeave = () => {
            hovered = false
            if (ringRef.current) {
                ringRef.current.style.width = '40px'
                ringRef.current.style.height = '40px'
                ringRef.current.style.borderColor = 'rgba(124,106,247,0.5)'
            }
        }

        // Delegación en lugar de iterar todos los elementos (cubre dinámicos también)
        const onMouseOver = (e: MouseEvent) => {
            const t = e.target as Element
            if (t.closest('a, button, [role="button"]')) onEnter()
        }
        const onMouseOut = (e: MouseEvent) => {
            const t = e.relatedTarget as Element | null
            if (!t?.closest('a, button, [role="button"]')) onLeave()
        }

        document.addEventListener('mouseover', onMouseOver)
        document.addEventListener('mouseout', onMouseOut)

        return () => {
            cancelAnimationFrame(rafId)
            window.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseover', onMouseOver)
            document.removeEventListener('mouseout', onMouseOut)
        }
    }, [])

    return (
        <>
            <div ref={dotRef} className="cursor-dot" style={{ willChange: 'transform' }} />
            <div ref={ringRef} className="cursor-ring" style={{ willChange: 'transform' }} />
        </>
    )
}
