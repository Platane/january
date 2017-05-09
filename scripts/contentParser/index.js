const fs = require('fs')
const path = require('path')
import { parse as parseMarkDown } from './markdown/parser'

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
const readTags = tree => {
    const parseTags = text =>
        (text.match(/\s*tags\s*:(.*)$/) || ['', ''])[1]
            .split(',')
            .map(x => x.trim().toLowerCase())

    const tagsQuote = find(
        x =>
            'blockquote' === x.type &&
            !!extractText(x).match(/\s*tags\s*:(.*)$/),
        tree
    )

    if (!tagsQuote) throw new Error('no tags found')

    return {
        prunedTree: prune(tree, tagsQuote),
        tags: parseTags(extractText(tagsQuote)),
    }
}
const readMedias = tree =>
    findAll(x => 'image' === x.type, tree)
        .filter((x, i, arr) => i === arr.findIndex(u => u.src === x.src))
        .map(x => ({
            type: 'image',
            name: x.alt || '',
            localPath: x.src || '',
            image: null,
        }))

const pruneFirstImage = tree =>
    tree.children[0] &&
        tree.children[0].children[0] &&
        'imageGroup' === tree.children[0].type
        ? prune(tree, tree.children[0].children[0])
        : tree

export const parsePost = (text: string): Post => {
    let mdTree = parseMarkDown(text)

    const r_title = readTitle(mdTree)
    mdTree = r_title.prunedTree
    const title = r_title.title

    const r_date = readDate(mdTree)
    mdTree = r_date.prunedTree
    const date = r_date.date

    let tags = []
    try {
        const r_tags = readTags(mdTree)
        mdTree = r_tags.prunedTree
        tags = r_tags.tags
    } catch (err) {}

    const medias = readMedias(mdTree)

    mdTree = pruneFirstImage(mdTree)

    return {
        id: Math.random().toString(16).slice(2),
        tags,
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
