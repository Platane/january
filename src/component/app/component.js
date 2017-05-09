import React from 'react'
import { AboutPage } from '../aboutPage'
import { PostPage } from '../postPage'
import { HomePage } from '../homePage'
import { Header } from '../header'
import { Title } from '../title'
import { Provider as DeviceResolutionProvider } from '../abstract/resolution'
import {
    Provider as PositionTrackerProvider,
} from '../abstract/positionTracker'
import style from './style.css'

export type Props = {
    path: string,
}

export const App = ({ path }: Props) => (
    <PositionTrackerProvider>
        <DeviceResolutionProvider>
            <div className={style.wrapper}>
                <div className={style.container}>
                    <div className={style.header}>
                        <Header />
                    </div>

                    <div className={style.content}>
                        {!path[0] && <HomePage />}
                        {'about' == path[0] && <AboutPage />}
                        {'post' == path[0] && <PostPage postId={path[1]} />}
                    </div>

                </div>

                <Title />
            </div>
        </DeviceResolutionProvider>
    </PositionTrackerProvider>
)
