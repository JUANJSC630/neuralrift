import Modal from '@/Components/Modal'

interface ConfirmModalProps {
    show: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'accent' | 'danger'
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({
    show,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'accent',
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const confirmClass =
        variant === 'danger'
            ? 'bg-nr-red hover:bg-nr-red/80'
            : 'bg-gradient-to-r from-nr-accent to-nr-accent-dark hover:opacity-90'

    return (
        <Modal show={show} maxWidth="sm" onClose={onCancel}>
            <div className="bg-nr-surface p-6">
                <h3 className="text-lg font-semibold text-nr-text">{title}</h3>
                <p className="mt-2 text-sm text-nr-muted">{message}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="glass rounded-lg px-4 py-2 text-sm text-nr-muted transition-colors hover:text-nr-text"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 ${confirmClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
