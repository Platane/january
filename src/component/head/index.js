import { Head as Component } from './component'
import { connect } from 'react-redux'
import type { State } from '../../reducer'

const mapStateToProps = (state: State, { postId }) => {
    let props = {}
    switch (state.path[0]) {
        case 'post':
            const post = state.selectedPost

            if (post)
                props = {
                    title: post.title,
                    description: post.title,

                    image_url: post.medias[0] && post.medias[0].url,
                }

            break

        case 'about':
        case 'home':
            props = {
                title: '',
                description: '',
            }
    }

    return {
        ...props,
        initState: JSON.stringify(state),
    }
}

export const Head = connect(mapStateToProps)(Component)
