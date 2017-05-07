const fs = require('fs')
const path = require('path')
import { render } from './renderer'
import * as action from '../../src/action'

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
    safeMkdir(path.join(options.targetDir, 'post'))

    // get the base path as env var
    const BASE_PATH = (process.env.BASE_PATH || '/').split('/').filter(Boolean)

    // read the link in the webpackStat file
    const webpackStat = JSON.parse(
        fs.readFileSync(options.webpackStatPath).toString()
    )

    // read icons
    const icons = JSON.parse(
        fs.readFileSync(path.join(options.targetDir, 'icons.json')).toString()
    )

    const buildPath = file => '/' + [...BASE_PATH, file].join('/')

    const links = {
        icons,
        manifest: buildPath('manifest.json'),
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

    // for each post, write the page and json data
    posts.forEach(post => {
        // json data
        fs.writeFileSync(
            path.join('dist', 'post', post.id + '.json'),
            JSON.stringify(post)
        )

        // html render
        const post_page = render(links, [
            action.hydratePost([post]),
            action.goToPost(post.id),
        ])
        fs.writeFileSync(
            path.join('dist', 'post', post.id + '.html'),
            post_page
        )

        safeMkdir(path.join(options.targetDir, 'post', post.id))
        fs.writeFileSync(
            path.join('dist', 'post', post.id, 'index.html'),
            post_page
        )
    })
}
