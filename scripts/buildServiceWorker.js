const fs = require('fs')
const path = require('path')
const babel = require('babel-core')
const appPath = require('./appPath')

const targetDir = process.argv[2]
const webpackStatPath = process.argv[3]

// read the link in the webpackStat file
const webpackStat = JSON.parse(fs.readFileSync(webpackStatPath).toString())

const links = {
    'root.html': appPath.build(''),
    'index.html': appPath.build('index.html'),
    'app.js': appPath.build(
        webpackStat.chunks[0].files.find(x => x.match(/\.js$/))
    ),
    'style.css': appPath.build(
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
