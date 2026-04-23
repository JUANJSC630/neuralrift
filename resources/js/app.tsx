import '../css/app.css'
import './bootstrap'

import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot, hydrateRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        tracesSampleRate: 0.2,
        integrations: [Sentry.browserTracingIntegration()],
    })
}

createInertiaApp({
    title: title => `${title} - ${appName}`,
    resolve: name =>
        resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />)
            return
        }

        createRoot(el).render(<App {...props} />)
        document.body.classList.add('cursor-ready')
    },
    progress: {
        color: '#4B5563',
    },
})
