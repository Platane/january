import type { Action } from '../action'
import type { Post } from '../../type'

const uniqueId = arr =>
    arr.filter((a, i, arr) => i === arr.findIndex(b => a.id === b.id))

const unique = arr => arr.filter((a, i, arr) => i === arr.indexOf(a))

export type State = {
    posts: Array<Post>,
    tags: Array<string>,

    selectedPost: ?Post,
    selectedPostId: ?string,
    path: Array<string>,
    toFetch: Array<string>,
}

// first layer of reduce, init the state if its null
const reduceInit = (state: ?State): State =>
    state || {
        posts: [],
        tags: [],
        selectedPost: null,
        selectedPostId: null,
        path: [],
        toFetch: ['posts.json'],
    }

const computeTags = posts => {
    const tags = [].concat(...posts.map(({ tags }) => tags))

    const count = {}
    tags.forEach(t => (count[t] = (0 | count[t]) + 1))

    return unique(tags).sort((a, b) => (count[a] < count[b] ? 1 : -1))
}

// second layer of reducer, manipulate the posts and tags fields
const reducePosts = (state: State, action: Action): State => {
    switch (action.type) {
        case 'postsFetched':
        case 'hydratePost':
            const posts = uniqueId([...state.posts, ...action.posts]).sort(
                (a, b) => (a.date < b.date ? 1 : -1)
            )
            return {
                ...state,
                posts,
                tags: computeTags(posts),
            }

        default:
            return state
    }
}

// third layer of reducer, manipulate the selectedPostId
const reduceSelectedPostId = (state: State, action: Action): State => {
    switch (action.type) {
        case 'navigatorRead':
            return 'post' === action.path[0]
                ? {
                      ...state,
                      selectedPostId: action.path[1],
                  }
                : state

        case 'goTo:post':
            return {
                ...state,
                selectedPostId: action.postId,
            }

        case 'goTo:home':
        case 'goTo:about':
            return {
                ...state,
                selectedPostId: null,
            }

        default:
            return state
    }
}

// fourth layer of reducer, populate the selectedPost
const reduceSelectedPost = (state: State, action: Action): State => {
    // if the posts list have been populated, check if the selected one is in it now
    if (
        state.selectedPostId &&
        (!state.selectedPost || state.selectedPost.id !== state.selectedPostId)
    ) {
        const selectedPost = state.posts.find(
            ({ id }) => id === state.selectedPostId
        )
        return {
            ...state,
            selectedPost,
        }
    }
    return state
}

// five layer of reducer, manipulate the path
const reducePath = (state: State, action: Action): State => {
    // init path if needed
    if (!state.path) state = { ...state, path: [] }

    // if the selectedPostId existe, force the path
    if (
        state.selectedPostId &&
        ('post' !== state.path[1] || state.selectedPostId != state.path[1])
    )
        state = {
            ...state,
            path: ['post', state.selectedPostId],
        }

    switch (action.type) {
        case 'navigatorRead':
            if (!action.path[0])
                return {
                    ...state,
                    path: [],
                }
            else if ('about' === action.path[0])
                return {
                    ...state,
                    path: action.path,
                }
            else return state

        case 'goTo:about':
            return {
                ...state,
                path: ['about'],
            }

        case 'goTo:home':
            return {
                ...state,
                path: [],
            }

        default:
            return state
    }
}

const reduceLayers = [
    reduceInit,
    reducePosts,
    reduceSelectedPostId,
    reduceSelectedPost,
    reducePath,
]

export const reduce = (state: State, action: Action): State =>
    reduceLayers.reduce((state, reduce) => reduce(state, action), state)
