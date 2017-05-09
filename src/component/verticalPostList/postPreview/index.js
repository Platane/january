import React from 'react'
import style from './style.css'

import { Image } from '../../image'
import { formatReadingDuration } from '../../post/component'
import type { Post as Post_type } from '../../../../type'

export type Props = Post_type

export const PostPreview = ({
    id,
    title,
    medias,
    content_preview,
    reading_duration,
}: Props) => (
    <div className={style.container}>

        <div className={style.image}>
            <Image
                image={medias[0] && medias[0].image}
                width={200}
                height={200}
                label={medias[0] && medias[0].name}
            />
        </div>

        <div className={style.content}>
            <div className={style.headerRow}>
                <div className={style.title}>{title}</div>
                <div className={style.readingDuration}>
                    {formatReadingDuration(reading_duration)}
                </div>
            </div>
            <div className={style.preview}>{content_preview}</div>
        </div>

    </div>
)
