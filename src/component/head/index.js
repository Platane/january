import { Head as Component } from './component'
import { connect } from 'react-redux'
import { selectBestImage } from '../image/util'
import * as appPath from '../../../scripts/appPath'
import type { State } from '../../reducer'

const relativeToAbsolute = path => {
    const prefix = appPath.build('/')

    return appPath.buildAbsolute(path.slice(prefix.length))
}

const mapStateToProps = (state: State, links) => {
    let props = {}
    switch (state.path[0]) {
        case 'post':
            const post = state.selectedPost

            if (post) {
                const image =
                    post.medias[0] &&
                    post.medias[0].image &&
                    selectBestImage(post.medias[0].image.resized, 1200, 600)

                props = {
                    title: post.title,
                    description: post.content_preview,

                    image_url: image && relativeToAbsolute(image.url),
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
        url: appPath.buildAbsolute(state.path.join('/')),
        initState: JSON.stringify(state),
    }
}

export const Head = connect(mapStateToProps)(Component)
