import type { Action } from '../action'
import type { State } from './index'

export const primaryTags = ['update', 'world', 'essential']

const extractPrimaryTag = post =>
    post.tags.find(tag => primaryTags.includes(tag)) || primaryTags[0]

export const reduceSelectedTag = (state: State, action: Action): State => {
    if (state.selectedPost)
        state = {
            ...state,
            selectedTag: extractPrimaryTag(state.selectedPost),
        }

    switch (action.type) {
        case 'navigatorRead':
            return {
                ...state,
                selectedTag: primaryTags.includes(action.path[0])
                    ? action.path[0]
                    : null,
            }

        case 'goTo:home':
        case 'goTo:about':
            return {
                ...state,
                selectedTag: null,
            }

        case 'selectTag':
            return {
                ...state,
                selectedTag: action.tag,
            }

        default:
            return state
    }
}
