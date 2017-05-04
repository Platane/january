import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { App } from '../../../src/component/app'
import { Head } from '../../../src/component/head'
import { reduce } from '../../../src/reducer'

import type { Action } from '../../../src/action'

export const render = (
    links: {
        appScript: string,
        appStyle: string,
    },
    actions: Array<Action>
) => {
    const store = createStore(reduce)

    actions.forEach(action => store.dispatch(action))

    const app = ReactDOMServer.renderToString(
        <Provider store={store}><App /></Provider>
    )

    const head = ReactDOMServer.renderToStaticMarkup(
        <Provider store={store}>
            <Head links={links} />
        </Provider>
    )

    return [
        '<html>',
        head,
        `<body><div id="app">${app}</div></body>`,
        '</html>',
    ].join('')
}
