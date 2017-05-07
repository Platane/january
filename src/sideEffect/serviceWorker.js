/* global navigator */

import type { Store } from '../index'

const BASE_PATH = (process.env.BASE_PATH || '/').split('/').filter(Boolean)

export const init = (store: Store) => {
    if (
        'undefined' === typeof navigator ||
        'function' !== typeof navigator.serviceWorker
    )
        return

    navigator.serviceWorker([...BASE_PATH, 'sw.js'].join('/')).catch(err =>
        // eslint-disable-next-line no-console
        console.warn('service worker error', err)
    )
}
