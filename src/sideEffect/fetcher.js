/* global fetch */
import type { Store } from '../index'
import * as action from '../action'
import { build as buildPath } from '../../scripts/appPath'

const actionForUri = uri => {
    if (uri.match(/data\/(\w+)\/(\w+)\.json/)) {
        const [, tag] = uri.match(/data\/(\w+)\/(\w+)\.json/) || []

        return ({ posts, next }) => action.postsFetched(posts, tag, next)
    } else return action.fetchError
}

export const init = (store: Store) => {
    const fetching = {}

    const update = () =>
        store
            .getState()
            .fetcher.toFetch.filter(uri => !fetching[uri])
            .forEach(uri => {
                fetching[uri] = true
                fetch(buildPath(uri))
                    .then(res => res.json())
                    .then(res => store.dispatch(actionForUri(uri)(res)))
                    .catch(err => store.dispatch(action.fetchError(err)))
            })

    update()
    store.subscribe(update)
}
