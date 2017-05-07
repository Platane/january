require('babel-register')

const fs = require('fs')
const path = require('path')
const postImage = require('./postImage')
const icon = require('./icon')

const postDir = process.argv[2]
const iconDir = process.argv[3]
const targetDir = process.argv[4]

const posts = JSON.parse(
    fs.readFileSync(path.join(targetDir, 'posts.json')).toString()
)

const options = {
    iconDir,
    targetDir,
    format: 'jpg',
    quality: 85,
    dimensions: [[300, 200], [800, 600]],
    sizes: [16, 32, 48, 72, 96, 144, 168, 180, 192],
}

Promise.all(
    [].concat(
        ...posts.map(post =>
            post.medias.map(media =>
                postImage
                    .bundle(
                        path.join(postDir, post.id, media.localPath),
                        options
                    )
                    .then(image => (media.image = image))
            )
        )
    )
)
    .then(() =>
        fs.writeFileSync(
            path.join(targetDir, 'posts.json'),
            JSON.stringify(posts)
        )
    )
    .then(() => icon.bundle(options))
    .then(icons =>
        fs.writeFileSync(
            path.join(targetDir, 'icons.json'),
            JSON.stringify(icons)
        )
    )
