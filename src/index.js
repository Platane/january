import { createStore, applyMiddleware, compose } from 'redux'
import { reduce } from './reducer'
import * as action from './action'

import { init as initUI } from './sideEffect/ui'
import { init as initRouter } from './sideEffect/router'

export type { State } from './reducer'
import type { State } from './reducer'
import type { Action } from './action'
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux'

export type Store = ReduxStore<State, Action>
export type Dispatch = ReduxDispatch<Action>

let store
{
    const crashReporter = store => next => action => {
        try {
            return next(action)
        } catch (err) {
            console.error('Caught an exception!', err)
            throw err
        }
    }

    // create redux store
    const middlewares = [crashReporter]
    const enhancers = [
        ...('undefined' != typeof window && window.__REDUX_DEVTOOLS_EXTENSION__
            ? [
                  window.__REDUX_DEVTOOLS_EXTENSION__({
                      maxAge: 50,
                      latency: 500,
                  }),
              ]
            : []),
        applyMiddleware(...middlewares),
    ]
    store = createStore(reduce, window._initState, compose(...enhancers))
}

;[initUI, initRouter].forEach(init => init(store))
