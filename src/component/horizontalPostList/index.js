import React from 'react'
import { injectPositionTracker } from '../abstract/positionTracker'

import style from './style.css'

import { PostPreview } from './postPreview'

const createClickHandler = (goToPost, writePosition, postId) => event => {
    const { top, width, left, height } = event.target.getBoundingClientRect()
    writePosition(postId, { top, width, left, height })
    goToPost(postId)
}

const HorizontalPostList_ = ({ posts, goToPost, writePosition }) => (
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

export const HorizontalPostList = injectPositionTracker(HorizontalPostList_)
