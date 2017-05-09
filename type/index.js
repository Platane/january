import type { ImageBundle } from '../scripts/imageBundler/postImage'
import type { Tree } from '../scripts/contentParser/markdown/parser'

export type User = {
    id: string,
    name: string,
    pic: string,
}

export type Location = {
    name: string,
    lat: number,
    lng: number,
}

export type MediaImage = {
    type: 'image',
    name: string,
    image: ?ImageBundle,
    localPath: string,
}

export type Media = MediaImage

export type Post = {
    id: string,
    content: Tree,
    tags: Array<string>,
    author: User,
    date: number,
    title: string,
    medias: Array<Media>,
    locations: Array<Location>,

    // computed
    reading_duration?: number,
    content_preview?: string,
}
