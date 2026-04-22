export default function MeshBackground({ className = '' }: { className?: string }) {
    return (
        <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
            <div className="mesh-bg absolute inset-0" />
            <div
                className="noise absolute inset-0 opacity-40 mix-blend-overlay"
                style={{ backgroundSize: '128px 128px' }}
            />
        </div>
    )
}
