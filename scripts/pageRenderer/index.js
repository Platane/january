const fs = require('fs')
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

        posts = posts.slice()

        while (posts.length)
            chunks.push(posts.splice(0, chunck_size))

        return {
            toInclude: chunks[0] || [],
            id0: 0,
            id1: 1,
            chunks,
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
    const data = buildDataChunk(6, posts)

    // write the data
    ;[...primaryTags, 'all'].forEach(tag =>
        data[tag].chunks.forEach((chunk, i) =>
            fs.writeFileSync(
                path.join(options.targetDir, `posts_${tag}_${i}.json`),
                JSON.stringify(chunk)
            )
        )
    )
    const summary = posts.map(post => ({
        title: post.title,
        date: post.date,
        tags: post.tags,
        medias: post.medias[0] ? [post.medias[0]] : [],
    }))
    fs.writeFileSync(
        path.join(options.targetDir, 'summary.json'),
        JSON.stringify(summary)
    )

    // write the about page
    const about_page = render(links, [action.goToAbout()])
    fs.writeFileSync(path.join('dist', 'about.html'), about_page)

    // write the home page
    const home_page = render(links, [
        action.hydratePost(
            [].concat(...primaryTags.map(tag => data[tag].toInclude))
        ),
        action.goToHome(),
    ])
    fs.writeFileSync(path.join('dist', 'index.html'), home_page)

    // write the category pages
    primaryTags.forEach(tag => {
        // make dir /<tag>/
        safeMkdir(path.join(options.targetDir, tag))

        const category_page = render(links, [
            action.hydratePost(data[tag].toInclude),
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
            action.hydratePost([post]),
            action.goToPost(post.id),
        ])
        fs.writeFileSync(
            path.join(options.targetDir, tag, post.id, 'index.html'),
            post_page
        )
    })
}
