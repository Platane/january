const fs = require('fs')
const md5 = require('md5')
const path = require('path')

import { render } from './renderer'
import * as action from '../../src/action'
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

const buildDataChunk = (chunck_size: number, posts: Array<Post>) => {
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

export const writePages = (
    posts: Array<Post>,
    options: {
        webpackStatPath: string,
        targetDir: string,
    }
) => {
    // prepare the directory
    safeMkdir(options.targetDir)

    // read the link in the webpackStat file
    const webpackStat = JSON.parse(
        fs.readFileSync(options.webpackStatPath).toString()
    )

    // read icons
    const icons = JSON.parse(
        fs.readFileSync(path.join(options.targetDir, 'icons.json')).toString()
    )

    const links = {
        icons,
        manifest: buildPath('manifest.json'),
        rss: buildPath('rss.xml'),
        appScript: buildPath(
            webpackStat.chunks[0].files.find(x => x.match(/\.js$/))
        ),
        appStyle: buildPath(
            webpackStat.chunks[0].files.find(x => x.match(/\.css$/))
        ),
    }

    // prepare the data
    const data = buildDataChunk(CHUNK_SIZE, posts)

    // write the data
    safeMkdir(path.join(options.targetDir, 'data'))
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

    // write the about page
    const about_page = render(links, [action.goToAbout()])
    fs.writeFileSync(path.join('dist', 'about.html'), about_page)

    // write the home page
    const home_page = render(links, [
        ...primaryTags.map(tag =>
            action.postsFetched(data[tag].top, tag, data[tag].id0)
        ),
        action.goToHome(),
    ])
    fs.writeFileSync(path.join('dist', 'index.html'), home_page)
    fs.writeFileSync(
        path.join('dist', '404.html'),
        '---\npermalink: /404.html\n---\n' + home_page
    )

    // write the category pages
    primaryTags.forEach(tag => {
        // make dir /<tag>/
        safeMkdir(path.join(options.targetDir, tag))

        const category_page = render(links, [
            action.postsFetched(data[tag].top, tag, data[tag].id0),
            action.selectTag(tag),
        ])
        fs.writeFileSync(
            path.join(options.targetDir, tag, 'index.html'),
            category_page
        )
    })

    // for each post, write the page
    posts.forEach(post => {
        const tag =
            post.tags.find(tag => primaryTags.includes(tag)) || primaryTags[0]

        // maje dir /<tag>/<post.id>/
        safeMkdir(path.join(options.targetDir, tag, post.id))

        // html render
        const post_page = render(links, [
            action.postsFetched([post]),
            action.goToPost(post.id),
        ])
        fs.writeFileSync(
            path.join(options.targetDir, tag, post.id, 'index.html'),
            post_page
        )
    })
}
