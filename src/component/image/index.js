import React from 'react'
import style from './style.css'

import type { ImageBundle } from '../../../scripts/imageBundler/index'

export type Props = {
    image: ?ImageBundle,
}

export const Image = ({ image }: Props) => (
    <div
        className={style.image}
        style={{ backgroundImage: `url(${(image && image.base64) || ''})` }}
    />
)
