const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')

const post = 8084

const fileExist = function(path) {
    try {
        return fs.statSync(path).isFile()
    } catch (err) {
        return false
    }
}

http
    .createServer((req, res) => {
        const pathname = url.parse(req.url).pathname

        const fileUri = path.join(
            'dist',
            '/' === pathname ? 'index.html' : pathname
        )

        if (fileExist(fileUri))
            fs.createReadStream(fileUri).pipe(res, { end: true })
        else {
            res.statusCode = 404
            res.end()
        }
    })
    .listen(8084)

console.log(`serving on http://localhost:${post}`)
