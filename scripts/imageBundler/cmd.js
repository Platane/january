require('babel-register')

const fs = require('fs')
const path = require('path')
const u = require('./index')

const postDir = process.argv[2]
const targetDir = process.argv[3]

const posts = JSON.parse(
    fs.readFileSync(path.join(targetDir, 'posts.json')).toString()
)

const options = {
    targetDir,
    format: 'jpg',
    quality: 90,
    dimensions: [[100, 100], [800, 600]],
}

Promise.all(
    [].concat(
        ...posts.map(post =>
            post.medias.map(media =>
                u
                    .bundle(
                        path.join(postDir, post.id, media.localPath),
                        options
                    )
                    .then(image => (media.image = image))
            )
        )
    )
).then(() =>
    fs.writeFileSync(path.join(targetDir, 'posts.json'), JSON.stringify(posts))
)
