import React from 'react'
import style from './style.css'

import { Image } from '../../image'
import type { Post as Post_type } from '../../../../type'

export type Props = Post_type

export const PostPreview = ({ id, title, medias }: Props) => (
    <div className={style.container}>
        <Image
            image={medias[0] && medias[0].image}
            width={180}
            height={120}
            label={medias[0] && medias[0].name}
            borderRadius={6}
        />

        <div className={style.title}>{title}</div>
    </div>
)
