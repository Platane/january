import React from 'react'
import style from './style.css'

import { PostContent } from '../postContent'
import { Image } from '../image'

import type { Post as Post_type } from '../../../type'

export type Props = {
    post: Post_type,
    getPosition: (elementKey: string) => Object,
}

const zeroPad = x => (x < 10 ? '0' + x : '' + x)

const formatDate = timestamp => {
    const d = new Date(timestamp)
    return `${zeroPad(d.getDate())}/${zeroPad(d.getMonth())}/${d.getFullYear()}`
}

class AnimateFromBox extends React.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.elementKey != nextProps.elementKey
    }

    afterRender = () => {
        if (!this.refs.item || !this.refs.item.animate || !this.props.origin)
            return

        const origin = this.props.origin
        const target = this.refs.item.getBoundingClientRect()

        const animationKey = [
            {
                width: `${origin.width}px`,
                height: `${origin.height}px`,
                transform: `translate3d(${origin.left - target.left}px,${origin.top - target.top}px,0)`,
            },
            {
                width: `${target.width}px`,
                height: `${target.height}px`,
                transform: 'translate3d(0,0,0)',
            },
        ]

        this.refs.item.animate(animationKey, { duration: 430, easing: 'ease' })
    }

    render() {
        if ('undefined' !== typeof requestAnimationFrame)
            requestAnimationFrame(this.afterRender)

        return (
            <div
                ref="item"
                style={{ width: '100%', height: '100%', position: 'relative' }}
            >
                {React.Children.only(this.props.children)}
            </div>
        )
    }
}

export const Post = ({ post, getPosition }: Props) => (
    <div>
        <div className={style.image}>
            <AnimateFromBox elementKey={post.id} origin={getPosition(post.id)}>
                <Image image={post.medias[0] && post.medias[0].image} />
            </AnimateFromBox>
        </div>
        <div className={style.body} key={post.id}>
            <div className={style.headerRow}>
                <div className={style.title}>{post.title}</div>
                <div className={style.date}>{formatDate(post.date)}</div>
            </div>
            <div className={style.content}>
                <PostContent {...post} />
            </div>
            <div className={style.footer}>
                <div className={style.tagRow}>
                    {post.tags.map(tag => (
                        <div key={tag} className={style.tag}>{tag}</div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)
