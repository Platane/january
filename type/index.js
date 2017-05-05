import type { ImageBundle } from '../scripts/imageBundler'

export type PostType = 'update' | 'essential'

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
    // type        : PostType,
    tags: Array<string>,
    author: User,
    date: number,
    title: string,
    body: string,
    medias: Array<Media>,
    locations: Array<Location>,
}
