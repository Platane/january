import React from 'react'
import { Transition } from 'react-propstransition'
import { selectBestImage } from './util'
import type { ImageBundle } from '../../../scripts/imageBundler/postImage'
import style from './style.css'

export type Props = {
    label?: string,
    image?: ImageBundle,
    width?: number,
    height?: number,
}

export type State = {
    loaded: boolean,
    url: ?string,
    blurUrl: ?string,
}

const createStore = () => {
    const imageLoaded = {}

    return {
        isImageLoaded: url => !!(url && imageLoaded[url]),
        flagAsLoaded: url => void (url && (imageLoaded[url] = true)),
        getBestBlur: (image, width, height): string => image.base64,
        getBestResolution: (image, width, height): string =>
            (selectBestImage(image.resized, width, height) || {
                url: image.base64,
            }).url,
    }
}

const imageLoadedStore = createStore()

const sameContent = (a, b) =>
    a.slice(-3) !== 'jpg' ||
    b.slice(-3) !== 'jpg' ||
    a.slice(0, 8) === b.slice(0, 8)

export class Image extends React.Component<*, Props, State> {
    props: Props

    state = { loaded: false, url: null, blurUrl: null }

    onLoad = () => {
        imageLoadedStore.flagAsLoaded(this.state.url)
        this.setState({ loaded: true })
    }

    constructor(props: Props) {
        super(props)

        const blurUrl =
            props.image &&
            imageLoadedStore.getBestBlur(
                props.image,
                props.width || 800,
                props.height || 600
            )
        const url =
            props.image &&
            imageLoadedStore.getBestResolution(
                props.image,
                props.width || 800,
                props.height || 600
            )
        const loaded = imageLoadedStore.isImageLoaded(url)

        this.state.blurUrl = blurUrl || null
        this.state.url = url || null
        this.state.loaded = loaded
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return (
            this.props.label != nextProps.label ||
            this.state.url != nextState.url ||
            this.state.loaded != nextState.loaded
        )
    }

    componentWillReceiveProps(nextProps: Props) {
        const blurUrl =
            nextProps.image &&
            imageLoadedStore.getBestBlur(
                nextProps.image,
                nextProps.width || 800,
                nextProps.height || 600
            )
        const url =
            nextProps.image &&
            imageLoadedStore.getBestResolution(
                nextProps.image,
                nextProps.width || 800,
                nextProps.height || 600
            )
        const loaded = imageLoadedStore.isImageLoaded(url)

        this.setState({ blurUrl, url, loaded })
    }

    afterRender = () => {
        if (this.refs.image) {
            // test if image is loaded
            if (this.refs.image.naturalWidth) {
                this.onLoad()
            } else {
                this.refs.image.removeEventListener('load', this.onLoad)
                this.refs.image.addEventListener('load', this.onLoad)
            }
        }
    }

    render() {
        const { url, blurUrl, loaded } = this.state
        const { label } = this.props

        if ('undefined' != typeof requestAnimationFrame && url && !loaded)
            requestAnimationFrame(this.afterRender)

        return (
            <div className={style.container}>
                {url &&
                    <img
                        ref="image"
                        className={style.imageLoader}
                        alt={label}
                        src={url}
                    />}
                <Transition toTransition={loaded ? url : blurUrl} delay={400}>
                    {({ next, previous, transition }) =>
                        <div
                            className={style.background}
                            style={{
                                backgroundImage: next && `url(${next})`,
                            }}
                        >

                            {previous &&
                                transition &&
                                sameContent(next, previous) &&
                                <div
                                    key={previous || 1}
                                    className={style.backgroundTransition}
                                    style={{
                                        backgroundImage:
                                            previous && `url(${previous})`,
                                    }}
                                />}

                        </div>}
                </Transition>
            </div>
        )
    }
}
