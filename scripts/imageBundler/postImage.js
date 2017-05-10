const fs = require('fs')
const md5 = require('md5')
const path = require('path')
const smartcrop = require('smartcrop-gm')
import { build as buildPath } from '../appPath'

import { getSize, convert } from './gm'

type Options = {
    targetDir: string,
    dimensions?: Array<[number, number]>,
    format?: 'jpg' | 'png',
    quality?: number,
}

export type ImageBundle = {
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
        format: options.format,
        quality: options.quality,
        noProfile: true,
    }

    // get the image dimension
    const source_dimension = await getSize(imageBuffer, {})

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

            let cropRect = {
                x: 0,
                y: 0,
                width: source_dimension[0],
                height: source_dimension[1],
            }

            try {
                const { topCrop } = await smartcrop.crop(imagePath, {
                    width: dimension[0],
                    height: dimension[1],
                })

                cropRect = topCrop
            } catch (err) {
                console.warn('could not use smartcrop', err)

                // fallbak : crop the middle
                const source_ratio = source_dimension[0] / source_dimension[1]
                const target_ratio = dimension[0] / dimension[1]

                if (source_ratio > target_ratio) {
                    cropRect.width = source_dimension[1] * target_ratio
                    cropRect.x = (source_dimension[0] - cropRect.width) * 0.5
                } else {
                    cropRect.height = source_dimension[0] / target_ratio
                    cropRect.y = (source_dimension[1] - cropRect.height) * 0.5
                }
            }

            fs.writeFileSync(
                path.join(options.targetDir, name),
                await convert(imageBuffer, {
                    ...common_options,
                    cropRect,
                    dimension,
                })
            )

            return {
                dimension,
                url: buildPath(name),
            }
        })
    )

    return {
        source: {
            url: buildPath(source_name),
            source_dimension,
        },
        resized,
        base64: `data:image/bmp;base64,${small.toString('base64')}`,
    }
}
