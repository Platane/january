/* global fetch */
import type { Store } from '../index'
import * as action from '../action'

const actionForUri = uri => {
    if (uri.match(/post/)) return action.postsFetched
    else return action.fetchError
}

const BASE_PATH = (process.env.BASE_PATH || '/').split('/').filter(Boolean)

export const init = (store: Store) => {
    const fetching = {}

    const update = () =>
        store.getState().toFetch.filter(uri => !fetching[uri]).forEach(uri => {
            fetching[uri] = true
            fetch('/' + [...BASE_PATH, ...uri.split('/')].join('/'))
                .then(res => res.json())
                .then(res => store.dispatch(actionForUri(uri)(res)))
                .catch(err => store.dispatch(action.fetchError(err)))
        })

    update()
    store.subscribe(update)
}
