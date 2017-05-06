import React from 'react'
import style from './style.css'
import { selectBestImage } from './util'
import type { ImageBundle } from '../../../scripts/imageBundler/index'

export type Props = {
    image?: ImageBundle,
    width?: number,
    height?: number,
}

export const Image = ({ image, width, height }: Props) => {
    const base64 = image && image.base64
    const bestImage = selectBestImage(
        (image && image.resized) || [],
        width || 800,
        height || 600
    )

    return (
        <div
            className={style.background}
            style={{
                backgroundImage: base64 && `url(${base64})`,
            }}
        >

            {bestImage &&
                <div
                    className={style.image}
                    style={{
                        backgroundImage: `url(${bestImage.url})`,
                    }}
                />}

        </div>
    )
}
