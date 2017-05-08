const fs = require('fs')
const path = require('path')
const babel = require('babel-core')

const targetDir = process.argv[2]
const webpackStatPath = process.argv[3]

// read the link in the webpackStat file
const webpackStat = JSON.parse(fs.readFileSync(webpackStatPath).toString())

// get the base path as env var
const BASE_PATH = (process.env.BASE_PATH || '/').split('/').filter(Boolean)

const buildPath = file => '/' + [...BASE_PATH, file].join('/')

const links = {
    'root.html': '/' + BASE_PATH.join('/'),
    'index.html': buildPath('index.html'),
    'app.js': buildPath(
        webpackStat.chunks[0].files.find(x => x.match(/\.js$/))
    ),
    'style.css': buildPath(
        webpackStat.chunks[0].files.find(x => x.match(/\.css$/))
    ),
}

const source = fs.readFileSync('src/serviceWorker/index.js').toString()

const { code } = babel.transform(source, {
    babelrc: false,
    presets: ['flow'],
    plugins: [['transform-string-literal-replace', { patterns: links }]],
})

fs.writeFileSync(path.join(targetDir, 'sw.js'), code)
