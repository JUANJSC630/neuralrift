// resources/js/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { es, enUS } from 'date-fns/locale'

// Merge clases Tailwind sin conflictos
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, pattern = 'd MMM yyyy', locale: 'es' | 'en' = 'es') {
    return format(new Date(date), pattern, { locale: locale === 'en' ? enUS : es })
}

export function timeAgo(date: string | Date, locale: 'es' | 'en' = 'es') {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: locale === 'en' ? enUS : es })
}

export function readTime(minutes: number, locale: 'es' | 'en' = 'es') {
    return locale === 'en' ? `${minutes} min read` : `${minutes} min de lectura`
}

// Truncar texto
export function truncate(str: string, length: number) {
    return str.length > length ? str.slice(0, length) + '...' : str
}
