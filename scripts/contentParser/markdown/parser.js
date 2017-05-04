const MarkdownIt = require('markdown-it')
const markdownIt = new MarkdownIt()

import { buildTreeFactory } from './treeBuilder'

const isOpening = ({ nesting }) => nesting === 1

const isClosing = ({ nesting }) => nesting === -1

const getType = ({ type }) => type.split('_')[0]

type Tree = {
    type:
        | 'text'
        | 'image'
        | 'link'
        | 'inline'
        | 'root'
        | 'heading'
        | 'blockquote'
        | 'paragraph',
    text?: string,
    src?: string,
    alt?: string,
    children: Array<Tree>,
}

const getContent = x => {
    switch (x.type) {
        case 'inline':
            const node = buildTree(x.children)

            node.type = x.type

            return node

        case 'text':
            return { text: x.content }

        case 'image':
            return {
                src: x.attrs.find(a => a[0] == 'src')[1],
                alt: x.attrs.find(a => a[0] == 'alt')[1],
            }

        case 'link':
            return {
                src: x.attrs.find(a => a[0] == 'src')[1],
                alt: x.attrs.find(a => a[0] == 'alt')[1],
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

const pruneTree = (tree: Tree): Tree =>
    Object.assign(tree, {
        children: [].concat(
            ...tree.children.map(
                c =>
                    'inline' === c.type
                        ? c.children.map(pruneTree)
                        : [pruneTree(c)]
            )
        ),
    })

export const parse = (text: string): Tree => {
    const tokens = markdownIt.parse(text, {})

    return pruneTree(buildTree(tokens))
}
