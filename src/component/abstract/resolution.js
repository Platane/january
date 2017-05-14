import React from 'react'
import EventEmitter from 'events'
import PropTypes from 'prop-types'

/**
 * the provider component listen to device resolution change,
 *
 * when it does change, every subscriber get an update
 *
 * The inbjector is a hoc which subscribe to device resolution change and inject the `device` props to the component
 */

const computeResolution = (width: number) => (width < 800 ? 'palm' : 'desktop')

type Device = 'palm' | 'desktop'

export class Provider extends React.Component {
    _device: Device = 'palm'

    ee = new EventEmitter()

    getDevice: () => Device = () => this._device

    subsribe = (fn: () => any) => {
        this.ee.addListener('update', fn)
        return () => this.ee.removeListener('update', fn)
    }

    static childContextTypes = {
        subsribe: PropTypes.func,
        getDevice: PropTypes.func,
    }

    onResize = () => {
        const device = computeResolution(
            ('undefined' !== typeof window && window.innerWidth) || 0
        )

        if (device !== this._device) {
            this._device = device
            this.ee.emit('update')
        }
    }

    getChildContext() {
        return {
            subsribe: this.subsribe,
            getDevice: this.getDevice,
        }
    }

    componentDidMount() {
        if ('undefined' === typeof window) return
        window.removeEventListener('resize', this.onResize)
        window.addEventListener('resize', this.onResize)
        this.onResize()
    }

    componentWillUnmount() {
        if ('undefined' === typeof window) return
        window.removeEventListener('resize', this.onResize)
    }

    render() {
        return React.Children.only(this.props.children)
    }
}

export const injectDevice = C => {
    class DeviceInjector extends React.Component {
        static contextTypes = {
            subsribe: PropTypes.func,
            getDevice: PropTypes.func,
        }

        _unsubscribe = null

        state = { device: 'palm' }

        constructor(props: Object, context: Object) {
            super(props, context)

            this.state = { device: context.getDevice() }

            this._unsubscribe = context.subsribe(() =>
                this.setState({ device: context.getDevice() })
            )
        }

        componentWillUnmount() {
            this._unsubscribe && this._unsubscribe()
        }

        render() {
            return <C {...this.props} device={this.state.device} />
        }
    }
    return DeviceInjector
}
