import { primaryTags } from './selectedTag'
import type { Action } from '../action'
import type { State } from './index'

const unique = arr => arr.filter((a, i, arr) => i === arr.indexOf(a))

// manipulate the toFetch array
export const reduceFetcher = (state: State, action: Action): State => {
    switch (action.type) {
        case 'loadMorePosts': {
            // ask to load more of a category
            const tag = action.tag || 'all'

            // will load this next chunk
            const nextId =
                state.readDataChunk.reduce(
                    (max, x) =>
                        x.tag === tag && (!max || x.id > max.id) ? x : max,
                    { id: -1 }
                ).id + 1

            const uri = `posts_${tag}_${nextId}.json`

            state = {
                ...state,
                toFetch: unique([uri, ...state.toFetch]),
            }
            break
        }

        case 'postsFetched': {
            const [, tag, id] = action.uri.match(
                /posts_(\w+)_(\d+)\.json/
            ) || []

            if (tag)
                state = {
                    ...state,
                    readDataChunk: [{ tag, id: +id }, ...state.readDataChunk],
                }
            break
        }
    }

    return state
}
