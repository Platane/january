import React from 'react'
import style from './style.css'

import { Post } from './post'

import type { Post as Post_type } from '../../../type'

export type Props = {
    posts: Array<Post_type>,
    goToPost: () => any,
    device: 'palm' | 'desktop',
}

export const HomePage = ({ posts, goToPost, device }: Props) => (
    <div className={style.container}>
        {posts.map(post => (
            <div
                key={post.id}
                className={style.item}
                onClick={() => goToPost(post.id)}
            >
                <Post {...post} />
            </div>
        ))}
    </div>
)
