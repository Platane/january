import { primaryTags } from './selectedTag'
import type { Action } from '../action'
import type { State } from './index'

// manipulate the path
export const reducePath = (state: State, action: Action): State => {
    // init path if needed
    if (!state.path) state = { ...state, path: [] }

    // if the selectedPostId exist, force the path
    if (state.selectedTag && state.selectedPostId) {
        if (
            // prevent from writing if already writen
            state.selectedTag != state.path[0] &&
            state.selectedPostId != state.path[1]
        )
            state = {
                ...state,
                path: [state.selectedTag, state.selectedPostId],
            }
    } else if (
        // else
        // if the selectedTag exists and is primary
        state.selectedTag &&
        primaryTags.includes(state.selectedTag)
    ) {
        state = {
            ...state,
            path: [state.selectedTag],
        }
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
