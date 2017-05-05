require('babel-register')

const u = require('./index')

u
    .bundle('./src/content/post/hello/bagan.jpg', {
        targetDir: 'dist',
        dimensions: [[100, 100], [300, 300]],
    })
    .then(x => console.log(x))
