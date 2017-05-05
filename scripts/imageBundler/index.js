const fs = require('fs')
const md5 = require('md5')
const path = require('path')

import { getSize, convert } from './gm'

type Options = {
    targetDir: string,
    dimensions?: Array<[number, number]>,
    format?: 'jpg' | 'png',
    quality?: number,
}

type ImageBundle = {
    source: {
        url: string,
        dimension: [number, number],
    },
    resized: Array<{
        url: string,
        dimension: [number, number],
    }>,
    base64: string,
}

export const bundle = async (
    imagePath: string,
    options: Options
): Promise<ImageBundle> => {
    // read the image once
    const imageBuffer = fs.readFileSync(imagePath)

    const common_options = {
        commandName: process.env.GM_PATH || 'gm',
        format: options.format || 'jpg',
        quality: options.quality || 90,
        noProfile: true,
    }

    // get the image dimension
    const dimension = await getSize(imageBuffer, {})

    // get the image hash, to generate a unique name
    const hash = md5(imageBuffer).slice(0, 8)

    // write image, without resizing
    const source_name = `${hash}_source.jpg`
    fs.writeFileSync(
        path.join(options.targetDir, source_name),
        await convert(imageBuffer, common_options)
    )

    // generate a small image, to be used as blured image
    const small = await convert(imageBuffer, {
        ...common_options,
        dimension: [4, 4],
        format: 'bmp',
    })

    // generate resized images
    const resized = await Promise.all(
        (options.dimensions || []).map(async dimension => {
            const name = `${hash}_${dimension[0]}x${dimension[1]}.jpg`

            fs.writeFileSync(
                path.join(options.targetDir, name),
                await convert(imageBuffer, {
                    ...common_options,
                    dimension,
                })
            )

            return {
                dimension,
                url: name,
            }
        })
    )

    return {
        source: {
            url: source_name,
            dimension,
        },
        resized,
        base64: `data:image/bmp;base64,${small.toString('base64')}`,
    }
}
