import React from 'react'
import style from './style.css'

export type Props = {
    goToAbout: () => any,
    goToHome: () => any,
}

export const Header = ({ goToAbout, goToHome }: Props) => (
    <div className={style.container}>

        <div className={style.row}>

            <div className={style.title} onClick={goToHome}>Edouard</div>

            <div className={style.about} onClick={goToAbout}>About</div>

        </div>
        <div className={style.subtitle}>The best ideas are not popular yet</div>
    </div>
)
