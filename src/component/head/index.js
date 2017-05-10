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
    let props = {
        title: 'edouard',
        description: "Edouard's travel blog - The best ideas are not popular yet.",
    }

    if (state.selectedPost) {
        const post = state.selectedPost

        if (post) {
            const image =
                post.medias[0] &&
                post.medias[0].image &&
                selectBestImage(post.medias[0].image.resized, 1200, 600)

            props = {
                ...props,
                title: post.title,
                description: post.content_preview,

                published_date: post.date,
                tags: post.tags,

                image_url: image && relativeToAbsolute(image.url),
                image_width: image && image.dimension[0],
                image_height: image && image.dimension[1],
            }
        }
    } else if (state.selectedTag) {
        props = {
            ...props,
            description: "Edouard's travel blog - The best ideas are not popular yet." +
                ` Last post about ${state.selectedTag}`,

            tags: [state.selectedTag],
        }

        const lastPost = state.posts.find(
            post =>
                post.tags.includes(state.selectedTag) &&
                post.medias[0] &&
                post.medias[0].image
        )

        if (lastPost) {
            const image = selectBestImage(
                lastPost.medias[0].image.resized,
                1200,
                600
            )

            props = {
                image_url: image && relativeToAbsolute(image.url),
                image_width: image && image.dimension[0],
                image_height: image && image.dimension[1],
            }
        }
    }

    return {
        ...props,
        url: appPath.buildAbsolute(state.path.join('/')),
        initState: JSON.stringify(state),
    }
}

export const Head = connect(mapStateToProps)(Component)
