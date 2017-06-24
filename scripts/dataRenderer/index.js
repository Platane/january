const fs = require('fs')
const md5 = require('md5')
const path = require('path')

import { primaryTags } from '../../src/reducer/selectedTag'

import { build as buildPath } from '../appPath'

import type { Post } from '../../type'

const safeMkdir = dirName => {
    try {
        fs.mkdirSync(dirName)
    } catch (err) {
        if ('EEXIST' != err.code) throw err
    }
}

export const buildDataChunk = (chunck_size: number, posts: Array<Post>) => {
    const chunkify = (chunck_size, posts) => {
        const chunks = []

        posts = posts.slice().reverse()

        while (posts.length) {
            const chunk = posts.splice(0, chunck_size)

            const hash = md5(JSON.stringify(chunk)).slice(0, 8)

            chunks.push({ posts: chunk, hash })
        }

        chunks.reverse()

        const [first, ...rest] = chunks

        const topPosts = [
            ...((first && first.posts) || []),
            ...((rest[0] && rest[0].posts) || []),
        ].slice(0, chunck_size)

        return {
            top: topPosts,
            id0: (rest[0] && rest[0].hash) || null,
            chunks: rest,
        }
    }

    const res: Object = {
        all: chunkify(chunck_size, posts),
    }

    primaryTags.forEach(
        tag =>
            (res[tag] = chunkify(
                chunck_size,
                posts.filter(post => post.tags.includes(tag))
            ))
    )

    return res
}

const CHUNK_SIZE = 6

export const writeData = (
    posts: Array<Post>,
    options: {
        targetDir: string,
    }
) => {
    // prepare the directory
    safeMkdir(options.targetDir)
    safeMkdir(path.join(options.targetDir, 'data'))

    // prepare the data
    const data = buildDataChunk(CHUNK_SIZE, posts)
    ;[...primaryTags, 'all'].forEach(tag => {
        safeMkdir(path.join(options.targetDir, 'data', tag))

        // write top.json
        {
            const content = {
                posts: data[tag].top,
                next: data[tag].id0,
            }
            fs.writeFileSync(
                path.join(options.targetDir, 'data', tag, 'top.json'),
                JSON.stringify(content)
            )
        }

        data[tag].chunks.forEach(({ posts, hash }, i) => {
            const next = data[tag].chunks[i + 1]

            const content = {
                posts,
                next: next && next.hash,
            }

            fs.writeFileSync(
                path.join(options.targetDir, 'data', tag, hash + '.json'),
                JSON.stringify(content)
            )
        })
    })
}
