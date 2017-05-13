import React from 'react'
import style from './style.css'

import { Post } from '../post'
import { SwipeablePostlist } from '../swipeablePostlist'
import { HorizontalPostList } from '../horizontalPostList'
import { memoize } from '../../util/memoize'

import type { Post as Post_type } from '../../../type'

export type Props = {
    posts: Array<Post_type>,
    post: ?Post,
    goToPost: () => void,
    device: 'palm' | 'desktop',
}

const createGoToPost = memoize(goToPost => postId => {
    if ('undefined' !== typeof document && document.body)
        document.body.scrollTop = 0
    goToPost(postId)
})

export const PostPage = ({ device, post, posts, goToPost }: Props) =>
    post
        ? ('palm' === device &&
              <SwipeablePostlist
                  postId={post.id}
                  posts={posts}
                  goToPost={goToPost}
              />) ||
              ('desktop' === device &&
                  <div>
                      <Post post={post} />
                      <div className={style.footer}>
                          <HorizontalPostList
                              posts={posts.filter(({ id }) => id != post.id)}
                              goToPost={createGoToPost(goToPost)}
                          />
                      </div>
                  </div>)
        : null
