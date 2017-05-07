import React from 'react'
import style from './style.css'

import { PostContent } from '../postContent'
import { Image } from '../image'

import type { Post as Post_type } from '../../../type'

export type Props = Post_type | {}

export const PostPage = (props: Props) => (
    <div>
        <div className={style.image}>
            <Image image={props.medias[0] && props.medias[0].image} />
        </div>
        <PostContent {...props} />
    </div>
)
