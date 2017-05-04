import { HomePage as Component } from './component'
import { connect } from 'react-redux'
import * as action from '../../action'

const mapStateToProps = (state, { postId }) => ({
    posts: state.posts,
})

const mapDispatchToProps = {
    goToPost: action.goToPost,
}

export const HomePage = connect(mapStateToProps, mapDispatchToProps)(Component)
