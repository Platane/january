const fs = require('fs')
const md5 = require('md5')
const path = require('path')
import { build as buildPath } from '../appPath'

import { getSize, convert } from './gm'

const selectBestSource = (images, size) =>
    images.reduce(
        (best, x) =>
            !best || best.size === x.size || x.size > best.size ? x : best,
        null
    )

type Options = {
    iconDir: string,
    targetDir: string,
    sizes?: Array<number>,
    quality?: number,
}

export const bundle = async (options: Options): Promise<any> => {
    const common_options = {
        commandName: process.env.GM_PATH || 'gm',
        format: 'png',
        quality: options.quality,
        noProfile: true,
    }

    const icons = (await Promise.all(
        fs
            .readdirSync(options.iconDir)
            .filter(name => name.match(/(png|jpg|gif)$/))
            .map(async name => {
                const buffer = fs.readFileSync(path.join(options.iconDir, name))

                // get the image dimension
                const dimension = await getSize(buffer, common_options)

                return {
                    buffer,
                    size: dimension[0],
                }
            })
    )).sort((a, b) => (a.size < b.size ? 1 : -1))

    const hash = md5((icons[0] && icons[0].buffer) || '').slice(0, 8)

    return (await Promise.all(
        (options.sizes || []).map(async size => {
            const name = `icon_${hash}_${size}.png`

            const source = selectBestSource(icons, size)

            if (!source) return

            const buffer = source.size === size
                ? source.buffer
                : await convert(source.buffer, {
                      ...common_options,
                      dimension: [size, size],
                  })

            fs.writeFileSync(path.join(options.targetDir, name), buffer)

            return { size, url: buildPath(name) }
        })
    )).filter(Boolean)
}
