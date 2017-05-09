const fs = require('fs')
const path = require('path')
const appPath = require('./appPath')

const targetDir = process.argv[2]

const posts = JSON.parse(
    fs.readFileSync(path.join(targetDir, 'posts.json')).toString()
)

const wrap = (tag, content) => `<${tag}>${content}</${tag}>`

const toXML = o =>
    'object' !== typeof o
        ? o.toString()
        : Object.keys(o)
              .map(key => {
                  if (Array.isArray(o[key]))
                      return o[key].map(u => wrap(key, toXML(u))).join('')
                  else return wrap(key, toXML(o[key]))
              })
              .join('')

const content = [
    '<rss version="2.0">',
    toXML({
        channel: {
            description: "The best ideas are not popular yet. - Edouard's travel blog",
            title: 'Edouard',
            link: appPath.buildAbsolute(''),
            item: posts.map(post => {
                return {
                    title: post.title,
                    link: appPath.buildAbsolute('post/' + post.id),
                    guid: appPath.buildAbsolute('post/' + post.id),
                    pubDate: new Date(post.date).toUTCString(),
                }
            }),
        },
    }),
    '</rss>',
].join('')

fs.writeFileSync(path.join(targetDir, 'rss.xml'), content)
