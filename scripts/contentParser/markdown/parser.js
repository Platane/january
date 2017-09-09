const MarkdownIt = require('markdown-it')
const markdownIt = new MarkdownIt()

import { extractText } from './treeUtil'

import { buildTreeFactory } from './treeBuilder'

const isOpening = ({ nesting }) => nesting === 1

const isClosing = ({ nesting }) => nesting === -1

const getType = ({ type }) => type.split('_')[0]

export type Tree = {
    type:
        | 'text'
        | 'image'
        | 'link'
        | 'inline'
        | 'root'
        | 'heading'
        | 'blockquote'
        | 'paragraph'
        | 'softbreak'
        | 'imageGroup',
    text?: string,
    src?: string,
    alt?: string,
    children: Array<Tree>,
}

const genUID = (): string =>
    Math.random()
        .toString(16)
        .slice(2, 10)

const getContent = x => {
    switch (getType(x)) {
        case 'inline':
            const node = buildTree(x.children)

            node.type = x.type

            return node

        case 'text':
            return { text: x.content }

        case 'image':
            extractText(buildTree(x.children))

            return {
                src: x.attrs.find(a => a[0] == 'src')[1],
                alt: extractText(buildTree(x.children)),
            }

        case 'link':
            return {
                src: x.attrs.find(a => a[0] == 'href')[1],
            }

        default:
            return {}
    }
}

const buildTree = buildTreeFactory({
    isOpening,
    isClosing,
    getType,
    getContent,
})

const pruneInline = (tree: Tree): Tree =>
    Object.assign(tree, {
        children: [].concat(
            ...tree.children.map(
                c =>
                    'inline' === c.type
                        ? c.children.map(pruneInline)
                        : [pruneInline(c)]
            )
        ),
    })

const seperateImageParagraph = (
    paragraphChildren: Array<Tree>
): Array<Tree> => {
    if (!paragraphChildren.length) return []

    const i = paragraphChildren.findIndex(({ type }) => 'image' === type)

    switch (i) {
        case -1:
            return [
                {
                    type: 'paragraph',
                    children: paragraphChildren,
                },
            ]

        case 0:
            let k = paragraphChildren.findIndex(
                tree => 'image' !== tree.type && extractText(tree).trim()
            )
            k = k === -1 ? Infinity : k

            return [
                {
                    type: 'imageGroup',
                    children: paragraphChildren
                        .slice(0, k)
                        .filter(({ type }) => 'image' === type),
                },
                ...seperateImageParagraph(paragraphChildren.slice(k)),
            ]

        default:
            return [
                {
                    type: 'paragraph',
                    children: paragraphChildren.slice(0, i),
                },
                ...seperateImageParagraph(paragraphChildren.slice(i)),
            ]
    }
}

const restructureParagraph = (tree: Tree): Tree =>
    Object.assign(tree, {
        children: [].concat(
            ...tree.children.map(
                c =>
                    'paragraph' === c.type
                        ? seperateImageParagraph(c.children)
                        : [restructureParagraph(c)]
            )
        ),
    })

export const parse = (text: string): Tree => {
    const tokens = markdownIt.parse(text, {})

    return restructureParagraph(pruneInline(buildTree(tokens)))
}
