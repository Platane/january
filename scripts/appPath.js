const parse = url => {
    const split = url.split('/').filter(Boolean)

    if (split[0] && split[0].match(/https?:/)) split.shift()

    if (split[0] && split[0].match(/^[\w\.]+\.\w+$/))
        return {
            hostname: split[0],
            path: split.slice(1),
        }
    else
        return {
            hostname: '',
            path: split,
        }
}

const { hostname, path } = parse(
    process.env.ROOT_URL || process.env.BASE_PATH || ''
)

const build = file =>
    '/' + [...path, ...(file || '').split('/').filter(Boolean)].join('/')

const buildAbsolute = file => '//' + hostname + build(file)

module.exports = {
    buildAbsolute,
    build,
    dir: path.join('') + '/',
    path: path,
    hostname: hostname,
}
