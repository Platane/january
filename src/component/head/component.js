import React from 'react'

export type Props = {
    title: string,
    description: string,
    image_url: ?string,
    image_width: ?number,
    image_height: ?number,

    initState: string,

    links: {
        appScript: string,
        appStyle: string,
        icons: Array<{ size: number, url: string }>,
    },
}

export const Head = ({
    title,
    description,
    image_url,
    image_width,
    image_height,
    initState,
    links,
}: Props) => (
    <head>
        <title>{title}</title>

        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        {links.manifest && <link rel="manifest" href={links.manifest} />}
        <meta name="theme-color" content="#333" />

        {links.icons.some(x => 180 === x.size) &&
            <link
                rel="apple-touch-icon"
                type="image/png"
                sizes="180x180"
                href={links.icons.find(x => 180 === x.size).url}
            />}
        {links.icons.some(x => 32 === x.size) &&
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href={links.icons.find(x => 32 === x.size).url}
            />}
        {links.icons.some(x => 16 === x.size) &&
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href={links.icons.find(x => 16 === x.size).url}
            />}

        <meta
            name="twitter:card"
            content={image_url ? 'summary_large_image' : 'summary'}
        />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {image_url && <meta name="twitter:image" content={image_url} />}

        {image_url && <meta property="og:image" content={image_url} />}
        {image_url &&
            image_width &&
            <meta property="og:image:width" content={image_width} />}
        {image_url &&
            image_height &&
            <meta property="og:image:height" content={image_height} />}

        <meta content="object" property="og:article" />
        <meta content={title} property="og:title" />
        <meta property="og:description" content={description} />
        <meta description={description} />

        <link rel="stylesheet" type="text/css" href={links.appStyle} />

        <script
            async
            dangerouslySetInnerHTML={{
                __html: `window._initState=${initState}`,
            }}
        />
        <script async src={links.appScript} />
    </head>
)
