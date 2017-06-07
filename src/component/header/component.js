import React from 'react'
import style from './style.css'

export type Props = {
    goToAbout: () => any,
    goToHome: () => any,
    folded: boolean,
    goingUp: boolean,
}

const s = (...classNames) => classNames.filter(Boolean).join(' ')

export const Header = ({ folded, goingUp, goToAbout, goToHome }: Props) =>
    <div
        className={s(
            style.container,
            folded && style.containerFolded,
            goingUp && style.containerGoingUp
        )}
    >

        <div className={style.separator} />

        <div className={style.centered}>
            <div className={style.row}>

                <div className={style.title} onClick={goToHome}>Edouard</div>

                <div className={style.about} onClick={goToAbout}>About</div>

            </div>
            <div className={style.subtitle}>
                The best ideas are not popular yet
            </div>
        </div>
    </div>
