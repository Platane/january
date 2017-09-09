import React from 'react'
import style from './style.css'
import { Image } from '../image'
import type { Tree } from '../../../scripts/contentParser/markdown/parser'

const Text = ({ tree }) => {
    switch (tree.type) {
        case 'em':
        case 'strong':
            return (
                <span className={style[tree.type]}>
                    {tree.children.map((x, i) => <Text key={i} tree={x} />)}
                </span>
            )

        case 'text':
            return <span className={style.textLeaf}>{tree.text}</span>

        case 'link':
            return (
                <a className={style.link} href={tree.src}>
                    {tree.children.map((x, i) => <Text key={i} tree={x} />)}
                </a>
            )

        case 'softbreak':
            return <br />

        default:
            return null
    }
}

const Paragraph = ({ tree }: Tree) => (
    <p className={style.paragraph}>
        {tree.children.map((x, i) => <Text key={i} tree={x} />)}
    </p>
)

const Heading = ({ tree }: Tree) => (
    <p className={style.heading}>
        {tree.children.map((x, i) => <Text key={i} tree={x} />)}
    </p>
)

const Blockquote = ({ tree }: Tree) => (
    <div className={style.blockquote}>
        {tree.children.map(
            (x, i) =>
                x.type === 'paragraph' ? <Paragraph key={i} tree={x} /> : null
        )}
    </div>
)

const ImageGroup = ({ tree, medias }) => (
    <div className={style.imageGroup}>
        {tree.children.map((c, i) => (
            <div key={i} className={style.figure}>
                <div className={style.imageWrapper}>
                    <div className={style.image}>
                        <Image
                            width={900}
                            height={600}
                            image={
                                (medias.find(m => c.src === m.localPath) || {})
                                    .image
                            }
                            label={c.alt}
                        />
                    </div>
                </div>
                <div key={i} className={style.label}>
                    {c.alt}
                </div>
            </div>
        ))}
    </div>
)

type Props = { content: Tree, medias: Array<any> }

export const PostContent = ({ content, medias }: Props) => (
    <div className={style.container}>
        {content.children.map((subTree, i) => {
            switch (subTree.type) {
                case 'imageGroup':
                    return <ImageGroup key={i} tree={subTree} medias={medias} />
                case 'paragraph':
                    return <Paragraph key={i} tree={subTree} />
                case 'heading':
                    return <Heading key={i} tree={subTree} />
                case 'blockquote':
                    return <Blockquote key={i} tree={subTree} />
            }
        })}
    </div>
)
