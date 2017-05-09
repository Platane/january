import React from 'react'
import style from './style.css'

import { Post } from '../post'
import { SwipeablePostlist } from '../swipeablePostlist'
import { HorizontalPostList } from '../horizontalPostList'

import type { Post as Post_type } from '../../../type'

export type Props = {
    posts: Array<Post_type>,
    postId: string,
    goToPost: () => void,
    device: 'palm' | 'desktop',
}

const createGoToPost = goToPost => postId => {
    if ('undefined' !== typeof document && document.body)
        document.body.scrollTop = 0
    goToPost(postId)
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
                  <div>
                      <Post post={posts.find(({ id }) => id === postId)} />
                      <div className={style.footer}>
                          <HorizontalPostList
                              posts={posts.filter(({ id }) => id != postId)}
                              goToPost={createGoToPost(goToPost)}
                          />
                      </div>
                  </div>)
        : null
