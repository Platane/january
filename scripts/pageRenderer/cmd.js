require('babel-register')
const fs = require('fs')
const path = require('path')
const u = require('./index')

const targetDir = process.argv[2]
const webpackStatPath = process.argv[3]

const posts = JSON.parse(
    fs.readFileSync(path.join(targetDir, 'posts.json')).toString()
)

u.writePages(posts, { targetDir, webpackStatPath })
