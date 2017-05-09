require('babel-register')

const fs = require('fs')
const path = require('path')
const icon = require('./icon')

const iconDir = process.argv[2]
const targetDir = process.argv[3]

const options = {
    iconDir,
    targetDir,
    quality: 85,
    sizes: [16, 32, 48, 72, 96, 144, 168, 180, 192, 256, 512],
}

icon
    .bundle(options)
    .then(icons =>
        fs.writeFileSync(
            path.join(targetDir, 'icons.json'),
            JSON.stringify(icons)
        )
    )
