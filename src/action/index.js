import type { Post } from '../../type'
//
type ActionGoToPost = { type: 'goTo:post', postId: string }

export const goToPost = (postId: string): ActionGoToPost => ({
    type: 'goTo:post',
    postId,
})

//
type ActionGoToAbout = { type: 'goTo:about' }

export const goToAbout = (): ActionGoToAbout => ({
    type: 'goTo:about',
})

//
type ActionGoToHome = { type: 'goTo:home' }

export const goToHome = (): ActionGoToHome => ({
    type: 'goTo:home',
})

//
type ActionHydratePost = { type: 'hydratePost', posts: Array<Post> }

export const hydratePost = (posts: Array<Post>): ActionHydratePost => ({
    type: 'hydratePost',
    posts,
})

//
type ActionNavigatorRead = { type: 'navigatorRead', path: Array<string> }

export const navigatorRead = (path: Array<string>) => ({
    type: 'navigatorRead',
    path,
})

export type Action =
    | ActionNavigatorRead
    | ActionGoToPost
    | ActionHydratePost
    | ActionGoToAbout
    | ActionGoToHome
