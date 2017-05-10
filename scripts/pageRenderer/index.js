const fs = require('fs')
const path = require('path')
import { render } from './renderer'
import * as action from '../../src/action'
import { primaryTags } from '../../src/reducer/selectedTag'

import {
    build as buildPath,
    buildAbsolute as buildAbsolutePath,
} from '../appPath'

import type { Post } from '../../type'

const safeMkdir = dirName => {
    try {
        fs.mkdirSync(dirName)
    } catch (err) {
        if ('EEXIST' != err.code) throw err
    }
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

    // write the about page
    const about_page = render(links, [action.goToAbout()])
    fs.writeFileSync(path.join('dist', 'about.html'), about_page)

    // write the home page
    const home_page = render(links, [
        action.hydratePost(posts),
        action.goToHome(),
    ])
    fs.writeFileSync(path.join('dist', 'index.html'), home_page)

    // write the category pages
    primaryTags.forEach(tag => {
        // make dir /<tag>/
        safeMkdir(path.join(options.targetDir, tag))

        const category_page = render(links, [
            action.hydratePost(posts),
            action.selectTag(tag),
        ])
        fs.writeFileSync(
            path.join(options.targetDir, tag, 'index.html'),
            category_page
        )
    })

    // for each post, write the page and json data
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
