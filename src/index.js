import { createStore, applyMiddleware, compose } from 'redux'
import { reduce } from './reducer'

import { init as initUI } from './sideEffect/ui'
import { init as initRouter } from './sideEffect/router'
import { init as initFetcher } from './sideEffect/fetcher'
import { init as initServiceWorker } from './sideEffect/serviceWorker'

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
            // eslint-disable-next-line no-console
            console.warn('Caught an exception!', err)
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

;[initUI, initRouter, initFetcher, initServiceWorker].forEach(init =>
    init(store)
)
