import React from 'react'
import style from './style.css'

import { Post } from '../post'
import { SwipeablePostlist } from '../swipeablePostlist'
import { HorizontalPostList } from '../horizontalPostList'
import { memoize } from '../../util/memoize'

import type { Post as Post_type } from '../../../type'

export type Props = {
    nextPosts: Array<Post_type>,
    posts: Array<Post_type>,
    post: ?Post,
    goToPost: () => void,
    loadMorePosts: () => void,
    device: 'palm' | 'desktop',
    tag: string,
}

const createGoToPost = memoize(goToPost => postId => {
    if ('undefined' !== typeof document && document.body)
        document.body.scrollTop = 0
    goToPost(postId)
})
const createLoadMorePosts = memoize((loadMorePosts, tag) => () =>
    loadMorePosts(tag))

export const PostPage = ({
    device,
    post,
    posts,
    nextPosts,
    goToPost,
    tag,
    loadMorePosts,
}: Props) =>
    post
        ? ('palm' === device &&
              <SwipeablePostlist
                  post={post}
                  posts={posts}
                  goToPost={goToPost}
                  loadMorePosts={createLoadMorePosts(loadMorePosts, tag)}
              />) ||
              ('desktop' === device &&
                  <div>
                      <Post post={post} />
                      <div className={style.footer}>
                          <HorizontalPostList
                              posts={nextPosts}
                              goToPost={createGoToPost(goToPost)}
                          />
                      </div>
                  </div>)
        : null
