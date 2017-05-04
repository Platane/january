import { PostPage as Component } from './component'
import { connect } from 'react-redux'
import * as action from '../../action'

const mapStateToProps = (state, { postId }) =>
    state.posts.find(({ id }) => id == postId) || {
        medias: [],
        locations: [],
        author: {},
    }

export const PostPage = connect(mapStateToProps)(Component)
