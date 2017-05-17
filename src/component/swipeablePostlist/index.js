import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { Post } from '../post';
import { memoize } from '../../util/memoize';

import style from './style.css';

const createChangeIndexHandler = memoize(
    (goToPost, loadMorePosts, posts) => i => {
        goToPost(posts[i].id);
        if (i === posts.length - 1) loadMorePosts && loadMorePosts();
    }
);

export const SwipeablePostlist = ({ post, posts, goToPost, loadMorePosts }) => {
    const index = posts.findIndex(({ id }) => post.id === id);
    return (
        <SwipeableViews
            enableMouseEvents
            animateHeight
            index={index}
            onChangeIndex={createChangeIndexHandler(
                goToPost,
                loadMorePosts,
                posts
            )}
        >
            {posts.map((post, i) => (
                <div className={style.slide} key={post.id}>
                    {Math.abs(i - index) < 2 ? <Post post={post} /> : null}
                </div>
            ))}
        </SwipeableViews>
    );
};
