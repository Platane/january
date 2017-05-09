import React from 'react'
import style from './style.css'

import { AnimateFromBox } from '../abstract/positionTracker'
import { PostContent } from '../postContent'
import { Image } from '../image'

import type { Post as Post_type } from '../../../type'

export type Props = {
    post: Post_type,
    device: 'palm' | 'desktop',
    getPosition: (elementKey: string) => Object,
}

const zeroPad = x => (x < 10 ? '0' + x : '' + x)

export const formatDate = timestamp => {
    const d = new Date(timestamp)
    return `${zeroPad(d.getDate())}/${zeroPad(d.getMonth() + 1)}/${d.getFullYear()}`
}
export const formatReadingDuration = (duration: number): string => {
    if (duration < 2) return '1 min'
    else if (duration < 10) return Math.floor(duration) + ' min'
    else return Math.floor(duration / 5) * 5 + ' min'
}

export const Post = ({ post, getPosition, device }: Props) => (
    <div className={style.container}>
        <div className={style.imageWrapper}>
            <div className={style.image}>
                <AnimateFromBox
                    elementKey={post.id}
                    origin={getPosition(post.id)}
                >
                    <Image
                        image={post.medias[0] && post.medias[0].image}
                        width={'desktop' === device ? 900 : 800}
                        height={600}
                    />
                </AnimateFromBox>
            </div>
        </div>
        <div className={style.body} key={post.id}>
            <div className={style.headerRow}>
                <div className={style.title}>{post.title}</div>
                <div className={style.date}>{formatDate(post.date)}</div>
                <div className={style.readingDuration}>
                    {formatReadingDuration(0 | post.reading_duration)}
                </div>
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
