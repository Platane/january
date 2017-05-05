import { Head as Component } from './component'
import { connect } from 'react-redux'
import type { State } from '../../reducer'

const selectBestImage = (images, width, height) => {
    const error = (w, h) =>
        Math.abs(w - width) / width + Math.abs(h - height) / height

    return images.reduce(
        (best, x) =>
            !best || error(...best.dimension) > error(...x.dimension)
                ? x
                : best,
        null
    )
}

const mapStateToProps = (state: State, { postId }) => {
    let props = {}
    switch (state.path[0]) {
        case 'post':
            const post = state.selectedPost

            if (post) {
                const image =
                    post.medias[0] &&
                    post.medias[0].image &&
                    selectBestImage(post.medias[0].image.resized, 800, 600)

                props = {
                    title: post.title,
                    description: post.title,

                    image_url: image && image.url,
                    image_width: image && image.dimension[0],
                    image_height: image && image.dimension[1],
                }
            }

            break

        case 'about':
        case 'home':
            props = {
                title: '',
                description: 'The best ideas are not popular yet.',
            }
    }

    return {
        ...props,
        initState: JSON.stringify(state),
    }
}

export const Head = connect(mapStateToProps)(Component)
