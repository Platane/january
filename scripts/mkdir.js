const fs = require('fs')

const safeMkdir = dirName => {
    try {
        fs.mkdirSync(dirName)
    } catch (err) {
        if ('EEXIST' != err.code) throw err
    }
}

safeMkdir(process.argv[2])
