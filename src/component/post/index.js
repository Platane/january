import { Post as Component } from './component'
import { connect } from 'react-redux'
import * as action from '../../action'

const mapStateToProps = (state, { post, postId }) =>
    post ||
    state.posts.find(({ id }) => id == postId) || {
        id: '',
        title: '',
        medias: [],
        locations: [],
        author: {},
        content: { children: [] },
    }

export const Post = connect(mapStateToProps)(Component)
