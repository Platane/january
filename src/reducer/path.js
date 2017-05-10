import { primaryTags } from './selectedTag'
import type { Action } from '../action'
import type { State } from './index'

// manipulate the path
export const reducePath = (state: State, action: Action): State => {
    // init path if needed
    if (!state.path) state = { ...state, path: [] }

    switch (action.type) {
        case 'navigatorRead':
            if (!action.path[0])
                state = {
                    ...state,
                    path: [],
                }
            else if ('about' === action.path[0])
                state = {
                    ...state,
                    path: action.path,
                }
            break

        case 'goTo:about':
            state = {
                ...state,
                path: ['about'],
            }
            break

        case 'selectTag':
        case 'goTo:home':
            state = {
                ...state,
                path: [],
            }
            break
    }

    if (state.selectedTag && state.selectedPostId) {
        // if the selectedPostId exist, force the path
        state = {
            ...state,
            path: [state.selectedTag, state.selectedPostId],
        }
    } else if (state.selectedTag && primaryTags.includes(state.selectedTag)) {
        // else
        // if the selectedTag exists and is primary
        state = {
            ...state,
            path: [state.selectedTag],
        }
    }

    return state
}
