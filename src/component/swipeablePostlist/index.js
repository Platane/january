import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { Post } from '../post'

import style from './style.css'

const createChangeIndexHandler = (goToPost, posts) => i => goToPost(posts[i].id)

export const SwipeablePostlist = ({ postId, posts, goToPost }) => (
    <SwipeableViews
        enableMouseEvents={true}
        index={posts.findIndex(({ id }) => postId === id)}
        onChangeIndex={createChangeIndexHandler(goToPost, posts)}
    >
        {posts.map((post, i) => (
            <div className={style.slide} key={post.id}>
                <Post post={post} />
            </div>
        ))}
    </SwipeableViews>
)
