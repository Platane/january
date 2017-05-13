import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { Post } from '../post'
import { memoize } from '../../util/memoize'

import style from './style.css'

const createChangeIndexHandler = memoize((goToPost, posts) => i =>
    goToPost(posts[i].id))

export const SwipeablePostlist = ({ post, posts, goToPost }) => (
    <SwipeableViews
        enableMouseEvents
        animateHeight
        index={posts.findIndex(({ id }) => post.id === id)}
        onChangeIndex={createChangeIndexHandler(goToPost, posts)}
    >
        {posts.map((post, i) => (
            <div className={style.slide} key={post.id}>
                <Post post={post} />
            </div>
        ))}
    </SwipeableViews>
)
