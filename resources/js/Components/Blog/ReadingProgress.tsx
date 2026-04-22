import { useReadingProgress } from '@/hooks/useReadingProgress'

export default function ReadingProgress() {
    const progress = useReadingProgress()

    return (
        <div className="fixed left-0 right-0 top-0 z-[60] h-[3px] bg-white/[0.05]">
            <div
                className="h-full bg-gradient-to-r from-nr-accent to-nr-cyan transition-all duration-75"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}
