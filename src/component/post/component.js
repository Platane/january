import React from 'react'
import style from './style.css'

import { PostContent } from '../postContent'
import { Image } from '../image'

import type { Post as Post_type } from '../../../type'

export type Props = { post: Post_type }

const zeroPad = x => (x < 10 ? '0' + x : '' + x)

const formatDate = timestamp => {
    const d = new Date(timestamp)
    return `${zeroPad(d.getDate())}/${zeroPad(d.getMonth())}/${d.getFullYear()}`
}

export const Post = ({ post }: Props) => (
    <div>
        <div className={style.image}>
            <Image image={post.medias[0] && post.medias[0].image} />
        </div>
        <div className={style.body}>
            <div className={style.headerRow}>
                <div className={style.title}>{post.title}</div>
                <div className={style.date}>{formatDate(post.date)}</div>
            </div>
            <div className={style.content}>
                <PostContent {...post} />
            </div>
            <div className={style.footer}>
                <div className={style.tagRow}>
                    {post.tags.map(tag => (
                        <div key={tag} className={style.tag}>{tag}</div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)
