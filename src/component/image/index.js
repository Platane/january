import React from 'react'
import { Transition } from 'react-propsTransition'
import { selectBestImage, selectBestBlured } from './util'
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
        flagAsLoaded: url => void (imageLoaded[url] = true),
        getBestBlur: (image, width, height) =>
            (selectBestBlured(
                image.resized.filter(({ url }) => imageLoaded[url]),
                width,
                height
            ) || { url: image.base64 }).url,
        getBestResolution: (image, width, height) =>
            (selectBestImage(image.resized, width, height) || {
                url: image.base64,
            }).url,
    }
}

const imageLoadedStore = createStore()

export class Image extends React.Component<any, Props, State> {
    state = { loaded: false, url: null, blurUrl: null }

    onLoad = () => {
        imageLoadedStore.flagAsLoaded(this.state.url)
        this.setState({ loaded: true })
    }

    constructor(props: Props) {
        // props.width = props.width || 800
        // props.height = props.height || 600

        super(props)

        this.state.blurUrl =
            props.image &&
            imageLoadedStore.getBestBlur(
                props.image,
                props.width || 800,
                props.height || 600
            )
        this.state.url =
            props.image &&
            imageLoadedStore.getBestResolution(
                props.image,
                props.width || 800,
                props.height || 600
            )
        this.state.loaded = imageLoadedStore.isImageLoaded(this.state.url)
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
                <Transition toTransition={loaded ? url : blurUrl} delay={300}>
                    {({ next, previous, transition }) => (
                        <div
                            className={style.background}
                            style={{
                                backgroundImage: next && `url(${next})`,
                            }}
                        >

                            {transition &&
                                <div
                                    key={previous || 1}
                                    className={style.backgroundTransition}
                                    style={{
                                        backgroundImage: previous &&
                                            `url(${previous})`,
                                    }}
                                />}

                        </div>
                    )}
                </Transition>
            </div>
        )
    }
}
