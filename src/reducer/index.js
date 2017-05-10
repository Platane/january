import { reducePosts } from './posts'
import { reduceSelectedPost } from './selectedPost'
import { reduceSelectedTag } from './selectedTag'
import { reducePath } from './path'

import type { Action } from '../action'
import type { Post } from '../../type'

export type State = {
    posts: Array<Post>,
    tags: Array<string>,

    selectedPost: ?Post,
    selectedPostId: ?string,

    selectedTag: ?string,

    path: Array<string>,
    toFetch: Array<string>,
}

// first layer of reduce, init the state if its null
const reduceInit = (state: ?State): State =>
    state || {
        posts: [],
        tags: [],
        selectedPost: null,
        selectedPostId: null,
        path: [],
        toFetch: ['posts.json'],
    }

const reduceLayers = [
    reduceInit,
    reducePosts,
    reduceSelectedPost,
    reduceSelectedTag,
    reducePath,
]

export const reduce = (state: State, action: Action): State =>
    reduceLayers.reduce((state, reduce) => reduce(state, action), state)
