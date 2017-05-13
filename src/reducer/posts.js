import { extractText } from '../../scripts/contentParser/markdown/treeUtil'
import type { Action } from '../action'
import type { State } from './index'

const uniqueId = arr =>
    arr.filter((a, i, arr) => i === arr.findIndex(b => a.id === b.id))

const unique = arr => arr.filter((a, i, arr) => i === arr.indexOf(a))

const computeTags = posts => {
    const tags = [].concat(...posts.map(({ tags }) => tags))

    const count = {}
    tags.forEach(t => (count[t] = (0 | count[t]) + 1))

    return unique(tags).sort((a, b) => (count[a] < count[b] ? 1 : -1))
}

const parsePost = post => {
    const text = extractText(post.content)
    const words = text.split(' ')

    const READING_VELOCITY = 200
    const MAX_PREVIEW_LENGTH = 100

    post.reading_duration = words.length / READING_VELOCITY

    post.content_preview =
        text
            // take the first paragraph only
            .split('\n')[0]
            // split into words
            .split(' ')
            // add word as long as the text is small enougth
            .reduce(
                (text, w) =>
                    (text + w).length < MAX_PREVIEW_LENGTH
                        ? text + ' ' + w
                        : text,
                ''
            ) + '…'

    return post
}

// second layer of reducer, manipulate the posts and tags fields
export const reducePosts = (state: State, action: Action): State => {
    switch (action.type) {
        case 'postsFetched':
            const posts = uniqueId([
                ...state.posts,
                ...action.posts.map(parsePost),
            ]).sort((a, b) => (a.date < b.date ? 1 : -1))
            return {
                ...state,
                posts,
                tags: computeTags(posts),
            }

        default:
            return state
    }
}
