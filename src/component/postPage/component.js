import React from 'react'
import style from './style.css'

import { Post } from '../post'

import type { Post as Post_type } from '../../../type'

export type Props = Post_type | {}

export const PostPage = (props: Props) =>
    props.id ? <Post {...props} /> : null
