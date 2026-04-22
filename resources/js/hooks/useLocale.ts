// resources/js/hooks/useLocale.ts
import { usePage } from '@inertiajs/react'
import { t as translate, localePath as lp, type Locale } from '@/lib/i18n'
import type { PageProps } from '@/types'

/**
 * Returns the current locale from Inertia shared props,
 * plus a pre-bound `t()` and `localePath()` for convenience.
 */
export function useLocale() {
    const { locale } = usePage<PageProps>().props
    const lang: Locale = locale ?? 'es'

    return {
        locale: lang,
        isEn: lang === 'en',
        t: (key: Parameters<typeof translate>[0]) => translate(key, lang),
        localePath: (path: string) => lp(path, lang),
    }
}
