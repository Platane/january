import React from 'react'
import style from './style.css'

import { Image } from '../../image'

import type { Post as Post_type } from '../../../../type'

export type Props = Post_type

export const Post = ({ id, title, medias, body }: Props) => (
    <div className={style.container}>

        <div className={style.image}>
            <Image image={medias[0] && medias[0].image} />
        </div>

        <div className={style.title}>{title}</div>

    </div>
)
