// resources/js/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

// Merge clases Tailwind sin conflictos
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Formatear fecha en español
export function formatDate(date: string | Date, pattern = 'd MMM yyyy') {
    return format(new Date(date), pattern, { locale: es })
}

// "hace 3 días"
export function timeAgo(date: string | Date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

// Tiempo de lectura legible
export function readTime(minutes: number) {
    return `${minutes} min de lectura`
}

// Truncar texto
export function truncate(str: string, length: number) {
    return str.length > length ? str.slice(0, length) + '...' : str
}
