import { Header as Component } from './component'
import { wrap } from './scrollSpy'
import { connect } from 'react-redux'
import * as action from '../../action'
import type { State } from '../../reducer'

const mapStateToProps = (state: State, { postId }) => ({
    posts: state.posts,
})

const mapDispatchToProps = {
    goToHome: action.goToHome,
    goToAbout: action.goToAbout,
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(
    wrap(Component)
)
