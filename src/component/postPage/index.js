import { PostPage as Component } from './component'
import { connect } from 'react-redux'
import { injectDevice } from '../abstract/resolution'

import * as action from '../../action'

const mapStateToProps = state => ({
    post: state.selectedPost,
    posts: state.posts,
})

const mapDispatchToProps = {
    goToPost: action.goToPost,
}

export const PostPage = connect(mapStateToProps, mapDispatchToProps)(
    injectDevice(Component)
)
