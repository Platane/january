import React from 'react'
import style from './style.css'

export type Props = {
    src: string,
}

export const Image = ({ src }: Props) => (
    <div className={style.image} style={{ backgroundImage: `url(${src})` }} />
)
