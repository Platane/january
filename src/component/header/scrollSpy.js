import React from 'react'

import { throttle } from '../../util/time'

type Props = {
    margin: number,
    onReachBottom: () => any,
}

export const wrap = C => {
    class ViewportTracker extends React.Component<*, Props, *> {
        props: Props

        state = {
            previousScroll: 0,
            folded: false,
            goingUp: false,
            scrollDistance: 0,
        }

        onScroll = () => {
            const scrollDistance = window.scrollY > this.state.previousScroll
                ? 0
                : this.state.scrollDistance +
                      (this.state.previousScroll - window.scrollY)

            this.setState({
                scrollDistance,
                folded: window.scrollY > 0,
                goingUp: scrollDistance > 150,
                previousScroll: window.scrollY,
            })
        }

        componentDidMount() {
            window.removeEventListener('scroll', this.onScroll)
            window.addEventListener('scroll', this.onScroll)
            this.onScroll()
        }

        componentWillUnmountMount() {
            window.removeEventListener('scroll', this.onScroll)
        }

        render() {
            return <C {...this.props} {...this.state} />
        }
    }

    return ViewportTracker
}
