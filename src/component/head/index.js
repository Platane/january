import { Head as Component } from './component'
import { connect } from 'react-redux'
import { selectBestImage } from '../image/util'
import type { State } from '../../reducer'

const mapStateToProps = (state: State) => {
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
        case void 0:
        case null:
            props = {
                title: 'edouard',
                description: 'The best ideas are not popular yet.',
            }
    }

    return {
        ...props,
        initState: JSON.stringify(state),
    }
}

export const Head = connect(mapStateToProps)(Component)
