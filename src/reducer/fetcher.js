import type { Action } from '../action'
import type { State } from './index'

const unique = arr => arr.filter((a, i, arr) => i === arr.indexOf(a))

import { primaryTags } from './selectedTag'

// manipulate the toFetch array
export const reduceFetcher = (state: State, action: Action): State => {
    const oldFetcher = state.fetcher
    let newFetcher = state.fetcher

    // save the next id
    if ('postsFetched' === action.type) {
        const { next, tag } = action

        if (tag)
            newFetcher = {
                ...newFetcher,
                next: { ...newFetcher.next, [tag]: next },
                ended: { ...newFetcher.ended, [tag]: !next },
            }
    }

    // determine what to fetch
    {
        const tagToFetch = []

        // explicit action
        if ('loadMorePosts' === action.type)
            tagToFetch.push(action.tag || 'all')

        // if a filter is applied, we need to load all the data
        if (state.selectedTag && !primaryTags.includes(state.selectedTag))
            tagToFetch.push('all')

        // if 'all' is ended, no need to futher requests
        if (newFetcher.ended.all) tagToFetch.length = 0

        unique(tagToFetch)
            .filter(tag => !newFetcher.ended[tag])
            .forEach(tag => {
                const nextId = newFetcher.next[tag] || 'top'

                const uri = `data/${tag}/${nextId}.json`

                newFetcher = {
                    ...newFetcher,
                    toFetch: unique([uri, ...newFetcher.toFetch]),
                }
            })
    }

    return oldFetcher === newFetcher
        ? state
        : {
              ...state,
              fetcher: newFetcher,
          }
}
