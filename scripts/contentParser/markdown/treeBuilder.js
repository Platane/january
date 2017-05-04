export const buildTreeFactory = ({
    isOpening,
    isClosing,
    getType,
    getContent,
}: {
    isOpening: (token: any) => boolean,
    isClosing: (token: any) => boolean,
    getType: (token: any) => string,
    getContent: (token: any) => Object,
}) => (tokens: Array<any>) => {
    const opened = []
    const ancestors = []

    // root node
    const root = { type: 'root', children: [] }

    // current node
    let x = root

    for (let i = 0; i < tokens.length; i++) {
        const type = getType(tokens[i])

        if (isOpening(tokens[i])) {
            // opening tag
            // create a new node, push it in the current one, set it as the current one

            opened.unshift(type)
            ancestors.unshift(x)

            ancestors[0].children.push((x = { type, children: [] }))
        } else if (isClosing(tokens[i])) {
            // closing tag
            // close the current node, backtrack to its ancestor

            // check for syntax error
            if (type !== opened[0]) throw new Error('syntax error')

            opened.shift()
            x = ancestors.shift()
        } else {
            // simple node
            // push it as child of the current node

            x.children.push(
                Object.assign({ type, children: [] }, getContent(tokens[i]))
            )
        }
    }

    if (x !== root) throw new Error('syntax error')

    return root
}
