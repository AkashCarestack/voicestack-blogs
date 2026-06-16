import posthog from 'posthog-js'

import { config } from '../../config.js'

/** Super property on all events so this site is distinct from other apps sharing the same PostHog project. */
export const POSTHOG_APP_SOURCE = config.app_source

let clientInitialized = false

export function initPosthog(): void {
  if (typeof window === 'undefined' || clientInitialized) return

  const key = config.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return

  const apiHost =
  config.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  posthog.init(key, {
    api_host: apiHost,
    capture_pageview: false,
    persistence: 'localStorage+cookie',
  })

  posthog.register({ app_source: config.app_source })
  clientInitialized = true
}

export function capturePageview(): void {
  if (typeof window === 'undefined') return
  if (!clientInitialized) initPosthog()
  if (!clientInitialized) return

  posthog.capture('$pageview', {
    page_url: window.location.href,
    path: window.location.pathname,
  })
}

export { posthog }
