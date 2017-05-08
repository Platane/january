import React from 'react'
import style from './style.css'

import { Post } from '../post'
import { SwipeablePostlist } from '../swipeablePostlist'

import type { Post as Post_type } from '../../../type'

export type Props = {
    posts: Array<Post_type>,
    postId: number,
    goToPost: () => void,
    device: 'palm' | 'desktop',
}

export const PostPage = ({ device, postId, posts, goToPost }: Props) =>
    posts.some(({ id }) => id === postId)
        ? ('palm' === device &&
              <SwipeablePostlist
                  postId={postId}
                  posts={posts}
                  goToPost={goToPost}
              />) ||
              ('desktop' === device &&
                  <Post post={posts.find(({ id }) => id === postId)} />)
        : null
