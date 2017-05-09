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
