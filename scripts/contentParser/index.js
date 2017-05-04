const fs = require('fs')
const path = require('path')
import { parse as parseMarkDown } from './markdown/parser'

import type { Post } from '../../type'

const printTree = (tree, prefix = '') => {
    return [
        prefix + tree.type + ' ' + (tree.text || ''),
        ...(tree.children && tree.children.length
            ? [
                  prefix + '[',
                  ...[].concat(
                      ...tree.children.map(c => printTree(c, prefix + '  '))
                  ),
                  prefix + ']',
              ]
            : []),
    ].join('\n')
}

// /!\ side effect on the tree
const readTitle = tree => {
    const i = tree.children.findIndex(x => 'heading' === x.type)

    if (i < -1) throw new Error('no title found')

    const heading = tree.children.splice(i, 1)[0]

    return heading.children[0].text
}
const readDate = tree => {
    const parseDate = text => new Date(text)

    const i = tree.children.findIndex(
        x =>
            'blockquote' === x.type &&
            x.children[0] &&
            x.children[0].children[0] &&
            parseDate(x.children[0].children[0].text)
    )

    if (i < -1) throw new Error('no date found')

    const dateQuote = tree.children.splice(i, 1)[0]

    return parseDate(dateQuote.children[0].children[0].text).getTime()
}

const readMedias = tree => []

export const parsePost = (text: string): Post => {
    const mdTree = parseMarkDown(text)

    const title = readTitle(mdTree)
    const date = readDate(mdTree)
    const medias = readMedias(mdTree)

    return {
        id: Math.random().toString(16).slice(2),
        tags: [],
        title,
        date,
        medias,
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
    fs.readdirSync(options.postDir).map(dir => readPost(dir, options))
