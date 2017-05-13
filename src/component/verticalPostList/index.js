import React from 'react'
import { injectPositionTracker } from '../abstract/positionTracker'
import { ViewportTracker } from '../abstract/viewportTracker'
import { memoize } from '../../util/memoize'

import style from './style.css'

import { PostPreview } from './postPreview'

const createClickHandler = memoize(
    (goToPosts, writePosition, postId) => event => {
        const {
            top,
            width,
            left,
            height,
        } = event.target.getBoundingClientRect()
        writePosition(postId, { top, left, width, height })
        if ('undefined' !== typeof document && document.body)
            document.body.scrollTop = 0
        goToPosts(postId)
    }
)

const VerticalPostList_ = ({
    posts,
    goToPosts,
    writePosition,
    loadMorePosts,
}) => (
    <ViewportTracker onReachBottom={loadMorePosts} margin={400}>
        <div className={style.container}>
            {posts.map(post => (
                <div
                    key={post.id}
                    className={style.item}
                    onClick={createClickHandler(
                        goToPosts,
                        writePosition,
                        post.id
                    )}
                >
                    <PostPreview {...post} />
                </div>
            ))}
        </div>
    </ViewportTracker>
)

export const VerticalPostList = injectPositionTracker(VerticalPostList_)
