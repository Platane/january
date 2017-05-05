const fs = require('fs')
const path = require('path')
import { parse as parseMarkDown } from './markdown/parser'

import type { Tree } from './markdown/parser'
import type { Post } from '../../type'

import { find, findAll, extractText, prune } from './markdown/treeUtil'

const readTitle = tree => {
    const heading = find(x => 'heading' === x.type, tree)

    if (!heading) throw new Error('no title found')

    return {
        prunedTree: prune(tree, heading),
        title: extractText(heading),
    }
}
const readDate = tree => {
    const parseDate = text => new Date(text)

    const dateQuote = find(
        x => 'blockquote' === x.type && !!parseDate(extractText(x)),
        tree
    )

    if (!dateQuote) throw new Error('no date found')

    return {
        prunedTree: prune(tree, dateQuote),
        date: parseDate(extractText(dateQuote)).getTime(),
    }
}
const readMedias = tree =>
    findAll(x => 'image' === x.type, tree).map(x => ({
        type: 'image',
        name: x.alt || '',
        localPath: x.src || '',
        image: null,
    }))

export const parsePost = (text: string): Post => {
    let mdTree = parseMarkDown(text)

    const r_title = readTitle(mdTree)
    mdTree = r_title.prunedTree
    const title = r_title.title

    const r_date = readDate(mdTree)
    mdTree = r_date.prunedTree
    const date = r_date.date

    const medias = readMedias(mdTree)

    return {
        id: Math.random().toString(16).slice(2),
        tags: [],
        title,
        date,
        medias,
        locations: [],
        content: mdTree,
    }
}

// read one post
export const readPost = (
    dir: string,
    options: {
        postDir: string,
    }
) => {
    // read as string
    const text = fs
        .readFileSync(path.join(options.postDir, dir, 'index.md'))
        .toString()

    // parse
    const post = parsePost(text)

    post.id = dir

    return post
}

// read all the posts in the directory
export const readPosts = (options: { postDir: string }) =>
    // iterate throught all the directory in options.postDir
    fs
        .readdirSync(options.postDir)
        .map(dir => readPost(dir, options))
        .sort((a, b) => (a.date < b.date ? 1 : -1))
