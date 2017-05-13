import type { Action } from '../action'
import type { State } from './index'

const unique = arr => arr.filter((a, i, arr) => i === arr.indexOf(a))

// manipulate the toFetch array
export const reduceFetcher = (state: State, action: Action): State => {
    const oldFetcher = state.fetcher
    let newFetcher = state.fetcher

    switch (action.type) {
        case 'loadMorePosts': {
            // ask to load more of a category
            const tag = action.tag || 'all'

            if (!state.fetcher.ended[tag]) {
                // will load this next chunk
                const nextId = state.fetcher.next[tag] || 'top'

                const uri = `data/${tag}/${nextId}.json`

                newFetcher = {
                    toFetch: unique([uri, ...newFetcher.toFetch]),
                }
                break
            }
        }

        case 'postsFetched': {
            const { next, tag } = action

            if (tag)
                newFetcher = {
                    next: { ...newFetcher.next, [tag]: next },
                    ended: { ...newFetcher.ended, [tag]: !next },
                }
            break
        }
    }

    return oldFetcher === newFetcher
        ? state
        : {
              ...state,
              fetcher: {
                  ...oldFetcher,
                  ...newFetcher,
              },
          }
}
