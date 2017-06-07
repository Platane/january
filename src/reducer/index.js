import { reducePosts } from './posts'
import { reduceSelectedPost } from './selectedPost'
import { reduceSelectedTag } from './selectedTag'
import { reduceFetcher } from './fetcher'
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

    version: string,

    fetcher: {
        toFetch: Array<string>,
        next: Object,
        ended: Object,
    },
}

// first layer of reduce, init the state if its null
const reduceInit = (state: ?State): State =>
    state || {
        posts: [],
        tags: [],
        selectedTag: null,
        selectedPost: null,
        selectedPostId: null,
        path: [],

        version: process.env.VERSION,

        fetcher: {
            toFetch: [],
            next: {},
            ended: {},
        },
    }

const reduceLayers = [
    reduceInit,
    reducePosts,
    reduceSelectedPost,
    reduceSelectedTag,
    reducePath,
    reduceFetcher,
]

export const reduce = (state: State, action: Action): State =>
    reduceLayers.reduce((state, reduce) => reduce(state, action), state)
