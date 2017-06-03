import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { injectPositionTracker } from '../abstract/positionTracker'
import { memoize } from '../../util/memoize'

import style from './style.css'

import { PostPreview } from './postPreview'

const createClickHandler = memoize(
    (goToPost, writePosition, postId) => event => {
        const {
            top,
            width,
            left,
            height,
        } = event.target.getBoundingClientRect()
        writePosition && writePosition(postId, { top, width, left, height })
        goToPost(postId)
    }
)

const ITEM_WIDTH = 190
const MARGE = 500

export class HorizontalPostList_ extends React.Component {
    onScroll = () => {
        if (!this.refs.container) return

        const { width } = this.refs.container.getBoundingClientRect()

        const maxDisplayed = width + this.refs.row.scrollLeft

        if (this.props.posts.length * ITEM_WIDTH < maxDisplayed + MARGE)
            this.props.loadMorePosts && this.props.loadMorePosts()
    }

    onResize = () => this.onScroll()

    onStepRight = () => {
        this.refs.row.scrollLeft =
            (Math.floor(this.refs.row.scrollLeft / ITEM_WIDTH) - 1) * ITEM_WIDTH

        this.onScroll()
    }
    onStepLeft = () => {
        this.refs.row.scrollLeft =
            (Math.floor(this.refs.row.scrollLeft / ITEM_WIDTH) + 1) * ITEM_WIDTH

        this.onScroll()
    }

    componentDidMount() {
        this.onScroll()
    }

    render() {
        const { posts, goToPost, writePosition } = this.props
        return (
            <div className={style.container} ref="container">
                {
                    <div
                        className={style.arrowRight}
                        onClick={this.onStepRight}
                    >
                        {'◀'}
                    </div>
                }
                <div className={style.row} ref="row" onScroll={this.onScroll}>
                    {posts.map(post => (
                        <div
                            key={post.id}
                            className={style.item}
                            onClick={
                                goToPost &&
                                    createClickHandler(
                                        goToPost,
                                        writePosition,
                                        post.id
                                    )
                            }
                        >
                            <PostPreview {...post} />
                        </div>
                    ))}
                </div>
                {
                    <div className={style.arrowLeft} onClick={this.onStepLeft}>
                        {'▶'}
                    </div>
                }
            </div>
        )
    }
}

export const HorizontalPostList = injectPositionTracker(HorizontalPostList_)
