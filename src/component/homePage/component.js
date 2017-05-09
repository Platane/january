import React from 'react'
import style from './style.css'

import { HorizontalPostList } from '../horizontalPostList'

import type { Post as Post_type } from '../../../type'

export type Props = {
    posts: Array<Post_type>,
    goToPost: () => any,
    device: 'palm' | 'desktop',
}

export const HomePage = ({ posts, goToPost, device }: Props) => (
    <div className={style.container}>
        <div className={style.section}>
            <div className={style.sectionLabel}>World</div>
            <HorizontalPostList
                goToPost={goToPost}
                posts={posts.filter(({ tags }) => tags.includes('world'))}
            />
        </div>
        <div className={style.section}>
            <div className={style.sectionLabel}>Essentials</div>
            <HorizontalPostList
                goToPost={goToPost}
                posts={posts.filter(({ tags }) => tags.includes('essentials'))}
            />
        </div>
    </div>
)
