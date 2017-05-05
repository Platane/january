import type { Tree } from './parser'

export const printTree = (tree: Tree, prefix?: string = '') => {
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

export const find = (
    match: (tree: Tree, path: Array<string>, ancestors: Array<Tree>) => boolean,
    tree: Tree,
    ancestors?: Array<Tree> = []
): Tree | null =>
    match(tree, [tree, ...ancestors].reverse().map(x => x.type), ancestors)
        ? tree
        : tree.children.reduce(
              (f, c) => f || find(match, c, [tree, ...ancestors]),
              null
          )

export const findAll = (
    match: (tree: Tree, path: Array<string>, ancestors: Array<Tree>) => boolean,
    tree: Tree,
    matched?: Array<Tree> = []
): Array<Tree> => {
    const f = find(
        (x, ...rest) => match(x, ...rest) && matched.indexOf(x) === -1,
        tree
    )
    return f ? findAll(match, tree, [...matched, f]) : matched
}

export const extractText = (tree: Tree): string =>
    'string' === typeof tree.text
        ? tree.text
        : tree.children.reduce((s, c) => s + extractText(c), '')

export const prune = (tree: Tree, subTreeToRemove: Tree) => ({
    ...tree,
    children: tree.children
        .filter(x => x != subTreeToRemove)
        .map(x => prune(x, subTreeToRemove)),
})
