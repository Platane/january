import { Post as Component } from './component'
import { injectPositionTracker } from '../abstract/positionTracker'
import { injectDevice } from '../abstract/resolution'
import * as action from '../../action'
import { connect } from 'react-redux'

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

const mapDispatchToProps = {
    selectTag: action.selectTag,
}

export const Post = connect(mapStateToProps, mapDispatchToProps)(
    injectDevice(injectPositionTracker(Component))
)
