import React from 'react'
import { AboutPage } from '../aboutPage'
import { PostPage } from '../postPage'
import { HomePage } from '../homePage'
import { Header } from '../header'
import { Title } from '../title'
import { Provider as DeviceResolutionProvider } from '../abstract/resolution'
import { Provider as PositionTrackerProvider } from '../abstract/positionTracker'
import style from './style.css'

export type Props = {
    page: 'post' | 'about' | 'home',
}

export const App = ({ page }: Props) => (
    <PositionTrackerProvider>
        <DeviceResolutionProvider>
            <div className={style.wrapper}>
                <div className={style.header}>
                    <Header />
                </div>
                <div className={style.container}>
                    <div className={style.content}>
                        {'home' === page && <HomePage />}
                        {'about' === page && <AboutPage />}
                        {'post' === page && <PostPage />}
                    </div>
                </div>

                <Title />
            </div>
        </DeviceResolutionProvider>
    </PositionTrackerProvider>
)
