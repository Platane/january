import { TagCloud as Component } from './component'
import { injectPositionTracker } from '../abstract/positionTracker'
import * as action from '../../action'
import { connect } from 'react-redux'

const mapStateToProps = (state, { tags }) => ({
    tags,
    // tags: tags.filter(tag => tag !== state.selectTag),
})

const mapDispatchToProps = {
    selectTag: action.selectTag,
}

export const TagCloud = connect(mapStateToProps, mapDispatchToProps)(
    injectPositionTracker(Component)
)
