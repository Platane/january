require('babel-register')

const fs = require('fs')
const path = require('path')
const postImage = require('./postImage')

const postDir = process.argv[2]
const targetDir = process.argv[3]

const posts = JSON.parse(
    fs.readFileSync(path.join(targetDir, 'posts.json')).toString()
)

const options = {
    targetDir,
    format: 'jpg',
    quality: 85,
    // dimensions: [[200, 200], [380, 240], [800, 600], [1200, 600]],
    dimensions: [[200, 200]],
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
).then(() =>
    fs.writeFileSync(path.join(targetDir, 'posts.json'), JSON.stringify(posts))
)
