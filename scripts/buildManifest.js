const fs = require('fs')
const path = require('path')
const appPath = require('./appPath')

const targetDir = process.argv[2]

const icons = JSON.parse(
    fs.readFileSync(path.join(targetDir, 'icons.json')).toString()
)
const manifest = JSON.parse(fs.readFileSync('src/manifest.json').toString())

manifest.icons = icons.map(({ url, size }) => ({
    src: url,
    sizes: `${size}x${size}`,
    type: 'image/png',
}))

manifest.scope = appPath.build('')

manifest.start_url = appPath.build('')

fs.writeFileSync(
    path.join(targetDir, 'manifest.json'),
    JSON.stringify(manifest)
)
