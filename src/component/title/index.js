import { connect } from 'react-redux'
import type { State } from '../../reducer'

const mapStateToProps = (state: State) => {
    switch (state.path[0]) {
        case 'post':
            const post = state.selectedPost

            return { title: post && post.title }

        case null:
        case void 0:
        case 'about':
            return { title: 'edouard' }

        default:
            return {}
    }
}

const Component = ({ title }) => {
    if ('undefined' !== typeof document && title) {
        const domTitle = document.querySelector('title')

        if (domTitle) domTitle.innerHTML = title
    }

    return null
}

export const Title = connect(mapStateToProps)(Component)
