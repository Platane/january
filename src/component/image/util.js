type ImageVersion = { dimension: [number, number], url: string }

export const selectBestImage = (
    images: Array<ImageVersion>,
    width: number,
    height: number
): ?ImageVersion => {
    const error = (w, h) =>
        Math.abs(w - width) / width + Math.abs(h - height) / height

    return images.reduce(
        (best, x) =>
            !best || error(...best.dimension) > error(...x.dimension)
                ? x
                : best,
        null
    )
}
