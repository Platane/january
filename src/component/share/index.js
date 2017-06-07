import React from 'react'
import style from './style.css'

export type Props = {
    title: string,
}

const getUrl = () =>
    ('undefined' != typeof window && window.location && window.location.href) ||
    null

const computeSmsBody = ({ title }) => encodeURIComponent(title + ' ' + getUrl())

export const Share = (props: Props) =>
    <div className={style.container}>
        <a className={style.link} href={`sms:?body=${computeSmsBody(props)}`}>
            share via sms
        </a>
    </div>
