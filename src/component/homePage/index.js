import { HomePage as Component } from './component'
import { connect } from 'react-redux'
import * as action from '../../action'
import { injectDevice } from '../abstract/resolution'

const mapStateToProps = (state, { postId }) => ({
    posts: state.posts,
    selectedTag: state.selectedTag,
})

const mapDispatchToProps = {
    goToPost: action.goToPost,
    selectTag: action.selectTag,
}

export const HomePage = connect(mapStateToProps, mapDispatchToProps)(
    injectDevice(Component)
)
