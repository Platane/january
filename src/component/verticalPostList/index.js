import React from 'react'
import { injectPositionTracker } from '../abstract/positionTracker'

import style from './style.css'

import { PostPreview } from './postPreview'

const createClickHandler = (goToPost, writePosition, postId) => event => {
    const { top, width, left, height } = event.target.getBoundingClientRect()
    writePosition(postId, { top, width, left, height })
    if ('undefined' !== typeof document && document.body)
        document.body.scrollTop = 0
    goToPost(postId)
}

const VerticalPostList_ = ({ posts, goToPost, writePosition }) => (
    <div className={style.container}>
        {posts.map(post => (
            <div
                key={post.id}
                className={style.item}
                onClick={createClickHandler(goToPost, writePosition, post.id)}
            >
                <PostPreview {...post} />
            </div>
        ))}
    </div>
)

export const VerticalPostList = injectPositionTracker(VerticalPostList_)
