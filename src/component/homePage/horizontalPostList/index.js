import React from 'react'
import style from './style.css'

import { Post } from '../post'

const createClickHandler = (goToPost, postId) => () => goToPost(postId)

export const HorizontalPostList = ({ posts, goToPost }) => (
    <div className={style.container}>
        {posts.map(post => (
            <div
                key={post.id}
                className={style.item}
                onClick={createClickHandler(goToPost, post.id)}
            >
                <Post {...post} />
            </div>
        ))}
    </div>
)
