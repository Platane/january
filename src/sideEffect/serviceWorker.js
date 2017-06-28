/* global navigator */

import type { Store } from '../index'

import appPath from '../../scripts/appPath'

export const init = (store: Store) => {
    if (
        'undefined' === typeof navigator ||
        !navigator.serviceWorker ||
        'function' !== typeof navigator.serviceWorker.register
    )
        return

    navigator.serviceWorker
        .register(appPath.build('sw.js'), { scope: appPath.dir })
        .catch(err =>
            // eslint-disable-next-line no-console
            console.warn('service worker error', err)
        )
}
