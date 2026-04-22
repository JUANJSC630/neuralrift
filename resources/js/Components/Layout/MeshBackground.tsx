export default function MeshBackground({ className = '' }: { className?: string }) {
    return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
            <div className="absolute inset-0 mesh-bg" />
            <div
                className="absolute inset-0 noise opacity-40 mix-blend-overlay"
                style={{ backgroundSize: '128px 128px' }}
            />
        </div>
    )
}
