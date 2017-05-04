import { App as Component } from './component'
import { connect } from 'react-redux'
import * as action from '../../action'

const mapStateToProps = state => ({
    path: state.path || [],
})

const mapDispatchToProps = {
    goToPost: action.goToPost,
}

export const App = connect(mapStateToProps, mapDispatchToProps)(Component)
