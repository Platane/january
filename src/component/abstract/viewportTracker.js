import React from 'react'

import { throttle } from '../../util/time'

type Props = {
    margin: number,
    onReachBottom: () => any,
}

export class ViewportTracker extends React.Component<*, Props, *> {
    props: Props

    onViewportUpdate() {
        // const element = document.querySelector(this.props.query)

        if (!this.refs.container || !document.body) return

        const box = this.refs.container.getBoundingClientRect()

        const container = {
            top: document.body.scrollTop + box.top,
            height: box.height,
            bottom: 0,
        }
        container.bottom = container.top + container.height

        const viewport = {
            top: document.body.scrollTop,
            height: window.innerHeight,
            bottom: 0,
        }
        viewport.bottom = viewport.top + viewport.height

        if (container.bottom - (this.props.margin || 0) < viewport.bottom)
            this.props.onReachBottom && this.props.onReachBottom()
    }

    constructor() {
        super()

        this.onViewportUpdate = throttle(200, this.onViewportUpdate.bind(this))
    }

    componentDidMount() {
        window.removeEventListener('resize', this.onViewportUpdate)
        window.removeEventListener('scroll', this.onViewportUpdate)
        window.addEventListener('resize', this.onViewportUpdate)
        window.addEventListener('scroll', this.onViewportUpdate)
        this.onViewportUpdate()
    }

    render() {
        return (
            <div ref="container">
                {React.Children.only(this.props.children)}
            </div>
        )
    }
}
