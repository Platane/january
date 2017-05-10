import type { Action } from '../action'
import type { State } from './index'

export const primaryTags = ['world', 'update', 'essential']

const extractPrimaryTag = post =>
    post.tags.find(tag => primaryTags.includes(tag))

export const reduceSelectedTag = (state: State, action: Action): State => {
    if (state.selectedPost)
        state = {
            ...state,
            selectedTag: extractPrimaryTag(state.selectedPost),
        }

    switch (action.type) {
        case 'navigatorRead':
            return 'category' === action.path[0]
                ? {
                      ...state,
                      selectedTag: action.path[1],
                  }
                : state

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
