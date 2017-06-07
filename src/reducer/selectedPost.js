import type { Action } from '../action'
import type { State } from './index'

// first layer of reducer, manipulate the selectedPostId
const reduceSelectedPostId = (state: State, action: Action): State => {
    switch (action.type) {
        case 'navigatorRead':
            return {
                ...state,
                selectedPostId: action.path[1],
            }

        case 'goTo:post':
            return {
                ...state,
                selectedPostId: action.postId,
            }

        case 'goTo:home':
        case 'goTo:about':
        case 'selectTag':
            return {
                ...state,
                selectedPostId: null,
            }

        default:
            return state
    }
}

// second layer of reducer, populate the selectedPost
const _reduceSelectedPost = (state: State, action: Action): State => {
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

    if (!state.selectedPostId && state.selectedPost)
        return {
            ...state,
            selectedPost: null,
        }

    return state
}

export const reduceSelectedPost = (state: State, action: Action): State =>
    _reduceSelectedPost(reduceSelectedPostId(state, action), action)
