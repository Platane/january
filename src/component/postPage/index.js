import { PostPage as Component } from './component'
import { connect } from 'react-redux'
import { injectDevice } from '../abstract/resolution'
import { primaryTags } from '../../reducer/selectedTag'

import * as action from '../../action'

const mapStateToProps = state => {
    const primaryTag =
        state.selectedPost &&
        state.selectedPost.tags.find(tag => primaryTags.includes(tag))

    const posts = state.posts.filter(({ tags }) => tags.includes(primaryTag))

    const index = posts.findIndex(
        post => state.selectedPost && post.id == state.selectedPost.id
    )

    return {
        posts,
        nextPosts: posts.slice(index + 1),
        post: state.selectedPost,
        tag: primaryTag || 'all',
    }
}

const mapDispatchToProps = {
    goToPost: action.goToPost,
    loadMorePosts: action.loadMorePosts,
}

export const PostPage = connect(mapStateToProps, mapDispatchToProps)(
    injectDevice(Component)
)
