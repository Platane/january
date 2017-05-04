/* global history  window */

import type { Store } from '../index'

import * as action from '../action'

const BASE_PATH = (process.env.BASE_PATH || '/').split('/').filter(Boolean)

const stripPrefix = (prefix, path) => path.slice(prefix.length)

const read = (): Array<string> => {
    if (!window || !window.location) return []
    return stripPrefix(
        BASE_PATH,
        window.location.pathname.split('/').filter(Boolean)
    )
}

const write = (path: Array<string>) =>
    history.pushState({}, '', '/' + [...BASE_PATH, ...path].join('/'))

const equal = (a: Array<string>, b: Array<string>): boolean =>
    a.length == b.length && a.every((_, i) => a[i] === b[i])

export const init = (store: Store) => {
    // input (read the location)
    {
        // read the current location and dispatch the action, only if the path is different
        const update = () => {
            const newPath = read()
            if (!equal(newPath, store.getState().path))
                store.dispatch(action.navigatorRead(newPath))
        }

        // do it at every location change ...
        if (typeof window !== 'undefined') {
            window.addEventListener('popstate', update)
        }

        // ...and right now
        update()
    }

    //output (write the location)
    {
        store.subscribe(() => {
            const newPath = store.getState().path
            if (!equal(newPath, read())) write(newPath)
        })
    }
    // store.
}
