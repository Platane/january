/* global navigator */

import type { Store } from '../index'

import { build as buildPath } from '../../scripts/appPath'

export const init = (store: Store) => {
    if (
        'undefined' === typeof navigator ||
        !navigator.serviceWorker ||
        'function' !== typeof navigator.serviceWorker.register
    )
        return

    navigator.serviceWorker.register(buildPath('sw.js')).catch(err =>
        // eslint-disable-next-line no-console
        console.warn('service worker error', err)
    )
}
