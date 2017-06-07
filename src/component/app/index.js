import { App as Component } from './component'
import { connect } from 'react-redux'
import * as action from '../../action'

const mapStateToProps = state => ({
    page:
        ('about' === state.path[0] && 'about') ||
            (state.path[1] && 'post') ||
            'home',
})

export const App = connect(mapStateToProps, null)(Component)
