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
            dangerouslySetInnerHTML={{
                __html: `window._initState=${initState}`,
            }}
        />
        <script src={links.appScript} />
    </head>
)