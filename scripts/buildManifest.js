const fs = require('fs')
const path = require('path')

const targetDir = process.argv[2]

const icons = JSON.parse(
    fs.readFileSync(path.join(targetDir, 'icons.json')).toString()
)
const manifest = JSON.parse(fs.readFileSync('src/manifest.json').toString())

const BASE_PATH = (process.env.BASE_PATH || '/').split('/').filter(Boolean)

manifest.icons = icons.map(({ url, size }) => ({
    src: url,
    sizes: `${size}x${size}`,
    type: 'image/png',
}))

manifest.scope = '/' + BASE_PATH.join('/')

manifest.start_url = '/' + BASE_PATH.join('/')

fs.writeFileSync(
    path.join(targetDir, 'manifest.json'),
    JSON.stringify(manifest)
)
