import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { injectPositionTracker } from '../abstract/positionTracker'
import { memoize } from '../../util/memoize'

import style from './style.css'

import { Image } from '../image'

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

const ITEM_WIDTH = 220
const MARGE = 500

export class HorizontalPostList_ extends React.Component {
    onChangeIndex = (i: number) => {
        if (!this.refs.container) return

        const { width } = this.refs.container.getBoundingClientRect()

        const max = (width + MARGE) / ITEM_WIDTH

        if (this.props.posts.length < i + max)
            this.props.loadMorePosts && this.props.loadMorePosts()
    }

    componentDidMount() {
        this.onChangeIndex(0)
    }

    render() {
        const { posts, goToPost, writePosition } = this.props
        return (
            <div className={style.container} ref="container">
                <SwipeableViews
                    enableMouseEvents
                    slideStyle={{ width: ITEM_WIDTH + 'px' }}
                    onChangeIndex={this.onChangeIndex}
                >
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
                            <Image
                                image={post.medias[0] && post.medias[0].image}
                                width={200}
                                height={200}
                                label={post.medias[0] && post.medias[0].name}
                            />
                        </div>
                    ))}
                </SwipeableViews>
            </div>
        )
    }
}

export const HorizontalPostList = injectPositionTracker(HorizontalPostList_)
