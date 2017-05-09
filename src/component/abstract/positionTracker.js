import React from 'react'
import PropTypes from 'prop-types'

type Box = { top: 0, left: 0, width: 0, height: 0 }

export class Provider extends React.Component<*, *, Object> {
    state = {}

    writePosition = (key: string, box: Box): void =>
        this.setState({ [key]: box })

    getPosition = (key: string): Box | null => this.state[key]

    static childContextTypes = {
        writePosition: PropTypes.func,
        getPosition: PropTypes.func,
    }

    getChildContext() {
        return {
            writePosition: this.writePosition,
            getPosition: this.getPosition,
        }
    }

    render() {
        return React.Children.only(this.props.children)
    }
}

export const injectPositionTracker = C => {
    class PositionTrackerInjector extends React.Component {
        static contextTypes = {
            writePosition: PropTypes.func,
            getPosition: PropTypes.func,
        }

        render() {
            return (
                <C
                    {...this.props}
                    writePosition={this.context.writePosition}
                    getPosition={this.context.getPosition}
                />
            )
        }
    }
    return PositionTrackerInjector
}

export class AnimateFromBox extends React.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.elementKey != nextProps.elementKey
    }

    afterRender = () => {
        if (!this.refs.item || !this.refs.item.animate || !this.props.origin)
            return

        const origin = this.props.origin
        const target = this.refs.item.getBoundingClientRect()

        const animationKey = [
            {
                width: `${origin.width}px`,
                height: `${origin.height}px`,
                transform: `translate3d(${origin.left - target.left}px,${origin.top - target.top}px,0)`,
            },
            {
                width: `${target.width}px`,
                height: `${target.height}px`,
                transform: 'translate3d(0,0,0)',
            },
        ]

        this.refs.item.animate(animationKey, { duration: 430, easing: 'ease' })
    }

    render() {
        if ('undefined' !== typeof requestAnimationFrame)
            requestAnimationFrame(this.afterRender)

        return (
            <div
                ref="item"
                style={{ width: '100%', height: '100%', position: 'relative' }}
            >
                {React.Children.only(this.props.children)}
            </div>
        )
    }
}
