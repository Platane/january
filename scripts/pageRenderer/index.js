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
    const BASE_PATH = (process.env.BASE_PATH || '/')
        .split('/')
        .filter(Boolean)
        .join('/')

    // read the link in the webpackStat file
    const webpackStat = JSON.parse(
        fs.readFileSync(options.webpackStatPath).toString()
    )

    const links = {
        appScript: `/${BASE_PATH}/` +
            webpackStat.chunks[0].files.find(x => x.match(/\.js$/)),
        appStyle: `/${BASE_PATH}/` +
            webpackStat.chunks[0].files.find(x => x.match(/\.css$/)),
    }

    // write the about page
    fs.writeFileSync(
        path.join('dist', 'about.html'),
        render(links, [action.hydratePost(posts), action.goToAbout()])
    )

    // write the home page
    fs.writeFileSync(
        path.join('dist', 'index.html'),
        render(links, [action.hydratePost(posts), action.goToHome()])
    )

    // for each post, write the page and json data
    posts.forEach(post => {
        // json data
        fs.writeFileSync(
            path.join('dist', 'post', post.id + '.json'),
            JSON.stringify(post)
        )

        // html render
        {
            fs.writeFileSync(
                path.join('dist', 'post', post.id + '.html'),
                render(links, [
                    action.hydratePost(posts),
                    action.goToPost(post.id),
                ])
            )
        }
    })
}
