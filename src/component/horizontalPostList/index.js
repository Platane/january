import React from 'react'
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
        writePosition(postId, { top, width, left, height })
        goToPost(postId)
    }
)

const HorizontalPostList_ = ({ posts, goToPost, writePosition }) => (
    <div className={style.container}>
        {posts.map(post => (
            <div
                key={post.id}
                className={style.item}
                onClick={createClickHandler(goToPost, writePosition, post.id)}
            >
                <Image
                    image={post.medias[0] && post.medias[0].image}
                    width={200}
                    height={200}
                    label={post.medias[0] && post.medias[0].name}
                />
            </div>
        ))}
    </div>
)

export const HorizontalPostList = injectPositionTracker(HorizontalPostList_)
