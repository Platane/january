import type { Action } from '../action'
import type { State } from './index'

// manipulate the path
export const reducePath = (state: State, action: Action): State => {
    // init path if needed
    if (!state.path) state = { ...state, path: [] }

    // if the selectedPostId exist, force the path
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

        case 'selectTag':
        case 'goTo:home':
            return {
                ...state,
                path: [],
            }

        default:
            return state
    }
}
