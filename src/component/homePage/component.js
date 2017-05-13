import React from 'react'
import style from './style.css'

import { HorizontalPostList } from '../horizontalPostList'
import { VerticalPostList } from '../verticalPostList'

import type { Post as Post_type } from '../../../type'

import { primaryTags } from '../../reducer/selectedTag'

export type Props = {
    selectedTag: string,
    posts: Array<Post_type>,
    goToPost: () => *,
    selectTag: (tag: string) => *,
    loadMorePosts: (tag: string) => *,
    device: 'palm' | 'desktop',
}

const createSelectTagHandler = (selectTag, tag) => () => selectTag(tag)

const createLoadMorePostsHandler = (loadMorePosts, tag) => () =>
    loadMorePosts(tag)

export const HomePage = ({
    posts,
    loadMorePosts,
    selectedTag,
    goToPost,
    selectTag,
    device,
}: Props) => (
    <div className={style.container}>

        {!selectedTag &&
            <div className={style.section}>
                <div
                    className={style.sectionLabel}
                    onClick={createSelectTagHandler(selectTag, 'world')}
                >
                    World
                </div>
                <HorizontalPostList
                    goToPost={goToPost}
                    posts={posts.filter(({ tags }) => tags.includes('world'))}
                />
            </div>}
        {!selectedTag &&
            <div className={style.section}>
                <div
                    className={style.sectionLabel}
                    onClick={createSelectTagHandler(selectTag, 'essential')}
                >
                    Essentials
                </div>
                <HorizontalPostList
                    goToPost={goToPost}
                    posts={posts.filter(({ tags }) =>
                        tags.includes('essential')
                    )}
                />
            </div>}

        <div className={style.section}>
            <div
                className={style.sectionLabel}
                onClick={
                    !selectedTag && createSelectTagHandler(selectTag, 'update')
                }
            >
                {selectedTag
                    ? (primaryTags.includes(selectedTag) ? '' : '#') +
                          selectedTag
                    : 'updates'}
            </div>
            <VerticalPostList
                goToPost={goToPost}
                loadMorePosts={
                    primaryTags.includes(selectedTag || 'update') &&
                        createLoadMorePostsHandler(
                            loadMorePosts,
                            selectedTag || 'update'
                        )
                }
                posts={posts.filter(({ tags }) =>
                    tags.includes(selectedTag || 'update')
                )}
            />
        </div>
    </div>
)
